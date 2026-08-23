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

	"github.com/jackc/pgx/v5"
	"github.com/stretchr/testify/assert"

	"github.com/jsec/drs/internal/circuits"
	"github.com/jsec/drs/internal/database"
)

type stubQuerier struct {
	database.Querier
	circuitErr error
}

func (s stubQuerier) GetCircuitInfo(context.Context, string) (database.GetCircuitInfoRow, error) {
	return database.GetCircuitInfoRow{}, s.circuitErr
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
