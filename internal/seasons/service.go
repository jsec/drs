package seasons

import (
	"context"
	"fmt"

	"github.com/jsec/drs/internal/database"
)

type seasonQueries interface {
	ListSeasons(ctx context.Context) ([]database.ListSeasonsRow, error)
	ListSeasonConstructorStandings(ctx context.Context, season int32) ([]database.ListSeasonConstructorStandingsRow, error)
	ListSeasonDriverProgression(ctx context.Context, season int32) ([]database.ListSeasonDriverProgressionRow, error)
	ListSeasonDriverStandings(ctx context.Context, season int32) ([]database.ListSeasonDriverStandingsRow, error)
}

type Service struct {
	queries seasonQueries
}

func NewService(queries seasonQueries) *Service {
	return &Service{
		queries: queries,
	}
}

func (s *Service) ListSeasons(ctx context.Context) ([]SeasonResponse, error) {
	rows, err := s.queries.ListSeasons(ctx)
	if err != nil {
		return nil, fmt.Errorf("listing seasons: %w", err)
	}

	out := make([]SeasonResponse, 0, len(rows))

	for _, row := range rows {
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
			resp.Wcc = &Constructor{
				ID:    row.WccConstructorID.String,
				Name:  row.WccConstructorName.String,
				Color: row.WccColor.String,
			}
		}

		out = append(out, resp)
	}

	return out, nil
}

func (s *Service) GetStandings(ctx context.Context, season int32) (StandingsResponse, error) {
	driverRows, err := s.queries.ListSeasonDriverStandings(ctx, season)
	if err != nil {
		return StandingsResponse{}, fmt.Errorf("listing season driver standings: %w", err)
	}

	constructorRows, err := s.queries.ListSeasonConstructorStandings(ctx, season)
	if err != nil {
		return StandingsResponse{}, fmt.Errorf("listing season constructor standings: %w", err)
	}

	drivers := make([]DriverStanding, 0, len(driverRows))
	for _, row := range driverRows {
		var constructor *Constructor
		if row.ConstructorID.Valid && row.ConstructorName.Valid && row.ConstructorColor.Valid {
			constructor = &Constructor{
				ID: row.ConstructorID.String, Name: row.ConstructorName.String, Color: row.ConstructorColor.String,
			}
		}

		drivers = append(drivers, DriverStanding{
			Position:      row.Position,
			PositionLabel: row.PositionLabel,
			Points:        row.Points,
			ID:            row.DriverID,
			Code:          row.Code,
			Name:          row.Name,
			Country:       row.Country,
			CountryCode:   row.CountryCode,
			Constructor:   constructor,
			CarNumber:     row.CarNumber,
			Wins:          row.Wins,
			Podiums:       row.Podiums,
			Poles:         row.Poles,
		})
	}

	constructors := make([]ConstructorStanding, 0, len(constructorRows))
	for _, row := range constructorRows {
		constructors = append(constructors, ConstructorStanding{
			Position:      row.Position,
			PositionLabel: row.PositionLabel,
			Points:        row.Points,
			ID:            row.ConstructorID,
			Name:          row.Name,
			Color:         row.ConstructorColor,
		})
	}

	return StandingsResponse{Drivers: drivers, Constructors: constructors}, nil
}

func (s *Service) ListDriverProgression(ctx context.Context, season int32) ([]DriverProgression, error) {
	rows, err := s.queries.ListSeasonDriverProgression(ctx, season)
	if err != nil {
		return nil, fmt.Errorf("listing season driver progression: %w", err)
	}

	out := make([]DriverProgression, 0, len(rows))
	for _, row := range rows {
		out = append(out, DriverProgression{
			RaceRound: row.RaceRound,
			DriverID:  row.DriverID,
			Code:      row.Code,
			Points:    row.Points,
		})
	}

	return out, nil
}
