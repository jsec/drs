package drivers

import (
	"context"
	"errors"
	"fmt"

	"github.com/jsec/drs/internal/database"
)

var ErrNotFound = errors.New("driver not found")

type driverQueries interface {
	GetDriverSummary(ctx context.Context, driverID string) (database.GetDriverSummaryRow, error)
	ListDriverSeasons(ctx context.Context, driverID string) ([]database.ListDriverSeasonsRow, error)
	ListDrivers(ctx context.Context) ([]database.ListDriversRow, error)
}

type Service struct {
	queries driverQueries
}

func NewService(queries driverQueries) *Service {
	return &Service{
		queries: queries,
	}
}

func (s *Service) ListDrivers(ctx context.Context) ([]DriverShortSummary, error) {
	drivers, err := s.queries.ListDrivers(ctx)
	if err != nil {
		return nil, fmt.Errorf("listing drivers: %w", err)
	}

	response := make([]DriverShortSummary, 0, len(drivers))

	for _, d := range drivers {
		driver := DriverShortSummary{
			Code:          d.Code,
			Name:          d.Name,
			Starts:        d.Starts,
			Wins:          d.Wins,
			Podiums:       d.Podiums,
			Poles:         d.Poles,
			Championships: d.Championships,
			FirstYear:     d.FirstRaceDate.Year(),
			LastYear:      d.LastRaceDate.Year(),
		}

		response = append(response, driver)
	}

	return response, nil
}

func (s *Service) GetSummary(ctx context.Context, driverId string) (DriverSummary, error) {
	summary, err := s.queries.GetDriverSummary(ctx, driverId)
	if err != nil {
		return DriverSummary{}, fmt.Errorf("getting driver summary: %w", err)
	}

	seasonList, err := s.queries.ListDriverSeasons(ctx, driverId)
	if err != nil {
		return DriverSummary{}, fmt.Errorf("listing driver seasons: %w", err)
	}

	seasons := make([]driverSeasonSummary, 0, len(seasonList))

	for _, s := range seasonList {
		season := driverSeasonSummary{
			Season: s.Season,
			Constructor: constructor{
				Name:  s.ConstructorName,
				Color: s.ConstructorColor,
			},
			Starts:   s.Starts,
			Wins:     s.Wins,
			Podiums:  s.Podiums,
			Poles:    s.Poles,
			Points:   s.Points,
			Position: s.Position.String,
		}

		seasons = append(seasons, season)
	}

	response := DriverSummary{
		Code:          summary.Code,
		Name:          summary.Name,
		Country:       summary.Country,
		CountryCode:   summary.CountryCode,
		Starts:        summary.Starts,
		Wins:          summary.Wins,
		Podiums:       summary.Podiums,
		Poles:         summary.Poles,
		Championships: summary.Championships,
		Seasons:       seasons,
	}

	return response, nil
}
