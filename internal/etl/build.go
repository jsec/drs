package etl

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"os/exec"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/jsec/drs/internal/database"
)

func Build(ctx context.Context, logger *slog.Logger, pool *pgxpool.Pool) (err error) {
	queries := database.New(pool)

	logger.Info("creating refresh record")

	refreshID, err := queries.CreateRefreshRun(ctx, "running")
	if err != nil {
		return err
	}

	defer func() {
		if err != nil {
			cleanupCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 10*time.Second)
			defer cancel()

			markErr := queries.MarkRefreshFailed(cleanupCtx, refreshID, pgtype.Text{String: err.Error(), Valid: true})
			if markErr != nil {
				logger.Error("could not mark refresh record as failed", "err", markErr)
			}
		}
	}()

	logger.Info("rebuilding database")
	if err = runDBTBuild(ctx); err != nil {
		return fmt.Errorf("dbt build failed: %w", err)
	}

	logger.Info("getting row counts")
	counts, err := rowCounts(ctx, pool)
	if err != nil {
		return err
	}

	countsJSON, err := json.Marshal(counts)
	if err != nil {
		return err
	}

	logger.Info("finalizing refresh record")
	if err = queries.MarkRefreshSucceeded(ctx, refreshID, countsJSON); err != nil {
		return err
	}

	return nil
}

func runDBTBuild(ctx context.Context) error {
	cmd := exec.CommandContext(ctx, "uv", "run", "dbt", "build", "--project-dir", "./dbt", "--profiles-dir", "./dbt")
	cmd.Dir = "etl"
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}

func rowCounts(ctx context.Context, pool *pgxpool.Pool) (map[string]int64, error) {
	rows, err := pool.Query(ctx, `
		select table_name
		from information_schema.tables
		where table_schema = 'effone'
			and table_type = 'BASE TABLE'
			and table_name <> 'refresh_runs'
	`)
	if err != nil {
		return nil, fmt.Errorf("listing effone tables: %w", err)
	}

	tables, err := pgx.CollectRows(rows, pgx.RowTo[string])
	if err != nil {
		return nil, fmt.Errorf("listing effone tables: %w", err)
	}

	counts := make(map[string]int64, len(tables))

	for _, table := range tables {
		query := fmt.Sprintf(
			"select count(*) as row_count from %s",
			pgx.Identifier{"effone", table}.Sanitize(),
		)

		var count int64
		if err := pool.QueryRow(ctx, query).Scan(&count); err != nil {
			return nil, fmt.Errorf("failed to count rows for table %s: %w", table, err)
		}

		counts[table] = count
	}

	return counts, nil
}
