package api

import (
	"errors"
	"net/http"

	"github.com/jsec/drs/internal/drivers"
)

func (app *application) getDriverSummaryHandler(w http.ResponseWriter, r *http.Request) error {
	summary, err := app.drivers.GetSummary(r.Context(), r.PathValue("driverID"))
	if err != nil {
		if errors.Is(err, drivers.ErrNotFound) {
			return errNotFound
		}

		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, summary)
}
