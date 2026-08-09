package httpx

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

func WriteJSON(logger *slog.Logger, w http.ResponseWriter, status int, v any) error {
	buf, err := json.Marshal(v)
	if err != nil {
		return err
	}

	if err := writeJSON(w, status, buf); err != nil {
		logger.Error("write response body", "err", err)
	}

	return nil
}

func writeError(w http.ResponseWriter, status int, message string) {
	buf, _ := json.Marshal(map[string]string{"error": message})
	_ = writeJSON(w, status, buf)
}

func writeJSON(w http.ResponseWriter, status int, buf []byte) error {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_, err := w.Write(buf)

	return err
}
