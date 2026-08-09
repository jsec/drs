package main

import (
	"net/http"

	"github.com/jsec/drs/internal/httpx"
)

func (app *application) listConstructorsHandler(w http.ResponseWriter, r *http.Request) error {
	list, err := app.constructors.ListConstructors(r.Context())
	if err != nil {
		return err
	}

	return httpx.WriteJSON(app.logger, w, http.StatusOK, list)
}
