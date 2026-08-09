package api

import (
	"net/http"
)

func (app *application) listSeasonsHandler(w http.ResponseWriter, r *http.Request) error {
	seasons, err := app.seasons.ListSeasons(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, seasons)
}
