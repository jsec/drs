package api

import (
	"net/http"
)

func (app *application) listConstructorsHandler(w http.ResponseWriter, r *http.Request) error {
	constructors, err := app.constructors.ListConstructors(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, constructors)
}
