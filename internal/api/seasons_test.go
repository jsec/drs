package api

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"

	"github.com/jsec/drs/internal/database"
)

type seasonStubQuerier struct {
	database.Querier
	driverRows      []database.ListSeasonDriverStandingsRow
	constructorRows []database.ListSeasonConstructorStandingsRow
	progressionRows []database.ListSeasonDriverProgressionRow
	calendarRows    []database.ListSeasonCalendarRow
}

func (s seasonStubQuerier) ListSeasons(context.Context) ([]database.ListSeasonsRow, error) {
	return nil, nil
}

func (s seasonStubQuerier) ListSeasonDriverStandings(context.Context, int32) ([]database.ListSeasonDriverStandingsRow, error) {
	return s.driverRows, nil
}

func (s seasonStubQuerier) ListSeasonConstructorStandings(context.Context, int32) ([]database.ListSeasonConstructorStandingsRow, error) {
	return s.constructorRows, nil
}

func (s seasonStubQuerier) ListSeasonDriverProgression(context.Context, int32, []string) ([]database.ListSeasonDriverProgressionRow, error) {
	return s.progressionRows, nil
}

func (s seasonStubQuerier) ListSeasonCalendar(context.Context, int32) ([]database.ListSeasonCalendarRow, error) {
	return s.calendarRows, nil
}

func TestGetSeasonOverviewHandler(t *testing.T) {
	t.Parallel()

	app := &application{
		logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		queries: seasonStubQuerier{
			driverRows: []database.ListSeasonDriverStandingsRow{{
				Points:           44,
				DriverID:         "max-verstappen",
				Code:             "VER",
				Name:             "Max Verstappen",
				ConstructorID:    "red-bull",
				ConstructorName:  pgtype.Text{String: "Red Bull Racing", Valid: true},
				ConstructorColor: pgtype.Text{String: "#3671C6", Valid: true},
			}},
			progressionRows: []database.ListSeasonDriverProgressionRow{{
				RaceRound: 1,
				DriverID:  "max-verstappen",
				Code:      "VER",
				Points:    44,
			}},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/seasons/2023", nil)
	req.SetPathValue("year", "2023")
	rec := httptest.NewRecorder()

	handle(app.logger, app.getSeasonOverviewHandler).ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.JSONEq(t, `{
		"drivers":[{
			"position":null,"positionLabel":"","points":44,
			"id":"max-verstappen","code":"VER","name":"Max Verstappen",
			"country":"","countryCode":"",
			"constructor":{"id":"red-bull","name":"Red Bull Racing","color":"#3671C6"},
			"carNumber":null,"wins":0,"podiums":0,"poles":0
		}],
		"constructors":[],
		"maxConstructorPoints":0,
		"leader":{"position":null,"positionLabel":"","points":44,"id":"max-verstappen","code":"VER","name":"Max Verstappen","country":"","countryCode":"","constructor":{"id":"red-bull","name":"Red Bull Racing","color":"#3671C6"},"carNumber":null,"wins":0,"podiums":0,"poles":0},
		"runnerUp":null,
		"progression":{
			"data":[{"round":1,"VER":44}],
			"series":[{"name":"VER","color":"#3671C6"}]
		}
	}`, rec.Body.String())
}

func TestGetSeasonCalendarHandler(t *testing.T) {
	t.Parallel()

	app := &application{
		logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		queries: seasonStubQuerier{
			calendarRows: []database.ListSeasonCalendarRow{
				{
					RaceID:                 1123,
					RaceRound:              1,
					RaceName:               "Australian Grand Prix",
					GrandPrixCode:          pgtype.Text{String: "AUS", Valid: true},
					RaceDate:               testDate(2026, time.March, 8),
					CircuitID:              "albert_park",
					CircuitName:            "Albert Park Grand Prix Circuit",
					WinnerDriverID:         pgtype.Text{String: "lando-norris", Valid: true},
					WinnerDriverName:       pgtype.Text{String: "Lando Norris", Valid: true},
					WinnerDriverCode:       pgtype.Text{String: "NOR", Valid: true},
					WinnerConstructorID:    pgtype.Text{String: "mclaren", Valid: true},
					WinnerConstructorName:  pgtype.Text{String: "McLaren", Valid: true},
					WinnerConstructorColor: pgtype.Text{String: "#FF8000", Valid: true},
					Completed:              pgtype.Bool{Bool: true, Valid: true},
				},
				{
					RaceID:      1124,
					RaceRound:   2,
					RaceName:    "Chinese Grand Prix",
					RaceDate:    testDate(2026, time.March, 15),
					CircuitID:   "shanghai",
					CircuitName: "Shanghai International Circuit",
					Completed:   pgtype.Bool{Bool: false, Valid: true},
				},
			},
		},
	}

	req := httptest.NewRequest(http.MethodGet, "/seasons/2026/calendar", nil)
	req.SetPathValue("year", "2026")
	rec := httptest.NewRecorder()

	handle(app.logger, app.getSeasonCalendarHandler).ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.JSONEq(t, `{
		"races":[
			{
				"raceId":1123,"round":1,"name":"Australian Grand Prix","code":"AUS","date":"2026-03-08",
				"circuit":{"id":"albert_park","name":"Albert Park Grand Prix Circuit"},"completed":true,
				"winner":{"id":"lando-norris","name":"Lando Norris","code":"NOR","constructor":{"id":"mclaren","name":"McLaren","color":"#FF8000"}}
			},
			{
				"raceId":1124,"round":2,"name":"Chinese Grand Prix","code":"","date":"2026-03-15",
				"circuit":{"id":"shanghai","name":"Shanghai International Circuit"},"completed":false,"winner":null
			}
		],
		"roundsCompleted":1,"totalRounds":2
	}`, rec.Body.String())
}
