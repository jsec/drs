package seasons_test

import (
	"context"
	"errors"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/seasons"
)

type stubQuerier struct {
	database.Querier
	rows []database.ListSeasonsRow
	err  error
}

func (s stubQuerier) ListSeasons(context.Context) ([]database.ListSeasonsRow, error) {
	return s.rows, s.err
}

func text(s string) pgtype.Text {
	return pgtype.Text{String: s, Valid: true}
}

func TestService_ListSeasons(t *testing.T) {
	t.Parallel()

	errQuery := errors.New("query failed")

	tests := []struct {
		name    string
		rows    []database.ListSeasonsRow
		err     error
		want    []seasons.SeasonResponse
		wantErr error
	}{
		{
			name: "full row with wcc",
			rows: []database.ListSeasonsRow{{
				Season:             2023,
				RaceCount:          22,
				ConstructorCount:   10,
				WdcDriverID:        text("max-verstappen"),
				WdcDriverName:      text("Max Verstappen"),
				WdcCountryCode:     "NL",
				WccConstructorID:   text("red-bull"),
				WccConstructorName: text("Red Bull"),
				WccColor:           text("#3671C6"),
			}},
			want: []seasons.SeasonResponse{{
				Season:           2023,
				RaceCount:        22,
				ConstructorCount: 10,
				Wdc:              seasons.WDC{ID: "max-verstappen", Name: "Max Verstappen", CountryCode: "NL"},
				Wcc:              &seasons.WCC{ID: "red-bull", Name: "Red Bull", Color: "#3671C6"},
			}},
		},
		{
			name: "wcc absent",
			rows: []database.ListSeasonsRow{{
				Season:           1950,
				RaceCount:        7,
				ConstructorCount: 0,
				WdcDriverID:      text("nino-farina"),
				WdcDriverName:    text("Nino Farina"),
				WdcCountryCode:   "IT",
			}},
			want: []seasons.SeasonResponse{{
				Season:           1950,
				RaceCount:        7,
				ConstructorCount: 0,
				Wdc:              seasons.WDC{ID: "nino-farina", Name: "Nino Farina", CountryCode: "IT"},
				Wcc:              nil,
			}},
		},
		{
			name: "wcc id valid but name missing",
			rows: []database.ListSeasonsRow{{
				Season:           1958,
				RaceCount:        11,
				ConstructorCount: 1,
				WdcDriverID:      text("mike-hawthorn"),
				WdcDriverName:    text("Mike Hawthorn"),
				WdcCountryCode:   "GB",
				WccConstructorID: text("vanwall"),
			}},
			want: []seasons.SeasonResponse{{
				Season:           1958,
				RaceCount:        11,
				ConstructorCount: 1,
				Wdc:              seasons.WDC{ID: "mike-hawthorn", Name: "Mike Hawthorn", CountryCode: "GB"},
				Wcc:              nil,
			}},
		},
		{
			name: "empty result",
			rows: nil,
			want: []seasons.SeasonResponse{},
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

			svc := seasons.NewService(stubQuerier{rows: tt.rows, err: tt.err})

			got, err := svc.ListSeasons(context.Background())

			if tt.wantErr != nil {
				require.ErrorIs(t, err, tt.wantErr)
				assert.Nil(t, got)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}
