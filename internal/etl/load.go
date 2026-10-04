package etl

import (
	"archive/zip"
	"bytes"
	"context"
	"fmt"
	"io"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
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
	assetName = "f1db-sql-postgresql.zip"
	fileName  = "f1db-sql-postgresql.sql"
	f1dbURL   = "https://api.github.com/repos/f1db/f1db/releases/latest"
)

var httpClient = &http.Client{Timeout: 30 * time.Second}

func Load(ctx context.Context, logger *slog.Logger, databaseURL, token string) error {
	if err := loadF1DB(ctx, logger, databaseURL, token); err != nil {
		return fmt.Errorf("loading F1DB: %w", err)
	}

	if err := loadJolpica(ctx, logger, databaseURL); err != nil {
		return fmt.Errorf("loading Jolpica: %w", err)
	}

	return nil
}

func openZipEntry(ctx context.Context, url, name string) (fs.File, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "drs-etl")

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("downloading %s: %w", url, err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("downloading %s failed: %s", url, resp.Status)
	}

	archive, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("downloading %s: %w", url, err)
	}

	reader, err := zip.NewReader(bytes.NewReader(archive), int64(len(archive)))
	if err != nil {
		return nil, fmt.Errorf("opening archive: %w", err)
	}

	return reader.Open(name)
}

func execSQL(ctx context.Context, databaseURL string, stdin io.Reader, args ...string) error {
	cmd := exec.CommandContext(
		ctx,
		"psql",
		append([]string{databaseURL, "-q", "-v", "ON_ERROR_STOP=1"}, args...)...,
	)
	cmd.Env = append(os.Environ(), "PGOPTIONS=-c client_min_messages=warning")
	cmd.Stdin = stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}
