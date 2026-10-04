package api

import (
	"net/http"

	"github.com/jsec/drs/internal/constructors"
)

func (app *application) listConstructorsHandler(w http.ResponseWriter, r *http.Request) error {
	list, err := constructors.ListConstructors(r.Context(), app.queries)
	if err != nil {
		return err
	}

	return respondJSON(w, list)
}

func (app *application) getConstructorSummaryHandler(w http.ResponseWriter, r *http.Request) error {
	summary, err := constructors.GetSummary(r.Context(), app.queries, r.PathValue("constructorID"))
	if err != nil {
		return err
	}

	return respondJSON(w, summary)
}

func (app *application) getConstructorSeasonHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	season, err := constructors.GetSeason(r.Context(), app.queries, r.PathValue("constructorID"), year)
	if err != nil {
		return err
	}

	return respondJSON(w, season)
}
