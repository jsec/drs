package api

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/jsec/drs/internal/constructors"
	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/httpx"
	"github.com/jsec/drs/internal/seasons"
)

func NewHandler(log *slog.Logger, queries *database.Queries) http.Handler {
	mux := http.NewServeMux()

	seasons.NewHandler(log, seasons.NewService(queries)).Routes(mux)
	constructors.NewHandler(log, constructors.NewService(queries)).Routes(mux)

	return httpx.Chain(mux, httpx.Logging(log), httpx.Timeout(5*time.Second), httpx.Recover(log))
}
