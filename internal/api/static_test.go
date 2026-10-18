package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"testing/fstest"

	"github.com/stretchr/testify/assert"
)

func TestStaticHandler(t *testing.T) {
	t.Parallel()

	files := fstest.MapFS{
		"index.html":           {Data: []byte("index")},
		"assets/app-abc123.js": {Data: []byte("app")},
		"circuits/monza-1.svg": {Data: []byte("svg")},
	}

	tests := []struct {
		name      string
		path      string
		wantCode  int
		wantBody  string
		wantCache string
	}{
		{name: "root", path: "/", wantCode: http.StatusOK, wantBody: "index", wantCache: "no-cache"},
		{name: "client route", path: "/seasons/2024", wantCode: http.StatusOK, wantBody: "index", wantCache: "no-cache"},
		{name: "directory", path: "/circuits/", wantCode: http.StatusOK, wantBody: "index", wantCache: "no-cache"},
		{name: "hashed asset", path: "/assets/app-abc123.js", wantCode: http.StatusOK, wantBody: "app", wantCache: "public, max-age=31536000, immutable"},
		{name: "public file", path: "/circuits/monza-1.svg", wantCode: http.StatusOK, wantBody: "svg", wantCache: "no-cache"},
		{name: "missing asset", path: "/assets/app-old456.js", wantCode: http.StatusNotFound, wantBody: "404 page not found\n"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			rec := httptest.NewRecorder()

			staticHandler(files).ServeHTTP(rec, httptest.NewRequest(http.MethodGet, tt.path, nil))

			assert.Equal(t, tt.wantCode, rec.Code)
			assert.Equal(t, tt.wantBody, rec.Body.String())
			assert.Equal(t, tt.wantCache, rec.Header().Get("Cache-Control"))
		})
	}
}
