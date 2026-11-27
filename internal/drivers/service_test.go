package drivers_test

import (
	"context"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/drivers"
)

type stubQuerier struct {
	database.Querier
	season   database.GetDriverSeasonRow
	races    []database.ListDriverSeasonRacesRow
	race     database.GetDriverRaceRow
	pitStops []database.ListDriverRacePitStopsRow
}

func (s stubQuerier) GetDriverRace(context.Context, int32, int32, string) (database.GetDriverRaceRow, error) {
	return s.race, nil
}

func (s stubQuerier) ListDriverRacePitStops(context.Context, int32, string) ([]database.ListDriverRacePitStopsRow, error) {
	return s.pitStops, nil
}

func (s stubQuerier) GetDriverSeason(context.Context, int32, string) (database.GetDriverSeasonRow, error) {
	return s.season, nil
}

func (s stubQuerier) ListDriverSeasonRaces(context.Context, int32, string) ([]database.ListDriverSeasonRacesRow, error) {
	return s.races, nil
}

func (stubQuerier) ListSeasonDriverProgression(context.Context, int32, []string) ([]database.ListSeasonDriverProgressionRow, error) {
	return []database.ListSeasonDriverProgressionRow{{RaceRound: 1, Points: 25}}, nil
}

func TestService_GetSeason_SprintOnlyWhenPresent(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{
		season: database.GetDriverSeasonRow{Code: "NOR", Position: pgtype.Text{String: "1", Valid: true}},
		races: []database.ListDriverSeasonRacesRow{
			{RaceRound: 1, PositionLabel: "1", Points: 25},
			{RaceRound: 2, PositionLabel: "2", Points: 18, SprintPositionLabel: pgtype.Text{String: "3", Valid: true}, SprintPoints: 6},
		},
	}

	got, err := drivers.GetSeason(context.Background(), queries, "lando-norris", 2026)

	require.NoError(t, err)
	assert.Equal(t, "1", got.Position)
	assert.Len(t, got.Progression, 1)
	require.Len(t, got.Races, 2)
	assert.Nil(t, got.Races[0].Sprint)
	require.NotNil(t, got.Races[1].Sprint)
	assert.Equal(t, "3", got.Races[1].Sprint.PositionLabel)
	assert.InDelta(t, 6, got.Races[1].Sprint.Points, 0)
}

func TestService_GetRace_NoPitStopsIsEmptyList(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{race: database.GetDriverRaceRow{Code: "NOR", PositionLabel: "1"}}

	got, err := drivers.GetRace(context.Background(), queries, "lando-norris", 2025, 1)

	require.NoError(t, err)
	assert.Equal(t, "1", got.PositionLabel)
	assert.NotNil(t, got.PitStops)
	assert.Empty(t, got.PitStops)
}
