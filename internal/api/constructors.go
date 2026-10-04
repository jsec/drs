package api

import (
	"net/http"
)

func (app *application) listConstructorsHandler(w http.ResponseWriter, r *http.Request) error {
	constructors, err := app.constructors.ListConstructors(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, constructors)
}

func (app *application) getConstructorSummaryHandler(w http.ResponseWriter, r *http.Request) error {
	summary, err := app.constructors.GetSummary(r.Context(), r.PathValue("constructorID"))
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, summary)
}

func (app *application) getConstructorSeasonHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	season, err := app.constructors.GetSeason(r.Context(), r.PathValue("constructorID"), year)
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, season)
}
