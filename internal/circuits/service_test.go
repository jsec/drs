package circuits_test

import (
	"context"
	"encoding/json"
	"errors"
	"reflect"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jsec/drs/internal/circuits"
	"github.com/jsec/drs/internal/database"
)

type stubQuerier struct {
	database.Querier
	rows []database.ListCircuitsRow
	err  error
}

func (s stubQuerier) ListCircuits(context.Context) ([]database.ListCircuitsRow, error) {
	return s.rows, s.err
}

func date(s string) pgtype.Date {
	tm, err := time.Parse("2006-01-02", s)
	if err != nil {
		panic(err)
	}

	return pgtype.Date{Time: tm, Valid: true}
}

func yearptr(y int32) *int32 {
	return &y
}

func TestService_ListCircuits(t *testing.T) {
	t.Parallel()

	errQuery := errors.New("query failed")

	tests := []struct {
		name    string
		rows    []database.ListCircuitsRow
		err     error
		want    []circuits.ListCircuitsResponse
		wantErr error
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
				FirstRaceYear: yearptr(1950),
				LastRaceYear:  yearptr(2026),
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
				FirstRaceYear: yearptr(1959),
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
			name:    "query error",
			err:     errQuery,
			wantErr: errQuery,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			svc := circuits.NewService(stubQuerier{rows: tt.rows, err: tt.err})

			got, err := svc.ListCircuits(context.Background())

			if tt.wantErr != nil {
				if !errors.Is(err, tt.wantErr) {
					t.Fatalf("ListCircuits() error = %v, want %v", err, tt.wantErr)
				}
				if got != nil {
					t.Errorf("ListCircuits() = %v, want nil on error", got)
				}
				return
			}

			if err != nil {
				t.Fatalf("ListCircuits() unexpected error: %v", err)
			}

			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ListCircuits() mismatch\ngot:  %s\nwant: %s", dump(t, got), dump(t, tt.want))
			}
		})
	}
}

func dump(t *testing.T, v any) string {
	t.Helper()

	b, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}

	return string(b)
}
