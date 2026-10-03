package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPool(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, err
	}

	cfg.ConnConfig.RuntimeParams["search_path"] = "effone"

	cfg.MaxConns = 10
	cfg.MinConns = 2

	return pgxpool.NewWithConfig(ctx, cfg)
}
