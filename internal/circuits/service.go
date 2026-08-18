package circuits

import (
	"context"

	"github.com/jsec/drs/internal/database"
)

type Service struct {
	queries database.Querier
}

func NewService(queries database.Querier) *Service {
	return &Service{queries}
}

func (s *Service) ListCircuits(ctx context.Context) ([]ListCircuitsResponse, error) {
	rows, err := s.queries.ListCircuits(ctx)
	if err != nil {
		return nil, err
	}

	out := make([]ListCircuitsResponse, 0, len(rows))

	for _, row := range rows {
		out = append(out, ListCircuitsResponse{
			CircuitID: row.CircuitID,
			Name:      row.Name,
			Country:   row.Country,
			FirstRace: &row.FirstRace.String,
			LastRace:  &row.LastRace.String,
			Location:  &row.Location,
			RaceCount: int(row.RaceCount),
		})
	}

	return out, nil
}
