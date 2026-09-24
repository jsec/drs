package seasons_test

import (
	"context"
	"errors"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/seasons"
)

type stubQuerier struct {
	rows                     []database.ListSeasonsRow
	err                      error
	driverStandingsRows      []database.ListSeasonDriverStandingsRow
	driverStandingsErr       error
	constructorStandingsRows []database.ListSeasonConstructorStandingsRow
	constructorStandingsErr  error
	progressionRows          []database.ListSeasonDriverProgressionRow
	progressionErr           error
}

func (s stubQuerier) ListSeasons(context.Context) ([]database.ListSeasonsRow, error) {
	return s.rows, s.err
}

func (s stubQuerier) ListSeasonDriverStandings(context.Context, int32) ([]database.ListSeasonDriverStandingsRow, error) {
	return s.driverStandingsRows, s.driverStandingsErr
}

func (s stubQuerier) ListSeasonConstructorStandings(context.Context, int32) ([]database.ListSeasonConstructorStandingsRow, error) {
	return s.constructorStandingsRows, s.constructorStandingsErr
}

func (s stubQuerier) ListSeasonDriverProgression(context.Context, database.ListSeasonDriverProgressionParams) ([]database.ListSeasonDriverProgressionRow, error) {
	return s.progressionRows, s.progressionErr
}

func text(s string) pgtype.Text {
	return pgtype.Text{String: s, Valid: true}
}

