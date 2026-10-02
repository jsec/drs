package api

import (
	"net/http"
	"time"
)

func (app *application) routes() http.Handler {
	mux := http.NewServeMux()

	mux.Handle("GET /seasons", handle(app.logger, app.listSeasonsHandler))
	mux.Handle("GET /seasons/{year}", handle(app.logger, app.getSeasonOverviewHandler))
	mux.Handle("GET /seasons/{year}/calendar", handle(app.logger, app.getSeasonCalendarHandler))
	mux.Handle("GET /seasons/{year}/standings", handle(app.logger, app.getSeasonStandingsHandler))
	mux.Handle("GET /seasons/{year}/races/{round}", handle(app.logger, app.getRaceDetailHandler))
	mux.Handle("GET /seasons/{year}/races/{round}/laps", handle(app.logger, app.getRaceLapsHandler))
	mux.Handle("GET /seasons/{year}/drivers/{driverID}", handle(app.logger, app.getDriverSeasonHandler))
	mux.Handle("GET /constructors", handle(app.logger, app.listConstructorsHandler))
	mux.Handle("GET /circuits", handle(app.logger, app.listCircuitsHandler))
	mux.Handle("GET /circuits/{circuitID}", handle(app.logger, app.getCircuitSummaryHandler))

	mux.Handle("GET /drivers", handle(app.logger, app.listDriversHandler))
	mux.Handle("GET /drivers/{driverID}", handle(app.logger, app.getDriverSummaryHandler))

	return recoverMiddleware(app.logger,
		loggingMiddleware(app.logger,
			http.TimeoutHandler(mux, 5*time.Second, "request timed out"),
		),
	)
}
