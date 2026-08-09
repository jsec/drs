package api

import (
	"net/http"
	"time"

	"github.com/jsec/drs/internal/httpx"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /seasons", httpx.Handle(app.logger, app.listSeasonsHandler))
	mux.Handle("GET /constructors", httpx.Handle(app.logger, app.listConstructorsHandler))

	return httpx.Chain(
		mux,
		httpx.Logging(app.logger),
		httpx.Timeout(5*time.Second),
		httpx.Recover(app.logger),
	)
}
