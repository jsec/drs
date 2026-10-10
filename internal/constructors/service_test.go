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
	database.Querier
	rows       []database.ListConstructorsRow
	err        error
	summaryErr error
	seasons    []database.ListConstructorSeasonsRow
	drivers    []database.ListConstructorSeasonDriversRow
	lineage    []database.ListConstructorLineageRow
	entries    []database.ListConstructorSeasonEntriesRow
	results    []database.ListConstructorSeasonResultsRow
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

func (s stubQuerier) ListConstructorSeasonEntries(context.Context, int32, string) ([]database.ListConstructorSeasonEntriesRow, error) {
	return s.entries, nil
}

func (s stubQuerier) ListConstructorSeasonProgression(context.Context, int32, string) ([]database.ListConstructorSeasonProgressionRow, error) {
	return nil, nil
}

func (s stubQuerier) ListConstructorSeasonDriverSummaries(context.Context, int32, string) ([]database.ListConstructorSeasonDriverSummariesRow, error) {
	return nil, nil
}

func (s stubQuerier) ListConstructorSeasonResults(context.Context, int32, string) ([]database.ListConstructorSeasonResultsRow, error) {
	return s.results, nil
}

func TestService_GetSeason_NotFound(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{}

	_, err := constructors.GetSeason(context.Background(), queries, "lotus", 2030)

	require.ErrorIs(t, err, pgx.ErrNoRows)
}

func TestService_GetSeason_CombinesEngineEntries(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{
		entries: []database.ListConstructorSeasonEntriesRow{
			{
				EngineName:        "Climax",
				FinalPositionText: pgtype.Text{String: "3", Valid: true},
				FinalPoints:       pgtype.Float8{Float64: 24, Valid: true},
				Wins:              2,
				Podiums:           5,
				Poles:             1,
				Dnfs:              4,
			},
			{
				EngineName:        "Maserati",
				FinalPositionText: pgtype.Text{String: "9", Valid: true},
				FinalPoints:       pgtype.Float8{Float64: 3, Valid: true},
				Podiums:           1,
				Dnfs:              3,
			},
		},
	}

	got, err := constructors.GetSeason(context.Background(), queries, "cooper", 1957)

	require.NoError(t, err)
	assert.Equal(t, "3", got.Position)
	assert.True(t, got.Points.Valid)
	assert.InDelta(t, 27.0, got.Points.Float64, 0.001)
	assert.Equal(t, int32(2), got.Wins)
	assert.Equal(t, int32(6), got.Podiums)
	assert.Equal(t, int32(7), got.DNFs)
	assert.Equal(t, []constructors.SeasonEntry{
		{Engine: "Climax", Position: "3"},
		{Engine: "Maserati", Position: "9"},
	}, got.Entries)
}

func TestService_GetSeason_NoStanding(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{
		entries: []database.ListConstructorSeasonEntriesRow{{EngineName: "Alta", Wins: 1}},
	}

	got, err := constructors.GetSeason(context.Background(), queries, "connaught", 1955)

	require.NoError(t, err)
	assert.Empty(t, got.Position)
	assert.False(t, got.Points.Valid)
	assert.Equal(t, int32(1), got.Wins)
}

func TestService_GetSeason_SprintOnlyWhenPresent(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{
		entries: []database.ListConstructorSeasonEntriesRow{{EngineName: "Honda RBPT"}},
		results: []database.ListConstructorSeasonResultsRow{
			{RaceRound: 1, DriverID: "max-verstappen", Points: 25},
			{RaceRound: 2, DriverID: "max-verstappen", Points: 25, SprintPositionLabel: pgtype.Text{String: "1", Valid: true}, SprintPoints: 8},
		},
	}

	got, err := constructors.GetSeason(context.Background(), queries, "red-bull", 2024)

	require.NoError(t, err)
	assert.Nil(t, got.Results[0].Sprint)
	assert.Equal(t, &constructors.SprintResult{PositionLabel: "1", Points: 8}, got.Results[1].Sprint)
	assert.NotNil(t, got.Drivers)
	assert.NotNil(t, got.Progression)
}

func TestService_GetSummary_NotFound(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{summaryErr: pgx.ErrNoRows}

	_, err := constructors.GetSummary(context.Background(), queries, "nope")

	require.ErrorIs(t, err, pgx.ErrNoRows)
}

func TestService_GetSummary_DriversAttachToSeasonAndEngine(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{
		seasons: []database.ListConstructorSeasonsRow{
			{Season: 1967, EngineManufacturerID: "climax", EngineManufacturerName: "Climax"},
			{Season: 1967, EngineManufacturerID: "ford", EngineManufacturerName: "Ford"},
		},
		drivers: []database.ListConstructorSeasonDriversRow{
			{Season: 1967, EngineManufacturerID: "ford", DriverID: "jim-clark", DriverName: "Jim Clark"},
			{Season: 1967, EngineManufacturerID: "climax", DriverID: "mike-spence", DriverName: "Mike Spence"},
		},
	}

	got, err := constructors.GetSummary(context.Background(), queries, "lotus")

	require.NoError(t, err)
	require.Len(t, got.Seasons, 2)
	assert.Equal(t, "Climax", got.Seasons[0].Engine)
	assert.Equal(t, []string{"mike-spence"}, driverIDs(got.Seasons[0]))
	assert.Equal(t, "Ford", got.Seasons[1].Engine)
	assert.Equal(t, []string{"jim-clark"}, driverIDs(got.Seasons[1]))
}

func TestService_GetSummary_NoStanding(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{
		seasons: []database.ListConstructorSeasonsRow{{Season: 1955, EngineManufacturerID: "alta"}},
	}

	got, err := constructors.GetSummary(context.Background(), queries, "connaught")

	require.NoError(t, err)
	assert.Empty(t, got.Seasons[0].Position)
	assert.False(t, got.Seasons[0].Points.Valid)
	assert.Equal(t, []constructors.SeasonDriver{}, got.Seasons[0].Drivers)
}

func TestService_GetSummary_EmptyLineage(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{}

	got, err := constructors.GetSummary(context.Background(), queries, "connaught")

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

			queries := stubQuerier{rows: tt.rows, err: tt.err}

			got, err := constructors.ListConstructors(context.Background(), queries)

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