func TestService_ListSeasons(t *testing.T) {
	t.Parallel()

	errQuery := errors.New("query failed")

	tests := []struct {
		name           string
		rows           []database.ListSeasonsRow
		err            error
		want           []seasons.SeasonResponse
		wantErr        error
		wantErrMessage string
	}{
		{
			name: "full row with wcc",
			rows: []database.ListSeasonsRow{{
				Season:             2023,
				RaceCount:          22,
				ConstructorCount:   10,
				WdcDriverID:        text("max-verstappen"),
				WdcDriverName:      text("Max Verstappen"),
				WdcCountryCode:     "NL",
				WccConstructorID:   text("red-bull"),
				WccConstructorName: text("Red Bull"),
				WccColor:           text("#3671C6"),
			}},
			want: []seasons.SeasonResponse{{
				Season:           2023,
				RaceCount:        22,
				ConstructorCount: 10,
				Wdc:              seasons.WDC{ID: "max-verstappen", Name: "Max Verstappen", CountryCode: "NL"},
				Wcc:              &seasons.Constructor{ID: "red-bull", Name: "Red Bull", Color: "#3671C6"},
			}},
		},
		{
			name: "wcc absent",
			rows: []database.ListSeasonsRow{{
				Season:           1950,
				RaceCount:        7,
				ConstructorCount: 0,
				WdcDriverID:      text("nino-farina"),
				WdcDriverName:    text("Nino Farina"),
				WdcCountryCode:   "IT",
			}},
			want: []seasons.SeasonResponse{{
				Season:           1950,
				RaceCount:        7,
				ConstructorCount: 0,
				Wdc:              seasons.WDC{ID: "nino-farina", Name: "Nino Farina", CountryCode: "IT"},
				Wcc:              nil,
			}},
		},
		{
			name: "wcc id valid but name missing",
			rows: []database.ListSeasonsRow{{
				Season:           1958,
				RaceCount:        11,
				ConstructorCount: 1,
				WdcDriverID:      text("mike-hawthorn"),
				WdcDriverName:    text("Mike Hawthorn"),
				WdcCountryCode:   "GB",
				WccConstructorID: text("vanwall"),
			}},
			want: []seasons.SeasonResponse{{
				Season:           1958,
				RaceCount:        11,
				ConstructorCount: 1,
				Wdc:              seasons.WDC{ID: "mike-hawthorn", Name: "Mike Hawthorn", CountryCode: "GB"},
				Wcc:              nil,
			}},
		},
		{
			name: "empty result",
			rows: nil,
			want: []seasons.SeasonResponse{},
		},
		{
			name:           "query error",
			err:            errQuery,
			wantErr:        errQuery,
			wantErrMessage: "listing seasons: query failed",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			svc := seasons.NewService(stubQuerier{rows: tt.rows, err: tt.err})

			got, err := svc.ListSeasons(context.Background())

			if tt.wantErr != nil {
				require.ErrorIs(t, err, tt.wantErr)
				require.EqualError(t, err, tt.wantErrMessage)
				assert.Nil(t, got)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestService_GetStandings(t *testing.T) {
	t.Parallel()

	svc := seasons.NewService(stubQuerier{
		driverStandingsRows: []database.ListSeasonDriverStandingsRow{{
			PositionLabel:    "1",
			Points:           251.5,
			DriverID:         "max-verstappen",
			Code:             "VER",
			Name:             "Max Verstappen",
			Country:          "Netherlands",
			CountryCode:      "NL",
			ConstructorID:    text("red-bull"),
			ConstructorName:  text("Red Bull Racing"),
			ConstructorColor: text("#3671C6"),
			Wins:             8,
			Podiums:          10,
			Poles:            6,
		}},
		constructorStandingsRows: []database.ListSeasonConstructorStandingsRow{{
			PositionLabel:    "1",
			Points:           463.5,
			ConstructorID:    "red-bull",
			Name:             "Red Bull Racing",
			ConstructorColor: "#3671C6",
		}},
	})

	got, err := svc.GetStandings(context.Background(), 2023)

	require.NoError(t, err)
	assert.Equal(t, seasons.StandingsResponse{
		Drivers: []seasons.DriverStanding{{
			PositionLabel: "1",
			Points:        251.5,
			ID:            "max-verstappen",
			Code:          "VER",
			Name:          "Max Verstappen",
			Country:       "Netherlands",
			CountryCode:   "NL",
			Constructor: &seasons.Constructor{
				ID: "red-bull", Name: "Red Bull Racing", Color: "#3671C6",
			},
			Wins: 8, Podiums: 10, Poles: 6,
		}},
		Constructors: []seasons.ConstructorStanding{{
			PositionLabel: "1", Points: 463.5, ID: "red-bull", Name: "Red Bull Racing", Color: "#3671C6",
		}},
		MaxConstructorPoints: 463.5,
	}, got)
}

func TestService_GetOverview(t *testing.T) {
	t.Parallel()

	svc := seasons.NewService(stubQuerier{
		driverStandingsRows: []database.ListSeasonDriverStandingsRow{
			{
				Points:           43,
				DriverID:         "max-verstappen",
				Code:             "VER",
				Name:             "Max Verstappen",
				ConstructorID:    text("red-bull"),
				ConstructorName:  text("Red Bull Racing"),
				ConstructorColor: text("#3671C6"),
			},
			{
				Points:           33,
				DriverID:         "sergio-perez",
				Code:             "PER",
				Name:             "Sergio Perez",
				ConstructorID:    text("red-bull"),
				ConstructorName:  text("Red Bull Racing"),
				ConstructorColor: text("#3671C6"),
			},
		},
		constructorStandingsRows: []database.ListSeasonConstructorStandingsRow{{Points: 463.5}},
		progressionRows: []database.ListSeasonDriverProgressionRow{
			{RaceRound: 1, DriverID: "max-verstappen", Code: "VER", Points: 25},
			{RaceRound: 1, DriverID: "sergio-perez", Code: "PER", Points: 18},
			{RaceRound: 2, DriverID: "sergio-perez", Code: "PER", Points: 33},
			{RaceRound: 3, DriverID: "max-verstappen", Code: "VER", Points: 43},
		},
	})

	got, err := svc.GetOverview(context.Background(), 2023)

	require.NoError(t, err)
	require.NotNil(t, got.Leader)
	require.NotNil(t, got.RunnerUp)
	assert.Equal(t, "VER", got.Leader.Code)
	assert.Equal(t, "PER", got.RunnerUp.Code)
	assert.Equal(t, 463.5, got.MaxConstructorPoints)
	assert.Equal(t, seasons.Progression{
		Data: []seasons.ProgressionDataRow{
			{"round": 1, "VER": 25, "PER": 18},
			{"round": 2, "PER": 33},
			{"round": 3, "VER": 43},
		},
		Series: []seasons.ProgressionSeries{
			{Name: "VER", Color: "#3671C6"},
			{Name: "PER", Color: "#3671C6"},
		},
	}, got.Progression)
}
