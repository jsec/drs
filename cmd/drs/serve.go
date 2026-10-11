package main

import (
	"context"
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/jsec/drs/internal/api"
	"github.com/jsec/drs/internal/database"
)

func serve(ctx context.Context, logger *slog.Logger, config config) error {
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
}
