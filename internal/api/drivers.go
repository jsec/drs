package api

import (
	"errors"
	"net/http"

	"github.com/jsec/drs/internal/drivers"
)

func (app *application) getDriverSummaryHandler(w http.ResponseWriter, r *http.Request) error {
	summary, err := app.drivers.GetSummary(r.Context(), r.PathValue("driverID"))
	if err != nil {
		if errors.Is(err, drivers.ErrNotFound) {
			return errNotFound
		}

		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, summary)
}

func (app *application) listDriversHandler(w http.ResponseWriter, r *http.Request) error {
	drivers, err := app.drivers.ListDrivers(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, drivers)
}

func (app *application) getDriverSeasonHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	season, err := app.drivers.GetSeason(r.Context(), r.PathValue("driverID"), year)
	if err != nil {
		if errors.Is(err, drivers.ErrNotFound) {
			return errNotFound
		}

		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, season)
}

func (app *application) getDriverRaceHandler(w http.ResponseWriter, r *http.Request) error {
	year, round, err := parseYearRound(r)
	if err != nil {
		return err
	}

	race, err := app.drivers.GetRace(r.Context(), r.PathValue("driverID"), year, round)
	if err != nil {
		if errors.Is(err, drivers.ErrNotFound) {
			return errNotFound
		}

		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, race)
}
