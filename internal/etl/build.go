package etl

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"os/exec"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/jsec/drs/internal/database"
)

type dbtVars struct {
	RefreshID  int64  `json:"refresh_id"`
	F1dbSchema string `json:"f1db_schema"`
}

var refreshTables = []string{
	"seasons",
	"races",
	"drivers",
	"constructors",
	"circuits",
	"race_results",
	"sprint_results",
	"qualifying_results",
	"pit_stops",
	"driver_standings_snapshots",
	"constructor_standings_snapshots",
	"driver_season_summaries",
	"constructor_season_summaries",
}

func Build(ctx context.Context, logger *slog.Logger, pool *pgxpool.Pool, schema, target string) (err error) {
	queries := database.New(pool)

	logger.Info("creating refresh record")

	refreshID, err := queries.CreateRefreshRun(ctx, database.CreateRefreshRunParams{
		Status:        "running",
		SourceVersion: pgtype.Text{String: "f1db", Valid: true},
	})
	if err != nil {
		return err
	}

	defer func() {
		if err != nil {
			markErr := queries.MarkRefreshFailed(ctx, database.MarkRefreshFailedParams{
				RefreshID:    refreshID,
				ErrorMessage: pgtype.Text{String: err.Error(), Valid: true},
			})
			if markErr != nil {
				logger.Error("could not mark refresh record as failed", "err", markErr)
			}
		}
	}()

	logger.Info("rebuilding database")
	if err = runDBT(ctx, refreshID, schema, target); err != nil {
		return err
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
	if err = queries.MarkRefreshSucceeded(ctx, database.MarkRefreshSucceededParams{
		RefreshID: refreshID,
		RowCounts: countsJSON,
	}); err != nil {
		return err
	}

	return nil
}

func runDBT(ctx context.Context, refreshID int64, schema, target string) error {
	vars, err := json.Marshal(dbtVars{RefreshID: refreshID, F1dbSchema: schema})
	if err != nil {
		return err
	}

	cmd := exec.CommandContext(
		ctx,
		"uv", "run", "dbt", "build",
		"--project-dir", "./dbt",
		"--profiles-dir", "./dbt",
		"--target", target,
		"--vars", string(vars),
	)
	cmd.Dir = "etl"
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("dbt build failed: %w", err)
	}

	return nil
}

func rowCounts(ctx context.Context, pool *pgxpool.Pool) (map[string]int64, error) {
	counts := make(map[string]int64, len(refreshTables))

	for _, table := range refreshTables {
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
