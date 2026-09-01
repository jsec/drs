package api

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"

	"github.com/jsec/drs/internal/circuits"
	"github.com/jsec/drs/internal/database"
	"github.com/jsec/drs/internal/dbtypes"
)

type stubQuerier struct {
	circuitErr  error
	circuitRows []database.ListCircuitsRow
}

func (s stubQuerier) GetCircuitInfo(context.Context, string) (database.GetCircuitInfoRow, error) {
	return database.GetCircuitInfoRow{}, s.circuitErr
}

func (s stubQuerier) ListCircuits(context.Context) ([]database.ListCircuitsRow, error) {
	return s.circuitRows, nil
}

func (stubQuerier) GetRacesByCircuitId(context.Context, string) ([]database.GetRacesByCircuitIdRow, error) {
	return nil, nil
}

func TestGetCircuitSummaryHandler(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name       string
		circuitErr error
		wantStatus int
		wantError  string
	}{
		{
			name:       "not found",
			circuitErr: pgx.ErrNoRows,
			wantStatus: http.StatusNotFound,
			wantError:  "not found",
		},
		{
			name:       "internal error",
			circuitErr: errors.New("query failed"),
			wantStatus: http.StatusInternalServerError,
			wantError:  "internal server error",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			app := &application{
				logger:   slog.New(slog.NewTextHandler(io.Discard, nil)),
				circuits: circuits.NewService(stubQuerier{circuitErr: tt.circuitErr}),
			}

			req := httptest.NewRequest(http.MethodGet, "/circuits/nope", nil)
			req.SetPathValue("circuitID", "nope")
			rec := httptest.NewRecorder()

			handle(app.logger, app.getCircuitSummaryHandler).ServeHTTP(rec, req)

			assert.Equal(t, tt.wantStatus, rec.Code)
			assert.JSONEq(t, fmt.Sprintf(`{"error":%q}`, tt.wantError), rec.Body.String())
		})
	}
}

func TestListCircuitsHandler_UsesCamelCaseJSON(t *testing.T) {
	t.Parallel()

	app := &application{
		logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		circuits: circuits.NewService(stubQuerier{
			circuitRows: []database.ListCircuitsRow{{
				CircuitID:     "monza",
				FirstRaceDate: testDate(1950, time.September, 3),
				LastRaceDate:  testDate(2026, time.September, 6),
				RaceCount:     75,
			}},
		}),
	}

	req := httptest.NewRequest(http.MethodGet, "/circuits", nil)
	rec := httptest.NewRecorder()

	handle(app.logger, app.listCircuitsHandler).ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.JSONEq(t, `[{"circuitId":"monza","name":"","country":"","firstRaceYear":1950,"lastRaceYear":2026,"location":"","raceCount":75}]`, rec.Body.String())
}

func testDate(year int, month time.Month, day int) dbtypes.Date {
	return dbtypes.Date{Date: pgtype.Date{
		Time:  time.Date(year, month, day, 0, 0, 0, 0, time.UTC),
		Valid: true,
	}}
}
