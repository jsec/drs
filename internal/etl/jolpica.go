package etl

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"io"
	"log/slog"
	"strings"
)

const (
	jolpicaDumpURL      = "https://api.jolpi.ca/data/dumps/download/delayed/?dump_type=sql"
	jolpicaDumpFileName = "jolpica-f1-dump.sql"
)

func loadJolpica(ctx context.Context, logger *slog.Logger, databaseURL string) error {
	logger.Info("downloading delayed Jolpica SQL dump")

	file, err := openZipEntry(ctx, jolpicaDumpURL, jolpicaDumpFileName)
	if err != nil {
		return fmt.Errorf("opening Jolpica dump: %w", err)
	}
	defer func() { _ = file.Close() }()

	var dump bytes.Buffer
	if err := rewriteJolpicaSchema(&dump, file); err != nil {
		return fmt.Errorf("rewriting Jolpica dump: %w", err)
	}

	logger.Info("loading Jolpica dump")
	err = execSQL(
		ctx,
		databaseURL,
		&dump,
		"--single-transaction",
		"-c", "drop schema if exists jolpica cascade",
		"-c", "create schema jolpica",
		"-f", "-",
	)
	if err != nil {
		return fmt.Errorf("restoring Jolpica dump: %w", err)
	}

	return nil
}

func rewriteJolpicaSchema(dst *bytes.Buffer, src io.Reader) error {
	scanner := bufio.NewScanner(src)
	scanner.Buffer(nil, 1<<20)

	for scanner.Scan() {
		line := strings.ReplaceAll(scanner.Text(), "public.", "jolpica.")
		dst.WriteString(line + "\n")
		if !strings.HasPrefix(line, "COPY ") {
			continue
		}

		for scanner.Scan() {
			dst.WriteString(scanner.Text() + "\n")
			if scanner.Text() == `\.` {
				break
			}
		}
	}

	return scanner.Err()
}
