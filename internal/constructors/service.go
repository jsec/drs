package constructors

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jsec/drs/internal/database"
)

type Service struct {
	queries *database.Queries
}

func NewService(queries *database.Queries) *Service {
	return &Service{queries: queries}
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
			FirstRaceDate: dateToString(row.FirstRaceDate),
			LastRaceDate:  dateToString(row.LastRaceDate),
			Championships: row.Championships,
			Wins:          row.Wins,
			Podiums:       row.Podiums,
		})
	}

	return out, nil
}

func dateToString(d pgtype.Date) *string {
	if !d.Valid {
		return nil
	}

	s := d.Time.Format("2006-01-02")
	return &s
}
