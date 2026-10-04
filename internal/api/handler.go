package api

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5"
)

var errNotFound = errors.New("not found")

func handle(logger *slog.Logger, fn func(http.ResponseWriter, *http.Request) error) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := fn(w, r)
		if err == nil {
			return
		}

		if errors.Is(err, errNotFound) || errors.Is(err, pgx.ErrNoRows) {
			writeError(w, http.StatusNotFound, "not found")
			return
		}

		logger.Error("unhandled handler error",
			"method", r.Method,
			"path", r.URL.Path,
			"err", err,
		)

		writeError(w, http.StatusInternalServerError, "internal server error")
	}
}
