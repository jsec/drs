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
	"path/filepath"
)

func loadF1DB(ctx context.Context, logger *slog.Logger, databaseURL, token string) error {
	if token == "" {
		return errors.New("GITHUB_TOKEN is required")
	}

	logger.Info("getting latest f1db release")
	version, downloadURL, err := getLatestRelease(ctx, token)
	if err != nil {
		return fmt.Errorf("getting latest f1db release: %w", err)
	}

	logger.Info("found latest f1db release", "version", version)

	logger.Info("downloading dump file")
	dumpPath, cleanup, err := downloadF1dbDump(ctx, downloadURL)
	if err != nil {
		return fmt.Errorf("downloading f1db dump: %w", err)
	}
	defer cleanup()

	logger.Info("loading dump file")
	if err := loadDumpFile(ctx, databaseURL, dumpPath); err != nil {
		return fmt.Errorf("loading f1db dump: %w", err)
	}
	logger.Info("loaded dump file")

	return nil
}

func getLatestRelease(ctx context.Context, token string) (version, downloadURL string, err error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, f1dbURL, nil)
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

func downloadF1dbDump(ctx context.Context, url string) (dumpPath string, cleanup func(), err error) {
	tmpDir, err := os.MkdirTemp("", "f1db-*")
	if err != nil {
		return "", nil, err
	}
	cleanup = func() { _ = os.RemoveAll(tmpDir) }

	zipPath := filepath.Join(tmpDir, assetName)
	if err := downloadFile(ctx, url, zipPath); err != nil {
		cleanup()
		return "", nil, fmt.Errorf("downloading dump file: %w", err)
	}

	dumpPath = filepath.Join(tmpDir, fileName)
	if err := extractDump(zipPath, dumpPath); err != nil {
		cleanup()
		return "", nil, fmt.Errorf("extracting dump file: %w", err)
	}

	return dumpPath, cleanup, nil
}

func loadDumpFile(ctx context.Context, databaseURL, dumpPath string) error {
	err := execSQL(
		ctx,
		databaseURL,
		nil,
		"-c", "drop schema if exists f1db cascade",
		"-c", "create schema f1db",
		"-c", "set search_path to f1db",
		"-f", dumpPath,
	)
	if err != nil {
		return fmt.Errorf("restoring from dump file failed: %w", err)
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
