package api

import (
	"net/http"
	"strconv"
)

func (app *application) listSeasonsHandler(w http.ResponseWriter, r *http.Request) error {
	seasons, err := app.seasons.ListSeasons(r.Context())
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, seasons)
}

func (app *application) getSeasonStandingsHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	standings, err := app.seasons.GetStandings(r.Context(), year)
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, standings)
}

func (app *application) listSeasonDriverProgressionHandler(w http.ResponseWriter, r *http.Request) error {
	year, err := parseYear(r)
	if err != nil {
		return err
	}

	progression, err := app.seasons.ListDriverProgression(r.Context(), year)
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, http.StatusOK, progression)
}

func parseYear(r *http.Request) (int32, error) {
	year, err := strconv.ParseInt(r.PathValue("year"), 10, 32)
	if err != nil {
		return 0, errNotFound
	}

	return int32(year), nil
}
