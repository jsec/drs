package circuits_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/circuits"
	"github.com/jsec/drs/internal/database"
)

type stubQuerier struct {
	database.Querier
	circuit     database.GetCircuitInfoRow
	err         error
	raceListErr error
}

func (s stubQuerier) GetCircuitInfo(context.Context, string) (database.GetCircuitInfoRow, error) {
	return s.circuit, s.err
}

func (s stubQuerier) GetRacesByCircuitId(context.Context, string) ([]database.GetRacesByCircuitIdRow, error) {
	return nil, s.raceListErr
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
