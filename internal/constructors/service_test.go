package constructors_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/constructors"
	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/dbtypes"
)

type stubQuerier struct {
	rows []database.ListConstructorsRow
	err  error
}

func (s stubQuerier) ListConstructors(context.Context) ([]database.ListConstructorsRow, error) {
	return s.rows, s.err
}

func date(s string) dbtypes.Date {
	tm, err := time.Parse("2006-01-02", s)
	if err != nil {
		panic(err)
	}

	return dbtypes.Date{Date: pgtype.Date{Time: tm, Valid: true}}
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
