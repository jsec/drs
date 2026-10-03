package etl

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
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
	dump, err := openZipEntry(ctx, downloadURL, fileName)
	if err != nil {
		return fmt.Errorf("opening f1db dump: %w", err)
	}
	defer func() { _ = dump.Close() }()

	logger.Info("loading dump file")
	err = execSQL(
		ctx,
		databaseURL,
		dump,
		"-c", "drop schema if exists f1db cascade",
		"-c", "create schema f1db",
		"-c", "set search_path to f1db",
		"-f", "-",
	)
	if err != nil {
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
