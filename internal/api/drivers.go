package api

import (
	"net/http"

	"github.com/jsec/drs/internal/drivers"
)

func (app *application) getDriverSummaryHandler(w http.ResponseWriter, r *http.Request) error {
	summary, err := drivers.GetSummary(r.Context(), app.queries, r.PathValue("driverID"))
	if err != nil {
		return err
	}

	return respondJSON(w, summary)
}

func (app *application) listDriversHandler(w http.ResponseWriter, r *http.Request) error {
	list, err := drivers.ListDrivers(r.Context(), app.queries)
	if err != nil {
		return err
	}

	return respondJSON(w, list)
}

func (app *application) getDriverSeasonHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	season, err := drivers.GetSeason(r.Context(), app.queries, r.PathValue("driverID"), year)
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
		race, err = drivers.GetSprint(r.Context(), app.queries, r.PathValue("driverID"), year, round)
	} else {
		race, err = drivers.GetRace(r.Context(), app.queries, r.PathValue("driverID"), year, round)
	}
	if err != nil {
		return err
	}

	return respondJSON(w, race)
}
