package constructors

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

func (s *Service) ListConstructors(ctx context.Context) ([]ConstructorResponse, error) {
	rows, err := s.queries.ListConstructors(ctx)
	if err != nil {
		return nil, err
	}

	out := make([]ConstructorResponse, 0, len(rows))

	for _, row := range rows {
		out = append(out, ConstructorResponse{
			ID:            row.ID,
			Name:          row.Name,
			Color:         row.Color,
			FirstRaceDate: row.FirstRaceDate,
			LastRaceDate:  row.LastRaceDate,
			Championships: row.Championships,
			Wins:          row.Wins,
			Podiums:       row.Podiums,
		})
	}

	return out, nil
}
