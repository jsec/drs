package api

import (
	"log/slog"

	"github.com/jsec/drs/internal/database"
)

type application struct {
	logger  *slog.Logger
	queries database.Querier
}
