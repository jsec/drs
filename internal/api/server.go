package api

import (
	"net/http"
	"time"

	"github.com/jsec/drs/internal/constructors"
	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/httpx"
	"github.com/jsec/drs/internal/seasons"
)

func NewHandler(queries *database.Queries) http.Handler {
	mux := http.NewServeMux()

	seasons.NewHandler(seasons.NewService(queries)).Routes(mux)
	constructors.NewHandler(constructors.NewService(queries)).Routes(mux)

	return httpx.Chain(mux, httpx.Logging, httpx.Timeout(5*time.Second), httpx.Recover)
}
