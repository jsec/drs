package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	charmlog "github.com/charmbracelet/log"
	"github.com/urfave/cli/v3"
)

func main() {
	config := loadConfig()
	logger := setupLogger(config.appEnv)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	cmd := &cli.Command{
		Name:  "drs",
		Usage: "DRS CLI",
		Commands: []*cli.Command{
			serveCommand(logger, config),
			etlCommand(logger, config),
		},
	}

	if err := cmd.Run(ctx, os.Args); err != nil {
		logger.Error("command failed", "err", err)
		os.Exit(1)
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
