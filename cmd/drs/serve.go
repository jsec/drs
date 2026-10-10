package main

import (
	"context"
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/urfave/cli/v3"

	"github.com/jsec/drs/internal/api"
	"github.com/jsec/drs/internal/database"
)

func serveCommand(logger *slog.Logger, config config) *cli.Command {
	return &cli.Command{
		Name:   "serve",
		Usage:  "run the API server",
		Before: config.requireDatabaseURL,
		Action: func(ctx context.Context, _ *cli.Command) error {
			cfg, err := pgxpool.ParseConfig(config.databaseURL)
			if err != nil {
				return err
			}

			cfg.MaxConns = 10
			cfg.MinConns = 2

			pool, err := pgxpool.NewWithConfig(ctx, cfg)
			if err != nil {
				return err
			}
			defer pool.Close()

			return api.Serve(ctx, logger, database.New(pool), config.port)
		},
	}
}
