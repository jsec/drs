package api

import (
	"log/slog"
	"net/http"
)

type handlerFunc func(http.ResponseWriter, *http.Request) error

type handler struct {
	logger *slog.Logger
	fn     handlerFunc
}

func handle(logger *slog.Logger, fn handlerFunc) http.Handler {
	return handler{logger: logger, fn: fn}
}

func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := h.fn(w, r); err != nil {
		h.logger.Error("unhandled handler error",
			"method", r.Method,
			"path", r.URL.Path,
			"err", err,
		)

		writeError(w, http.StatusInternalServerError, "internal server error")
	}
}
