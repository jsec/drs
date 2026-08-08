package seasons

import (
	"context"

	"github.com/jsec/drs/internal/database"
)

type Service struct {
	queries *database.Queries
}

func NewService(queries *database.Queries) *Service {
	return &Service{queries: queries}
}

func (s *Service) List(ctx context.Context) ([]SeasonResponse, error) {
	rows, err := s.queries.ListSeasons(ctx)
	if err != nil {
		return nil, err
	}

	out := make([]SeasonResponse, 0, len(rows))
	for _, row := range rows {
		out = append(out, toListResponse(row))
	}
	return out, nil
}

func toListResponse(row database.ListSeasonsRow) SeasonResponse {
	resp := SeasonResponse{
		Season:           row.Season,
		RaceCount:        row.RaceCount,
		ConstructorCount: row.ConstructorCount,
		Wdc: WDC{
			ID:          row.WdcDriverID.String,
			Name:        row.WdcDriverName.String,
			CountryCode: row.WdcCountryCode,
		},
	}

	if row.WccConstructorID.Valid && row.WccConstructorName.Valid {
		resp.Wcc = &WCC{
			ID:    row.WccConstructorID.String,
			Name:  row.WccConstructorName.String,
			Color: row.WccColor.String,
		}
	}

	return resp
}
