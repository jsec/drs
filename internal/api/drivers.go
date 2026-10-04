package api

import (
	"net/http"

	"github.com/jsec/drs/internal/drivers"
)

func (app *application) getDriverSummaryHandler(w http.ResponseWriter, r *http.Request) error {
	summary, err := app.drivers.GetSummary(r.Context(), r.PathValue("driverID"))
	if err != nil {
		return err
	}

	return respondJSON(w, summary)
}

func (app *application) listDriversHandler(w http.ResponseWriter, r *http.Request) error {
	drivers, err := app.drivers.ListDrivers(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(w, drivers)
}

func (app *application) getDriverSeasonHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	season, err := app.drivers.GetSeason(r.Context(), r.PathValue("driverID"), year)
	if err != nil {
		return err
	}

	return respondJSON(w, season)
}

func (app *application) getDriverRaceHandler(w http.ResponseWriter, r *http.Request) error {
	year, round, err := parseYearRound(r)
	if err != nil {
		return err
	}

	session, err := parseSession(r)
	if err != nil {
		return err
	}

	var race drivers.DriverRace
	if session == "sprint" {
		race, err = app.drivers.GetSprint(r.Context(), r.PathValue("driverID"), year, round)
	} else {
		race, err = app.drivers.GetRace(r.Context(), r.PathValue("driverID"), year, round)
	}
	if err != nil {
		return err
	}

	return respondJSON(w, race)
}
