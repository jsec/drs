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

func (e *Error) Error() string { return e.Message }

func NewError(status int, message string) *Error {
	return &Error{Status: status, Message: message}
}

type HandlerFunc func(http.ResponseWriter, *http.Request) error

func (h HandlerFunc) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := h(w, r); err != nil {
		if apiErr, ok := errors.AsType[*Error](err); ok {
			writeError(w, apiErr.Status, apiErr.Message)
			return
		}

		slog.Error("unhandled handler error",
			"method", r.Method,
			"path", r.URL.Path,
			"err", err,
		)
		writeError(w, http.StatusInternalServerError, "internal server error")
	}
}
