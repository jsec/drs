package api

import (
	"errors"
	"net/http"

	"github.com/jsec/drs/internal/circuits"
)

func (app *application) listCircuitsHandler(w http.ResponseWriter, r *http.Request) error {
	circuits, err := app.circuits.ListCircuits(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, circuits)
}

func (app *application) getCircuitSummaryHandler(w http.ResponseWriter, r *http.Request) error {
	circuit, err := app.circuits.GetCircuitSummary(r.Context(), r.PathValue("circuitID"))
	if err != nil {
		if errors.Is(err, circuits.ErrNotFound) {
			return errNotFound
		}
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, circuit)
}
