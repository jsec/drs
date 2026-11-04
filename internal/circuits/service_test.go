package circuits_test

import (
	"context"
	"errors"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/circuits"
	"github.com/jsec/drs/internal/database"
)

type stubQuerier struct {
	database.Querier
	circuit     database.GetCircuitInfoRow
	err         error
	races       []database.GetRacesByCircuitIdRow
	raceListErr error
}

func (s stubQuerier) GetCircuitInfo(context.Context, string) (database.GetCircuitInfoRow, error) {
	return s.circuit, s.err
}

func (s stubQuerier) GetRacesByCircuitId(context.Context, string) ([]database.GetRacesByCircuitIdRow, error) {
	return s.races, s.raceListErr
}

func TestService_GetCircuitSummaryWrapsQueryErrors(t *testing.T) {
	t.Parallel()

	errQuery := errors.New("query failed")

	tests := []struct {
		name    string
		queries stubQuerier
		wantErr string
	}{
		{
			name:    "circuit info",
			queries: stubQuerier{err: errQuery},
			wantErr: "getting circuit info: query failed",
		},
		{
			name:    "circuit races",
			queries: stubQuerier{raceListErr: errQuery},
			wantErr: "getting circuit races: query failed",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			_, err := circuits.GetCircuitSummary(context.Background(), tt.queries, "monza")

			require.ErrorIs(t, err, errQuery)
			assert.EqualError(t, err, tt.wantErr)
		})
	}
}

func TestService_GetCircuitSummaryRaces(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{
		races: []database.GetRacesByCircuitIdRow{
			{
				RaceID:           1150,
				Season:           2026,
				RaceRound:        23,
				CircuitLayoutID:  "yas-marina-2",
				RaceOfficialName: "Abu Dhabi Grand Prix",
				Completed:        pgtype.Bool{Bool: false, Valid: true},
			},
			{
				RaceID:           1125,
				Season:           2025,
				RaceRound:        24,
				CircuitLayoutID:  "yas-marina-2",
				RaceOfficialName: "Abu Dhabi Grand Prix",
				WinnerDriverName: pgtype.Text{String: "Max Verstappen", Valid: true},
				Completed:        pgtype.Bool{Bool: true, Valid: true},
			},
		},
	}

	got, err := circuits.GetCircuitSummary(context.Background(), queries, "yas-marina")

	require.NoError(t, err)
	assert.Equal(t, []circuits.CircuitRace{
		{
			RaceID:   1150,
			Season:   2026,
			Round:    23,
			LayoutID: "yas-marina-2",
			Name:     "Abu Dhabi Grand Prix",
		},
		{
			RaceID:     1125,
			Season:     2025,
			Round:      24,
			LayoutID:   "yas-marina-2",
			Name:       "Abu Dhabi Grand Prix",
			WinnerName: "Max Verstappen",
			Completed:  true,
		},
	}, got.Races)
}
