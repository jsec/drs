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
	mux.Handle("GET /circuits/{circuitID}", handle(app.logger, app.getCircuitSummaryHandler))

	mux.Handle("GET /drivers", handle(app.logger, app.listDriversHandler))
	mux.Handle("GET /drivers/{driverID}", handle(app.logger, app.getDriverSummaryHandler))

	return chainMiddleware(
		mux,
		recoverMiddleware(app.logger),
		loggingMiddleware(app.logger),
		timeoutMiddleware(5*time.Second),
	)
}
