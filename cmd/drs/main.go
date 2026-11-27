package main

import (
	"cmp"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"strings"
	"syscall"

	charmlog "github.com/charmbracelet/log"

	"github.com/jsec/drs/internal/etl"
)

func main() {
	appEnv := os.Getenv("APP_ENV")
	logger := setupLogger(appEnv)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	if err := run(ctx, logger, appEnv, strings.Join(os.Args[1:], " ")); err != nil {
		logger.Error("command failed", "err", err)
		os.Exit(1)
	}
}

func run(ctx context.Context, logger *slog.Logger, appEnv string, command string) error {
	databaseURL := os.Getenv("DATABASE_URL")
	githubToken := os.Getenv("GITHUB_TOKEN")

	if databaseURL == "" {
		return errors.New("DATABASE_URL is required")
	}

	switch command {
	case "serve":
		return serve(ctx, logger, databaseURL, cmp.Or(os.Getenv("PORT"), "3000"), appEnv)
	case "etl load":
		return etl.Load(ctx, logger, databaseURL, githubToken)
	case "etl build":
		return etl.Build(ctx, logger)
	case "etl refresh":
		if err := etl.Load(ctx, logger, databaseURL, githubToken); err != nil {
			return err
		}

		return etl.Build(ctx, logger)
	default:
		return fmt.Errorf("unknown command %q, expected one of: serve, etl load, etl build, etl refresh", command)
	}
}

func setupLogger(appEnv string) *slog.Logger {
	switch appEnv {
	case "", "dev":
		return slog.New(charmlog.New(os.Stderr))
	default:
		return slog.New(slog.NewJSONHandler(os.Stdout, nil))
	}
}
