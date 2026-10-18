package api

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRoutes_SameOriginCheck(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name       string
		appEnv     string
		fetchSite  string
		wantStatus int
	}{
		{name: "same-origin request", appEnv: "production", fetchSite: "same-origin", wantStatus: http.StatusOK},
		{name: "cross-site request", appEnv: "production", fetchSite: "cross-site", wantStatus: http.StatusForbidden},
		{name: "no header", wantStatus: http.StatusForbidden},
		{name: "no header in dev", appEnv: "dev", wantStatus: http.StatusOK},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			app := &application{
				logger:  slog.New(slog.NewTextHandler(io.Discard, nil)),
				queries: stubQuerier{},
				appEnv:  tt.appEnv,
			}

			req := httptest.NewRequest(http.MethodGet, "/api/circuits", nil)
			if tt.fetchSite != "" {
				req.Header.Set("Sec-Fetch-Site", tt.fetchSite)
			}
			rec := httptest.NewRecorder()

			app.routes().ServeHTTP(rec, req)

			assert.Equal(t, tt.wantStatus, rec.Code)
		})
	}
}
