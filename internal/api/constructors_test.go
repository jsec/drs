package api

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/jsec/drs/internal/database"
)

type constructorStubQuerier struct {
	*database.Queries
}

func (constructorStubQuerier) ListConstructorSeasonEntries(context.Context, int32, string) ([]database.ListConstructorSeasonEntriesRow, error) {
	return nil, nil
}

func TestGetConstructorSeasonHandler_NotFound(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		year string
	}{
		{name: "no season entry", year: "2030"},
		{name: "invalid year", year: "abc"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			app := &application{
				logger:  slog.New(slog.NewTextHandler(io.Discard, nil)),
				queries: constructorStubQuerier{},
			}

			req := httptest.NewRequest(http.MethodGet, "/seasons/"+tt.year+"/constructors/lotus", nil)
			req.SetPathValue("year", tt.year)
			req.SetPathValue("constructorID", "lotus")
			rec := httptest.NewRecorder()

			handle(app.logger, app.getConstructorSeasonHandler).ServeHTTP(rec, req)

			assert.Equal(t, http.StatusNotFound, rec.Code)
			assert.JSONEq(t, `{"error":"not found"}`, rec.Body.String())
		})
	}
}
