package api

import (
	"net/http"

	"github.com/jsec/drs/internal/httpx"
)

func (app *application) listSeasonsHandler(w http.ResponseWriter, r *http.Request) error {
	list, err := app.seasons.ListSeasons(r.Context())
	if err != nil {
		return err
	}

	return httpx.WriteJSON(app.logger, w, http.StatusOK, list)
}
