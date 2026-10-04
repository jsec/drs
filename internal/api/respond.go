package api

import (
	"encoding/json"
	"net/http"
)

func respondJSON(w http.ResponseWriter, v any) error {
	buf, err := json.Marshal(v)
	if err != nil {
		return err
	}

	writeJSON(w, http.StatusOK, buf)

	return nil
}

func writeError(w http.ResponseWriter, status int, message string) {
	buf, _ := json.Marshal(map[string]string{"error": message})
	writeJSON(w, status, buf)
}

func writeJSON(w http.ResponseWriter, status int, buf []byte) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_, _ = w.Write(buf)
}
