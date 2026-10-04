package races_test

import (
	"context"
	"errors"
	"testing"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/races"
)

type stubQuerier struct {
	race       database.GetRaceDetailRow
	raceErr    error
	results    []database.ListRaceResultsRow
	resultsErr error
	laps       []database.ListRaceLapTimesRow
	lapsErr    error
}

func (s stubQuerier) GetRaceDetail(context.Context, int32, int32) (database.GetRaceDetailRow, error) {
	return s.race, s.raceErr
}

func (s stubQuerier) ListRaceResults(context.Context, int32) ([]database.ListRaceResultsRow, error) {
	return s.results, s.resultsErr
}

func (s stubQuerier) ListRaceLapTimes(context.Context, int32, string) ([]database.ListRaceLapTimesRow, error) {
	return s.laps, s.lapsErr
}

func text(s string) pgtype.Text {
	return pgtype.Text{String: s, Valid: true}
}

func int4(i int32) pgtype.Int4 {
	return pgtype.Int4{Int32: i, Valid: true}
}

var completedRace = database.GetRaceDetailRow{
	RaceID:             1163,
	Season:             2026,
	RaceRound:          14,
	RaceName:           "Spain",
	CircuitName:        "Madring",
	RaceLaps:           57,
	PoleDriverID:       text("lando-norris"),
	PoleCode:           text("NOR"),
	WinnerDriverID:     text("kimi-antonelli"),
	WinnerDriverCode:   text("ANT"),
	FastestLapDriverID: text("george-russell"),
	FastestLapCode:     text("RUS"),
	FastestLapTime:     text("1:35.587"),
}

var raceResults = []database.ListRaceResultsRow{
	{
		Position:         1,
		PositionLabel:    "1",
		DriverID:         "kimi-antonelli",
		Code:             "ANT",
		Name:             "Kimi Antonelli",
		LastName:         "Antonelli",
		ConstructorID:    "mercedes",
		ConstructorName:  "Mercedes",
		ConstructorColor: text("#00D7B6"),
		GridPosition:     int4(2),
		ElapsedTime:      text("1:34:23.754"),
		Points:           25,
	},
	{
		Position:         22,
		PositionLabel:    "DNF",
		DriverID:         "lewis-hamilton",
		Code:             "HAM",
		Name:             "Lewis Hamilton",
		LastName:         "Hamilton",
		ConstructorID:    "ferrari",
		ConstructorName:  "Ferrari",
		ConstructorColor: text("#ED1131"),
		Status:           text("Brakes"),
	},
}

func TestService_GetRaceDetail(t *testing.T) {
	t.Parallel()

	svc := races.NewService(stubQuerier{race: completedRace, results: raceResults})

	got, err := svc.GetRaceDetail(context.Background(), 2026, 14)

	require.NoError(t, err)
	assert.Equal(t, races.RaceDetailResponse{
		RaceID:  1163,
		Season:  2026,
		Round:   14,
		Name:    "Spain",
		Circuit: "Madring",
		Laps:    57,
		Pole:    &races.DriverRef{ID: "lando-norris", Code: "NOR"},
		Winner:  races.DriverRef{ID: "kimi-antonelli", Code: "ANT"},
		FastestLap: &races.FastestLap{
			Driver: races.DriverRef{ID: "george-russell", Code: "RUS"},
			Time:   "1:35.587",
		},
		Results: []races.Result{
			{
				Position:      1,
				PositionLabel: "1",
				Driver:        races.Driver{ID: "kimi-antonelli", Code: "ANT", Name: "Kimi Antonelli", ShortName: "Antonelli"},
				Constructor:   races.Constructor{ID: "mercedes", Name: "Mercedes", Color: "#00D7B6"},
				Grid:          int4(2),
				Time:          new("1:34:23.754"),
				Points:        25,
			},
			{
				Position:      22,
				PositionLabel: "DNF",
				Driver:        races.Driver{ID: "lewis-hamilton", Code: "HAM", Name: "Lewis Hamilton", ShortName: "Hamilton"},
				Constructor:   races.Constructor{ID: "ferrari", Name: "Ferrari", Color: "#ED1131"},
				Status:        new("Brakes"),
			},
		},
	}, got)
}

