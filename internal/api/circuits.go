package api

import (
	"net/http"

	"github.com/jsec/drs/internal/circuits"
)

func (app *application) listCircuitsHandler(w http.ResponseWriter, r *http.Request) error {
	list, err := circuits.ListCircuits(r.Context(), app.queries)
	if err != nil {
		return err
	}

	return respondJSON(w, list)
}

func (app *application) getCircuitSummaryHandler(w http.ResponseWriter, r *http.Request) error {
	circuit, err := circuits.GetCircuitSummary(r.Context(), app.queries, r.PathValue("circuitID"))
	if err != nil {
		return err
	}

	return respondJSON(w, circuit)
}
