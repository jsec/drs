package api

import (
	"net/http"
	"time"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /seasons", handle(app.logger, app.listSeasonsHandler))
	mux.Handle("GET /constructors", handle(app.logger, app.listConstructorsHandler))

	return chainMiddleware(
		mux,
		loggingMiddleware(app.logger),
		timeoutMiddleware(5*time.Second),
		recoverMiddleware(app.logger),
	)
}
