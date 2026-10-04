package api

import (
	"net/http"
	"strconv"
)

func (app *application) listSeasonsHandler(w http.ResponseWriter, r *http.Request) error {
	seasons, err := app.seasons.ListSeasons(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(w, seasons)
}

func (app *application) getSeasonOverviewHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	overview, err := app.seasons.GetOverview(r.Context(), year)
	if err != nil {
		return err
	}

	return respondJSON(w, overview)
}

func (app *application) getSeasonCalendarHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	calendar, err := app.seasons.GetCalendar(r.Context(), year)
	if err != nil {
		return err
	}

	return respondJSON(w, calendar)
}

func parseYear(r *http.Request) (int32, error) {
	year, err := strconv.ParseInt(r.PathValue("year"), 10, 32)
	if err != nil {
		return 0, errNotFound
	}

	return int32(year), nil
}