func TestService_GetRaceDetail_NoPoleOrFastestLap(t *testing.T) {
	t.Parallel()

	race := completedRace
	race.PoleDriverID = pgtype.Text{}
	race.PoleCode = pgtype.Text{}
	race.FastestLapDriverID = pgtype.Text{}

	svc := races.NewService(stubQuerier{race: race})

	got, err := svc.GetRaceDetail(context.Background(), 2026, 14)

	require.NoError(t, err)
	assert.Nil(t, got.Pole)
	assert.Nil(t, got.FastestLap)
	assert.Equal(t, []races.Result{}, got.Results)
}

func TestService_RaceLookupErrors(t *testing.T) {
	t.Parallel()

	errQuery := errors.New("query failed")
	notRun := completedRace
	notRun.WinnerDriverID = pgtype.Text{}

	tests := []struct {
		name           string
		querier        stubQuerier
		wantErr        error
		wantErrMessage string
	}{
		{
			name:           "unknown round",
			querier:        stubQuerier{raceErr: pgx.ErrNoRows},
			wantErr:        pgx.ErrNoRows,
			wantErrMessage: "getting race detail: no rows in result set",
		},
		{
			name:           "race not run yet",
			querier:        stubQuerier{race: notRun},
			wantErr:        pgx.ErrNoRows,
			wantErrMessage: "race not completed: no rows in result set",
		},
		{
			name:           "race query error",
			querier:        stubQuerier{raceErr: errQuery},
			wantErr:        errQuery,
			wantErrMessage: "getting race detail: query failed",
		},
		{
			name:           "results query error",
			querier:        stubQuerier{race: completedRace, resultsErr: errQuery},
			wantErr:        errQuery,
			wantErrMessage: "listing race results: query failed",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			svc := races.NewService(tt.querier)

			_, err := svc.GetRaceDetail(context.Background(), 2026, 14)
			require.ErrorIs(t, err, tt.wantErr)
			require.EqualError(t, err, tt.wantErrMessage)

			_, err = svc.GetRaceLaps(context.Background(), 2026, 14, "race")
			require.ErrorIs(t, err, tt.wantErr)
			require.EqualError(t, err, tt.wantErrMessage)
		})
	}
}

func TestService_GetRaceLaps(t *testing.T) {
	t.Parallel()

	svc := races.NewService(stubQuerier{
		race:    completedRace,
		results: raceResults,
		laps: []database.ListRaceLapTimesRow{
			{DriverID: "kimi-antonelli", LapNumber: 1, Position: int4(2), LapTimeMs: 98765},
			{DriverID: "kimi-antonelli", LapNumber: 2, Position: int4(1), LapTimeMs: 96123},
		},
	})

	got, err := svc.GetRaceLaps(context.Background(), 2026, 14, "race")

	require.NoError(t, err)
	assert.Equal(t, races.RaceLapsResponse{
		Drivers: []races.DriverLaps{
			{
				Driver: races.DriverRef{ID: "kimi-antonelli", Code: "ANT"},
				Color:  "#00D7B6",
				Laps: []races.Lap{
					{Lap: 1, Position: int4(2), TimeMs: 98765},
					{Lap: 2, Position: int4(1), TimeMs: 96123},
				},
			},
			{
				Driver: races.DriverRef{ID: "lewis-hamilton", Code: "HAM"},
				Color:  "#ED1131",
				Laps:   []races.Lap{},
			},
		},
	}, got)
}

func TestService_GetRaceLaps_LapQueryError(t *testing.T) {
	t.Parallel()

	errQuery := errors.New("query failed")
	svc := races.NewService(stubQuerier{race: completedRace, results: raceResults, lapsErr: errQuery})

	_, err := svc.GetRaceLaps(context.Background(), 2026, 14, "race")

	require.ErrorIs(t, err, errQuery)
	require.EqualError(t, err, "listing race lap times: query failed")
}
