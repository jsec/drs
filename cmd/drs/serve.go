package main

import (
	"context"
	"errors"
	"log/slog"
	"os"

	"github.com/urfave/cli/v3"

	"github.com/jsec/drs/internal/api"
	"github.com/jsec/drs/internal/database"
)

func serveCommand(logger *slog.Logger) *cli.Command {
	return &cli.Command{
		Name:  "serve",
		Usage: "run the API server",
		Action: func(ctx context.Context, _ *cli.Command) error {
			dsn := os.Getenv("DATABASE_URL")
			if dsn == "" {
				return errors.New("DATABASE_URL is required")
			}

			pool, err := database.NewPool(ctx, dsn)
			if err != nil {
				return err
			}
			defer pool.Close()

			return api.Serve(ctx, logger, database.New(pool))
		},
	}
}
