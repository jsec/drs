package api

import (
	"net/http"
	"strconv"
)

func (app *application) getRaceDetailHandler(w http.ResponseWriter, r *http.Request) error {
	year, round, err := parseYearRound(r)
	if err != nil {
		return err
	}

	race, err := app.races.GetRaceDetail(r.Context(), year, round)
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, race)
}

func (app *application) getRaceLapsHandler(w http.ResponseWriter, r *http.Request) error {
	year, round, err := parseYearRound(r)
	if err != nil {
		return err
	}

	session, err := parseSession(r)
	if err != nil {
		return err
	}

	laps, err := app.races.GetRaceLaps(r.Context(), year, round, session)
	if err != nil {
		return err
	}

	return respondJSON(app.logger, w, laps)
}

func parseYearRound(r *http.Request) (int32, int32, error) {
	year, err := parseYear(r)
	if err != nil {
		return 0, 0, err
	}

	round, err := strconv.ParseInt(r.PathValue("round"), 10, 32)
	if err != nil {
		return 0, 0, errNotFound
	}

	return year, int32(round), nil
}

func parseSession(r *http.Request) (string, error) {
	switch r.URL.Query().Get("session") {
	case "", "race":
		return "race", nil
	case "sprint":
		return "sprint", nil
	default:
		return "", errNotFound
	}
}
