package api

import (
	"net/http"

	"github.com/jsec/drs/internal/httpx"
)

func (app *Application) listConstructors(w http.ResponseWriter, r *http.Request) error {
	list, err := app.constructors.List(r.Context())
	if err != nil {
		return err
	}

	return httpx.WriteJSON(app.logger, w, http.StatusOK, list)
}
