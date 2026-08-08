package constructors

import (
	"net/http"

	"github.com/jsec/drs/internal/httpx"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) Routes(mux *http.ServeMux) {
	mux.Handle("GET /constructors", httpx.HandlerFunc(h.list))
}

func (h *Handler) list(w http.ResponseWriter, r *http.Request) error {
	list, err := h.svc.List(r.Context())
	if err != nil {
		return err
	}

	return httpx.WriteJSON(w, http.StatusOK, list)
}
