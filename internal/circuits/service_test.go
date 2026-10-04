package circuits_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/circuits"
	"github.com/jsec/drs/internal/database"
)

type stubQuerier struct {
	database.Querier
	rows        []database.ListCircuitsRow
	circuit     database.GetCircuitInfoRow
	err         error
	raceListErr error
}

func (s stubQuerier) ListCircuits(context.Context) ([]database.ListCircuitsRow, error) {
	return s.rows, s.err
}

func (s stubQuerier) GetCircuitInfo(context.Context, string) (database.GetCircuitInfoRow, error) {
	return s.circuit, s.err
}

func (s stubQuerier) GetRacesByCircuitId(context.Context, string) ([]database.GetRacesByCircuitIdRow, error) {
	return nil, s.raceListErr
}

func date(s string) pgtype.Date {
	tm, err := time.Parse("2006-01-02", s)
	if err != nil {
		panic(err)
	}

	return pgtype.Date{Time: tm, Valid: true}
}

func TestService_ListCircuits(t *testing.T) {
	t.Parallel()

	errQuery := errors.New("query failed")

	tests := []struct {
		name           string
		rows           []database.ListCircuitsRow
		err            error
		want           []circuits.ListCircuitsResponse
		wantErr        error
		wantErrMessage string
	}{
		{
			name: "valid dates",
			rows: []database.ListCircuitsRow{{
				CircuitID:     "monza",
				Name:          "Monza",
				Country:       "Italy",
				FirstRaceDate: date("1950-09-03"),
				LastRaceDate:  date("2026-09-06"),
				Location:      "Monza",
				RaceCount:     75,
			}},
			want: []circuits.ListCircuitsResponse{{
				CircuitID:     "monza",
				Name:          "Monza",
				Country:       "Italy",
				FirstRaceYear: new(int32(1950)),
				LastRaceYear:  new(int32(2026)),
				Location:      "Monza",
				RaceCount:     75,
			}},
		},
		{
			name: "null dates",
			rows: []database.ListCircuitsRow{{
				CircuitID: "madring",
				Name:      "Madring",
				Country:   "Spain",
				Location:  "Madrid",
			}},
			want: []circuits.ListCircuitsResponse{{
				CircuitID: "madring",
				Name:      "Madring",
				Country:   "Spain",
				Location:  "Madrid",
			}},
		},
		{
			name: "first race date only",
			rows: []database.ListCircuitsRow{{
				CircuitID:     "avus",
				Name:          "AVUS",
				Country:       "Germany",
				FirstRaceDate: date("1959-08-02"),
				Location:      "Berlin",
				RaceCount:     1,
			}},
			want: []circuits.ListCircuitsResponse{{
				CircuitID:     "avus",
				Name:          "AVUS",
				Country:       "Germany",
				FirstRaceYear: new(int32(1959)),
				Location:      "Berlin",
				RaceCount:     1,
			}},
		},
		{
			name: "empty result",
			rows: nil,
			want: []circuits.ListCircuitsResponse{},
		},
		{
			name:           "query error",
			err:            errQuery,
			wantErr:        errQuery,
			wantErrMessage: "listing circuits: query failed",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			queries := stubQuerier{rows: tt.rows, err: tt.err}

			got, err := circuits.ListCircuits(context.Background(), queries)

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

func TestService_GetCircuitSummaryNormalizesNullPreviousNames(t *testing.T) {
	t.Parallel()

	queries := stubQuerier{
		circuit: database.GetCircuitInfoRow{
			CircuitID: "lusail",
		},
	}

	got, err := circuits.GetCircuitSummary(context.Background(), queries, "lusail")

	require.NoError(t, err)
	assert.NotNil(t, got.PreviousNames)
	assert.Empty(t, got.PreviousNames)
}
