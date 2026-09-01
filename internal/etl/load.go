package etl

import (
	"archive/zip"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

type asset struct {
	Name               string `json:"name"`
	BrowserDownloadURL string `json:"browser_download_url"`
}

type release struct {
	TagName string  `json:"tag_name"`
	Assets  []asset `json:"assets"`
}

const (
	assetName  = "f1db-sql-postgresql.zip"
	fileName   = "f1db-sql-postgresql.sql"
	releaseURL = "https://api.github.com/repos/f1db/f1db/releases/latest"
)

var httpClient = &http.Client{Timeout: 30 * time.Second}

func Load(ctx context.Context, logger *slog.Logger) error {
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		return errors.New("GITHUB_TOKEN is required")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return errors.New("DATABASE_URL is required")
	}

	logger.Info("getting latest f1db release")
	version, downloadURL, err := getLatestRelease(ctx, token)
	if err != nil {
		return err
	}

	logger.Info("found latest f1db release", "version", version)

	logger.Info("downloading dump file")
	dumpPath, cleanup, err := downloadDumpFile(ctx, downloadURL)
	if err != nil {
		return err
	}
	defer cleanup()

	logger.Info("loading dump file")
	if err := loadDumpFile(ctx, databaseURL, dumpPath); err != nil {
		return err
	}
	logger.Info("loaded dump file")

	return nil
}

func getLatestRelease(ctx context.Context, token string) (version, downloadURL string, err error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, releaseURL, nil)
	if err != nil {
		return "", "", err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", "", err
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return "", "", fmt.Errorf("fetching latest release failed: %s", resp.Status)
	}

	var r release
	if err := json.NewDecoder(resp.Body).Decode(&r); err != nil {
		return "", "", err
	}

	for _, asset := range r.Assets {
		if asset.Name == assetName {
			return r.TagName, asset.BrowserDownloadURL, nil
		}
	}

	return "", "", fmt.Errorf("could not find %s in release assets", assetName)
}

func downloadDumpFile(ctx context.Context, url string) (dumpPath string, cleanup func(), err error) {
	tmpDir, err := os.MkdirTemp("", "f1db-*")
	if err != nil {
		return "", nil, err
	}
	cleanup = func() { _ = os.RemoveAll(tmpDir) }

	zipPath := filepath.Join(tmpDir, assetName)
	if err := downloadFile(ctx, url, zipPath); err != nil {
		cleanup()
		return "", nil, err
	}

	dumpPath = filepath.Join(tmpDir, fileName)
	if err := extractDump(zipPath, dumpPath); err != nil {
		cleanup()
		return "", nil, err
	}

	return dumpPath, cleanup, nil
}

func downloadFile(ctx context.Context, url, dest string) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return err
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("downloading dump file failed: %s", resp.Status)
	}

	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer func() { _ = out.Close() }()

	if _, err := io.Copy(out, resp.Body); err != nil {
		return err
	}

	return nil
}

func extractDump(zipPath, dest string) error {
	reader, err := zip.OpenReader(zipPath)
	if err != nil {
		return err
	}
	defer func() { _ = reader.Close() }()

	for _, file := range reader.File {
		if file.Name != fileName {
			continue
		}

		return writeZipEntry(file, dest)
	}

	return fmt.Errorf("could not find %s in downloaded archive", fileName)
}

func writeZipEntry(file *zip.File, dest string) error {
	rc, err := file.Open()
	if err != nil {
		return err
	}
	defer func() { _ = rc.Close() }()

	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer func() { _ = out.Close() }()

	if _, err := io.Copy(out, rc); err != nil {
		return err
	}

	return nil
}

func loadDumpFile(ctx context.Context, databaseURL, dumpPath string) error {
	cmd := exec.CommandContext(
		ctx,
		"psql",
		databaseURL,
		"-q",
		"-v", "ON_ERROR_STOP=1",
		"-c", "drop schema if exists f1db cascade",
		"-c", "create schema f1db",
		"-c", "set search_path to f1db",
		"-f", dumpPath,
	)
	cmd.Env = append(os.Environ(), "PGOPTIONS=-c client_min_messages=warning")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("restoring from dump file failed: %w", err)
	}

	return nil
}
