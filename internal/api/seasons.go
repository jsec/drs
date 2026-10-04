package api

import (
	"net/http"
	"strconv"

	"github.com/jsec/drs/internal/seasons"
)

func (app *application) listSeasonsHandler(w http.ResponseWriter, r *http.Request) error {
	list, err := seasons.ListSeasons(r.Context(), app.queries)
	if err != nil {
		return err
	}

	return respondJSON(w, list)
}

func (app *application) getSeasonOverviewHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	overview, err := seasons.GetOverview(r.Context(), app.queries, year)
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

	calendar, err := seasons.GetCalendar(r.Context(), app.queries, year)
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
