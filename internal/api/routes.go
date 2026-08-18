package api

import (
	"net/http"
	"time"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /seasons", handle(app.logger, app.listSeasonsHandler))
	mux.Handle("GET /constructors", handle(app.logger, app.listConstructorsHandler))
	mux.Handle("GET /circuits", handle(app.logger, app.listCircuitsHandler))

	return chainMiddleware(
		mux,
		recoverMiddleware(app.logger),
		loggingMiddleware(app.logger),
		timeoutMiddleware(5*time.Second),
	)
}
