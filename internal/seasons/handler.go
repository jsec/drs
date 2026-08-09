package seasons

import (
	"log/slog"
	"net/http"

	"github.com/jsec/drs/internal/httpx"
)

type Handler struct {
	log     *slog.Logger
	service *Service
}

func NewHandler(log *slog.Logger, service *Service) *Handler {
	return &Handler{
		log:     log,
		service: service,
	}
}

func (h *Handler) Routes(mux *http.ServeMux) {
	mux.Handle("GET /seasons", httpx.Handle(h.log, h.listSeasonsHandler))
}

func (h *Handler) listSeasonsHandler(w http.ResponseWriter, r *http.Request) error {
	list, err := h.service.List(r.Context())
	if err != nil {
		return err
	}

	return httpx.WriteJSON(h.log, w, http.StatusOK, list)
}
