package api

import (
	"net/http"
	"time"

	"github.com/jsec/drs/web"
)

func (app *application) routes() http.Handler {
	api := http.NewServeMux()

	api.Handle("GET /api/seasons", handle(app.logger, app.listSeasonsHandler))
	api.Handle("GET /api/seasons/{year}", handle(app.logger, app.getSeasonOverviewHandler))
	api.Handle("GET /api/seasons/{year}/calendar", handle(app.logger, app.getSeasonCalendarHandler))
	api.Handle("GET /api/seasons/{year}/races/{round}", handle(app.logger, app.getRaceDetailHandler))
	api.Handle("GET /api/seasons/{year}/races/{round}/laps", handle(app.logger, app.getRaceLapsHandler))
	api.Handle("GET /api/seasons/{year}/drivers/{driverID}", handle(app.logger, app.getDriverSeasonHandler))
	api.Handle("GET /api/seasons/{year}/drivers/{driverID}/races/{round}", handle(app.logger, app.getDriverRaceHandler))
	api.Handle("GET /api/seasons/{year}/constructors/{constructorID}", handle(app.logger, app.getConstructorSeasonHandler))
	api.Handle("GET /api/constructors", handle(app.logger, app.listConstructorsHandler))
	api.Handle("GET /api/constructors/{constructorID}", handle(app.logger, app.getConstructorSummaryHandler))
	api.Handle("GET /api/circuits", handle(app.logger, app.listCircuitsHandler))
	api.Handle("GET /api/circuits/{circuitID}", handle(app.logger, app.getCircuitSummaryHandler))

	api.Handle("GET /api/drivers", handle(app.logger, app.listDriversHandler))
	api.Handle("GET /api/drivers/{driverID}", handle(app.logger, app.getDriverSummaryHandler))
	api.HandleFunc("/api/", func(w http.ResponseWriter, _ *http.Request) {
		writeError(w, http.StatusNotFound, "not found")
	})

	mux := http.NewServeMux()
	if app.appEnv != "dev" {
		mux.Handle("/api/", sameOriginMiddleware(api))
	} else {
		mux.Handle("/api/", api)
	}
	mux.Handle("/", staticHandler(web.Files()))

	return loggingMiddleware(app.logger,
		http.TimeoutHandler(mux, 5*time.Second, "request timed out"),
	)
}
