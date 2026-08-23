package api

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/jackc/pgx/v5"

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

			if rec.Code != tt.wantStatus {
				t.Fatalf("status = %d, want %d", rec.Code, tt.wantStatus)
			}

			var body map[string]string
			if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
				t.Fatalf("unmarshal body: %v", err)
			}

			if body["error"] != tt.wantError {
				t.Errorf("error = %q, want %q", body["error"], tt.wantError)
			}
		})
	}
}
