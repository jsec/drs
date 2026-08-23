package api

import (
	"errors"
	"log/slog"
	"net/http"
)

var errNotFound = errors.New("not found")

type handlerFunc func(http.ResponseWriter, *http.Request) error

type handler struct {
	logger *slog.Logger
	fn     handlerFunc
}

func handle(logger *slog.Logger, fn handlerFunc) http.Handler {
	return handler{logger, fn}
}

func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := h.fn(w, r)
	if err == nil {
		return
	}

	if errors.Is(err, errNotFound) {
		writeError(w, http.StatusNotFound, "not found")
		return
	}

	h.logger.Error("unhandled handler error",
		"method", r.Method,
		"path", r.URL.Path,
		"err", err,
	)

	writeError(w, http.StatusInternalServerError, "internal server error")
}
