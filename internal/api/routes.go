package api

import (
	"net/http"
	"time"

	"github.com/jsec/drs/internal/httpx"
)

func (app *Application) Handler() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /seasons", httpx.Handle(app.logger, app.listSeasons))
	mux.Handle("GET /constructors", httpx.Handle(app.logger, app.listConstructors))

	return httpx.Chain(mux, httpx.Logging(app.logger), httpx.Timeout(5*time.Second), httpx.Recover(app.logger))
}
