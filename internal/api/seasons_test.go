package api

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"

	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/seasons"
)

type seasonStubQuerier struct {
	driverRows      []database.ListSeasonDriverStandingsRow
	constructorRows []database.ListSeasonConstructorStandingsRow
	progressionRows []database.ListSeasonDriverProgressionRow
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

func (s seasonStubQuerier) ListSeasonDriverProgression(context.Context, database.ListSeasonDriverProgressionParams) ([]database.ListSeasonDriverProgressionRow, error) {
	return s.progressionRows, nil
}

func TestGetSeasonStandingsHandler(t *testing.T) {
	t.Parallel()

	app := &application{
		logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		seasons: seasons.NewService(seasonStubQuerier{
			driverRows: []database.ListSeasonDriverStandingsRow{{
				PositionLabel: "1",
				Points:        251.5,
				DriverID:      "max-verstappen",
				Code:          "VER",
				Name:          "Max Verstappen",
			}},
		}),
	}

	req := httptest.NewRequest(http.MethodGet, "/seasons/2023/standings", nil)
	req.SetPathValue("year", "2023")
	rec := httptest.NewRecorder()

	handle(app.logger, app.getSeasonStandingsHandler).ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.JSONEq(t, `{
		"drivers":[{
			"position":null,"positionLabel":"1","points":251.5,
			"id":"max-verstappen","code":"VER","name":"Max Verstappen",
			"country":"","countryCode":"","constructor":null,"carNumber":null,
			"wins":0,"podiums":0,"poles":0
		}],
		"constructors":[],
		"maxConstructorPoints":0
	}`, rec.Body.String())
}

func TestGetSeasonOverviewHandler(t *testing.T) {
	t.Parallel()

	app := &application{
		logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		seasons: seasons.NewService(seasonStubQuerier{
			driverRows: []database.ListSeasonDriverStandingsRow{{
				Points:           44,
				DriverID:         "max-verstappen",
				Code:             "VER",
				Name:             "Max Verstappen",
				ConstructorID:    pgtype.Text{String: "red-bull", Valid: true},
				ConstructorName:  pgtype.Text{String: "Red Bull Racing", Valid: true},
				ConstructorColor: pgtype.Text{String: "#3671C6", Valid: true},
			}},
			progressionRows: []database.ListSeasonDriverProgressionRow{{
				RaceRound: 1,
				DriverID:  "max-verstappen",
				Code:      "VER",
				Points:    44,
			}},
		}),
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
