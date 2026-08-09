package api

import (
	"log/slog"

	"github.com/jsec/drs/internal/constructors"
	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/seasons"
)

type Application struct {
	logger       *slog.Logger
	seasons      *seasons.Service
	constructors *constructors.Service
}

func New(logger *slog.Logger, queries *database.Queries) *Application {
	return &Application{
		logger:       logger,
		seasons:      seasons.NewService(queries),
		constructors: constructors.NewService(queries),
	}
}
