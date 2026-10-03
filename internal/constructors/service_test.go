package constructors_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/constructors"
	"github.com/jsec/drs/internal/database"
)

type stubQuerier struct {
	rows       []database.ListConstructorsRow
	err        error
	summaryErr error
	seasons    []database.ListConstructorSeasonsRow
	drivers    []database.ListConstructorSeasonDriversRow
	lineage    []database.ListConstructorLineageRow
}

func (s stubQuerier) ListConstructors(context.Context) ([]database.ListConstructorsRow, error) {
	return s.rows, s.err
}

func (s stubQuerier) GetConstructorSummary(context.Context, string) (database.GetConstructorSummaryRow, error) {
	return database.GetConstructorSummaryRow{ID: "lotus", Name: "Lotus"}, s.summaryErr
}

func (s stubQuerier) ListConstructorSeasons(context.Context, string) ([]database.ListConstructorSeasonsRow, error) {
	return s.seasons, nil
}

func (s stubQuerier) ListConstructorSeasonDrivers(context.Context, string) ([]database.ListConstructorSeasonDriversRow, error) {
	return s.drivers, nil
}

func (s stubQuerier) ListConstructorLineage(context.Context, string) ([]database.ListConstructorLineageRow, error) {
	return s.lineage, nil
}

func TestService_GetSummary_NotFound(t *testing.T) {
	t.Parallel()

	svc := constructors.NewService(stubQuerier{summaryErr: pgx.ErrNoRows})

	_, err := svc.GetSummary(context.Background(), "nope")

	require.ErrorIs(t, err, pgx.ErrNoRows)
}

func TestService_GetSummary_DriversAttachToSeasonAndEngine(t *testing.T) {
	t.Parallel()

	svc := constructors.NewService(stubQuerier{
		seasons: []database.ListConstructorSeasonsRow{
			{Season: 1967, EngineManufacturerID: "climax", EngineManufacturerName: "Climax"},
			{Season: 1967, EngineManufacturerID: "ford", EngineManufacturerName: "Ford"},
		},
		drivers: []database.ListConstructorSeasonDriversRow{
			{Season: 1967, EngineManufacturerID: "ford", DriverID: "jim-clark", DriverName: "Jim Clark"},
			{Season: 1967, EngineManufacturerID: "climax", DriverID: "mike-spence", DriverName: "Mike Spence"},
		},
	})

	got, err := svc.GetSummary(context.Background(), "lotus")

	require.NoError(t, err)
	require.Len(t, got.Seasons, 2)
	assert.Equal(t, "Climax", got.Seasons[0].Engine)
	assert.Equal(t, []string{"mike-spence"}, driverIDs(got.Seasons[0]))
	assert.Equal(t, "Ford", got.Seasons[1].Engine)
	assert.Equal(t, []string{"jim-clark"}, driverIDs(got.Seasons[1]))
}

func TestService_GetSummary_NoStanding(t *testing.T) {
	t.Parallel()

	svc := constructors.NewService(stubQuerier{
		seasons: []database.ListConstructorSeasonsRow{{Season: 1955, EngineManufacturerID: "alta"}},
	})

	got, err := svc.GetSummary(context.Background(), "connaught")

	require.NoError(t, err)
	assert.Empty(t, got.Seasons[0].Position)
	assert.Nil(t, got.Seasons[0].Points)
	assert.Equal(t, []constructors.SeasonDriver{}, got.Seasons[0].Drivers)
}

func TestService_GetSummary_EmptyLineage(t *testing.T) {
	t.Parallel()

	svc := constructors.NewService(stubQuerier{})

	got, err := svc.GetSummary(context.Background(), "connaught")

	require.NoError(t, err)
	assert.NotNil(t, got.Lineage)
	assert.Empty(t, got.Lineage)
	assert.NotNil(t, got.Seasons)
}

func driverIDs(s constructors.ConstructorSeason) []string {
	ids := make([]string, 0, len(s.Drivers))
	for _, d := range s.Drivers {
		ids = append(ids, d.ID)
	}
	return ids
}

func date(s string) pgtype.Date {
	tm, err := time.Parse("2006-01-02", s)
	if err != nil {
		panic(err)
	}

	return pgtype.Date{Time: tm, Valid: true}
}

func TestService_ListConstructors(t *testing.T) {
	t.Parallel()

	errQuery := errors.New("query failed")

	tests := []struct {
		name           string
		rows           []database.ListConstructorsRow
		err            error
		want           []constructors.ConstructorResponse
		wantErr        error
		wantErrMessage string
	}{
		{
			name: "valid dates",
			rows: []database.ListConstructorsRow{{
				ID:            "ferrari",
				Name:          "Ferrari",
				Color:         "#E8002D",
				FirstRaceDate: date("1950-05-13"),
				LastRaceDate:  date("2024-12-08"),
				Championships: 16,
				Wins:          249,
				Podiums:       819,
			}},
			want: []constructors.ConstructorResponse{{
				ID:            "ferrari",
				Name:          "Ferrari",
				Color:         "#E8002D",
				FirstRaceDate: date("1950-05-13"),
				LastRaceDate:  date("2024-12-08"),
				Championships: 16,
				Wins:          249,
				Podiums:       819,
			}},
		},
		{
			name: "null dates",
			rows: []database.ListConstructorsRow{{
				ID:    "manor",
				Name:  "Manor",
				Color: "#323232",
			}},
			want: []constructors.ConstructorResponse{{
				ID:    "manor",
				Name:  "Manor",
				Color: "#323232",
			}},
		},
		{
			name: "first race date only",
			rows: []database.ListConstructorsRow{{
				ID:            "brawn",
				Name:          "Brawn",
				Color:         "#B5E227",
				FirstRaceDate: date("2009-03-29"),
				Championships: 1,
				Wins:          8,
				Podiums:       15,
			}},
			want: []constructors.ConstructorResponse{{
				ID:            "brawn",
				Name:          "Brawn",
				Color:         "#B5E227",
				FirstRaceDate: date("2009-03-29"),
				Championships: 1,
				Wins:          8,
				Podiums:       15,
			}},
		},
		{
			name: "empty result",
			rows: nil,
			want: []constructors.ConstructorResponse{},
		},
		{
			name:           "query error",
			err:            errQuery,
			wantErr:        errQuery,
			wantErrMessage: "listing constructors: query failed",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			svc := constructors.NewService(stubQuerier{rows: tt.rows, err: tt.err})

			got, err := svc.ListConstructors(context.Background())

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
