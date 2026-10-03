package main

import (
	"context"
	"log/slog"

	"github.com/urfave/cli/v3"

	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/etl"
)

func etlCommand(logger *slog.Logger, config config) *cli.Command {
	return &cli.Command{
		Name:  "etl",
		Usage: "data pipeline commands",
		Commands: []*cli.Command{
			{
				Name:   "load",
				Before: config.requireDatabaseURL,
				Usage:  "load the latest source data dumps",
				Action: func(ctx context.Context, _ *cli.Command) error {
					return etl.Load(ctx, logger, config.databaseURL, config.githubToken)
				},
			},
			{
				Name:   "build",
				Before: config.requireDatabaseURL,
				Usage:  "rebuild the effone database",
				Action: func(ctx context.Context, _ *cli.Command) error {
					pool, err := database.NewPool(ctx, config.databaseURL)
					if err != nil {
						return err
					}
					defer pool.Close()

					return etl.Build(ctx, logger, pool)
				},
			},
			{
				Name:   "refresh",
				Before: config.requireDatabaseURL,
				Usage:  "load the latest source dumps, then rebuild the effone database",
				Action: func(ctx context.Context, _ *cli.Command) error {
					pool, err := database.NewPool(ctx, config.databaseURL)
					if err != nil {
						return err
					}
					defer pool.Close()

					if err := etl.Load(ctx, logger, config.databaseURL, config.githubToken); err != nil {
						return err
					}

					return etl.Build(ctx, logger, pool)
				},
			},
		},
	}
}
