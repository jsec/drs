package httpx

import (
	"errors"
	"log/slog"
	"net/http"
)

type Error struct {
	Status  int
	Message string
}

type HandlerFunc func(http.ResponseWriter, *http.Request) error

type handler struct {
	logger *slog.Logger
	fn     HandlerFunc
}

func (e *Error) Error() string { return e.Message }

func NewError(status int, message string) *Error {
	return &Error{Status: status, Message: message}
}

func Handle(logger *slog.Logger, fn HandlerFunc) http.Handler {
	return handler{logger: logger, fn: fn}
}

func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := h.fn(w, r); err != nil {
		if apiErr, ok := errors.AsType[*Error](err); ok {
			writeError(w, apiErr.Status, apiErr.Message)
			return
		}

		h.logger.Error("unhandled handler error",
			"method", r.Method,
			"path", r.URL.Path,
			"err", err,
		)
		writeError(w, http.StatusInternalServerError, "internal server error")
	}
}
