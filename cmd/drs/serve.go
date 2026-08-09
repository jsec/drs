package main

import (
	"context"
	"log/slog"

	"github.com/urfave/cli/v3"

	"github.com/jsec/drs/internal/api"
	"github.com/jsec/drs/internal/database"
)

func serveCommand(logger *slog.Logger) *cli.Command {
	return &cli.Command{
		Name:  "serve",
		Usage: "run the API server",
		Action: func(ctx context.Context, _ *cli.Command) error {
			pool, err := openPool(ctx)
			if err != nil {
				return err
			}
			defer pool.Close()

			return api.Serve(ctx, logger, database.New(pool))
		},
	}
}
