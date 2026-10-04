package seasons_test

import (
	"context"
	"errors"
	"testing"
	"time"

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
	calendarRows             []database.ListSeasonCalendarRow
	calendarErr              error
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

func (s stubQuerier) ListSeasonDriverProgression(context.Context, int32, []string) ([]database.ListSeasonDriverProgressionRow, error) {
	return s.progressionRows, s.progressionErr
}

func (s stubQuerier) ListSeasonCalendar(context.Context, int32) ([]database.ListSeasonCalendarRow, error) {
	return s.calendarRows, s.calendarErr
}

func text(s string) pgtype.Text {
	return pgtype.Text{String: s, Valid: true}
}

func date(year int, month time.Month, day int) pgtype.Date {
	return pgtype.Date{
		Time:  time.Date(year, month, day, 0, 0, 0, 0, time.UTC),
		Valid: true,
	}
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

func TestService_GetOverview_Standings(t *testing.T) {
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
			ConstructorID:    "red-bull",
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

	got, err := svc.GetOverview(context.Background(), 2023)

	require.NoError(t, err)
	assert.Equal(t, []seasons.DriverStanding{{
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
	}}, got.Drivers)
	assert.Equal(t, []seasons.ConstructorStanding{{
		PositionLabel: "1", Points: 463.5, ID: "red-bull", Name: "Red Bull Racing", Color: "#3671C6",
	}}, got.Constructors)
	assert.InEpsilon(t, 463.5, got.MaxConstructorPoints, 0.0001)
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
				ConstructorID:    "red-bull",
				ConstructorName:  text("Red Bull Racing"),
				ConstructorColor: text("#3671C6"),
			},
			{
				Points:           33,
				DriverID:         "sergio-perez",
				Code:             "PER",
				Name:             "Sergio Perez",
				ConstructorID:    "red-bull",
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
	assert.InEpsilon(t, 463.5, got.MaxConstructorPoints, 0.0001)
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

func TestService_GetOverview_DriverWithoutConstructor(t *testing.T) {
	t.Parallel()

	svc := seasons.NewService(stubQuerier{
		driverStandingsRows: []database.ListSeasonDriverStandingsRow{{
			Points:   9,
			DriverID: "nino-farina",
			Code:     "FAR",
			Name:     "Nino Farina",
		}},
	})

	got, err := svc.GetOverview(context.Background(), 1950)

	require.NoError(t, err)
	assert.Nil(t, got.Drivers[0].Constructor)
	assert.Equal(t, []seasons.ProgressionSeries{{Name: "FAR"}}, got.Progression.Series)
}

func TestService_GetCalendar(t *testing.T) {
	t.Parallel()

	svc := seasons.NewService(stubQuerier{
		calendarRows: []database.ListSeasonCalendarRow{
			{
				RaceID:                 1123,
				RaceRound:              1,
				RaceName:               "Australian Grand Prix",
				GrandPrixCode:          text("AUS"),
				RaceDate:               date(2026, time.March, 8),
				CircuitID:              "albert_park",
				CircuitName:            "Albert Park Grand Prix Circuit",
				WinnerDriverID:         text("lando-norris"),
				WinnerDriverName:       text("Lando Norris"),
				WinnerDriverCode:       text("NOR"),
				WinnerConstructorID:    text("mclaren"),
				WinnerConstructorName:  text("McLaren"),
				WinnerConstructorColor: text("#FF8000"),
				Completed:              pgtype.Bool{Bool: true, Valid: true},
			},
			{
				RaceID:      1124,
				RaceRound:   2,
				RaceName:    "Chinese Grand Prix",
				RaceDate:    date(2026, time.March, 15),
				CircuitID:   "shanghai",
				CircuitName: "Shanghai International Circuit",
				Completed:   pgtype.Bool{Bool: false, Valid: true},
			},
		},
	})

	got, err := svc.GetCalendar(context.Background(), 2026)

	require.NoError(t, err)
	require.Len(t, got.Races, 2)
	assert.Equal(t, 1, got.RoundsCompleted)
	assert.Equal(t, 2, got.TotalRounds)
	assert.Equal(t, int32(1123), got.Races[0].RaceID)
	assert.Equal(t, "AUS", got.Races[0].Code)
	assert.Equal(t, "albert_park", got.Races[0].Circuit.ID)
	assert.True(t, got.Races[0].Completed)
	require.NotNil(t, got.Races[0].Winner)
	assert.Equal(t, "NOR", got.Races[0].Winner.Code)
	require.NotNil(t, got.Races[0].Winner.Constructor)
	assert.Equal(t, "#FF8000", got.Races[0].Winner.Constructor.Color)
	assert.False(t, got.Races[1].Completed)
	assert.Nil(t, got.Races[1].Winner)
}
