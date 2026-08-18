package api

import "net/http"

func (app *application) listCircuitsHandler(w http.ResponseWriter, r *http.Request) error {
	circuits, err := app.circuits.ListCircuits(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, circuits)
}
