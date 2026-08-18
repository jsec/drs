package circuits

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"

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
			CircuitID:     row.CircuitID,
			Name:          row.Name,
			Country:       row.Country,
			FirstRaceYear: year(row.FirstRaceDate),
			LastRaceYear:  year(row.LastRaceDate),
			Location:      row.Location,
			RaceCount:     int(row.RaceCount),
		})
	}

	return out, nil
}

func year(d pgtype.Date) *int32 {
	if !d.Valid {
		return nil
	}

	y := int32(d.Time.Year())

	return &y
}
