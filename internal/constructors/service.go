package constructors

import (
	"context"
	"fmt"

	"github.com/jsec/drs/internal/database"
)

type constructorsQueries interface {
	ListConstructors(ctx context.Context) ([]database.ListConstructorsRow, error)
}

type Service struct {
	queries constructorsQueries
}

func NewService(queries constructorsQueries) *Service {
	return &Service{
		queries: queries,
	}
}

func (s *Service) ListConstructors(ctx context.Context) ([]ConstructorResponse, error) {
	rows, err := s.queries.ListConstructors(ctx)
	if err != nil {
		return nil, fmt.Errorf("listing constructors: %w", err)
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
