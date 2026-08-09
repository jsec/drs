package api

import (
	"log/slog"

	"github.com/jsec/drs/internal/constructors"
	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/seasons"
)

type application struct {
	logger       *slog.Logger
	seasons      *seasons.Service
	constructors *constructors.Service
}

func newApplication(logger *slog.Logger, queries *database.Queries) *application {
	return &application{
		logger:       logger,
		seasons:      seasons.NewService(queries),
		constructors: constructors.NewService(queries),
	}
}
