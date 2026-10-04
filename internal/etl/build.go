package etl

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/exec"
)

func Build(ctx context.Context, logger *slog.Logger) error {
	logger.Info("rebuilding database")

	cmd := exec.CommandContext(ctx, "uv", "run", "dbt", "build", "--project-dir", "./dbt", "--profiles-dir", "./dbt")
	cmd.Dir = "etl"
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("dbt build failed: %w", err)
	}

	return nil
}
