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
