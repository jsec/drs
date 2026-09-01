package etl

import (
	"context"
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Refresh(ctx context.Context, logger *slog.Logger, pool *pgxpool.Pool, databaseURL, githubToken, schema, target string) error {
	if err := Load(ctx, logger, databaseURL, githubToken); err != nil {
		return err
	}

	return Build(ctx, logger, pool, schema, target)
}
