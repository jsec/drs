package main

import (
	"context"
	"log/slog"

	"github.com/urfave/cli/v3"

	"github.com/jsec/drs/internal/etl"
)

func etlCommand(logger *slog.Logger, config config) *cli.Command {
	return &cli.Command{
		Name:  "etl",
		Usage: "data pipeline commands",
		Commands: []*cli.Command{
			{
				Name:  "load",
				Usage: "load the latest f1db dump",
				Action: func(ctx context.Context, _ *cli.Command) error {
					return etl.Load(ctx, logger, config.databaseURL, config.githubToken)
				},
			},
			{
				Name:  "build",
				Usage: "rebuild the effone database",
				Flags: etlFlags(),
				Action: func(ctx context.Context, cmd *cli.Command) error {
					pool, err := openPool(ctx, config.databaseURL)
					if err != nil {
						return err
					}
					defer pool.Close()

					return etl.Build(ctx, logger, pool, cmd.String("schema"), cmd.String("target"))
				},
			},
			{
				Name:  "refresh",
				Usage: "load the latest dump, then rebuild the effone database",
				Flags: etlFlags(),
				Action: func(ctx context.Context, cmd *cli.Command) error {
					pool, err := openPool(ctx, config.databaseURL)
					if err != nil {
						return err
					}
					defer pool.Close()

					return etl.Refresh(ctx, logger, pool, config.databaseURL, config.githubToken, cmd.String("schema"), cmd.String("target"))
				},
			},
		},
	}
}

func etlFlags() []cli.Flag {
	return []cli.Flag{
		&cli.StringFlag{
			Name:  "schema",
			Value: "f1db",
			Usage: "source schema for dbt",
		},
		&cli.StringFlag{
			Name:  "target",
			Value: "dev",
			Usage: "dbt target",
		},
	}
}
