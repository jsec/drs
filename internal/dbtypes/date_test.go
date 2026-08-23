package dbtypes_test

import (
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jsec/drs/internal/dbtypes"
)

func validDate(s string) dbtypes.Date {
	tm, err := time.Parse("2006-01-02", s)
	if err != nil {
		panic(err)
	}

	return dbtypes.Date{Date: pgtype.Date{Time: tm, Valid: true}}
}

func TestDate_MarshalJSON(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		date dbtypes.Date
		want string
	}{
		{name: "valid", date: validDate("1950-09-03"), want: `"1950-09-03"`},
		{name: "invalid", date: dbtypes.Date{}, want: "null"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			got, err := tt.date.MarshalJSON()
			if err != nil {
				t.Fatalf("MarshalJSON() unexpected error: %v", err)
			}

			if string(got) != tt.want {
				t.Errorf("MarshalJSON() = %s, want %s", got, tt.want)
			}
		})
	}
}

func TestDate_Year(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		date dbtypes.Date
		want *int32
	}{
		{name: "valid", date: validDate("1950-09-03"), want: ptr(int32(1950))},
		{name: "invalid", date: dbtypes.Date{}, want: nil},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			got := tt.date.Year()

			switch {
			case tt.want == nil && got != nil:
				t.Errorf("Year() = %d, want nil", *got)
			case tt.want != nil && got == nil:
				t.Errorf("Year() = nil, want %d", *tt.want)
			case tt.want != nil && *got != *tt.want:
				t.Errorf("Year() = %d, want %d", *got, *tt.want)
			}
		})
	}
}

func ptr[T any](v T) *T {
	return &v
}
