package drivers

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"

	"github.com/jsec/drs/internal/database"
)

var ErrNotFound = errors.New("driver not found")

type driverQueries interface {
	GetDriverSeason(ctx context.Context, arg database.GetDriverSeasonParams) (database.GetDriverSeasonRow, error)
	GetDriverSummary(ctx context.Context, driverID string) (database.GetDriverSummaryRow, error)
	ListDriverSeasonRaces(ctx context.Context, arg database.ListDriverSeasonRacesParams) ([]database.ListDriverSeasonRacesRow, error)
	ListDriverSeasons(ctx context.Context, driverID string) ([]database.ListDriverSeasonsRow, error)
	ListDrivers(ctx context.Context) ([]database.ListDriversRow, error)
	ListSeasonDriverProgression(ctx context.Context, arg database.ListSeasonDriverProgressionParams) ([]database.ListSeasonDriverProgressionRow, error)
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
			ID:               d.ID,
			Code:             d.Code,
			Name:             d.Name,
			Starts:           d.Starts,
			Wins:             d.Wins,
			Podiums:          d.Podiums,
			Poles:            d.Poles,
			Championships:    d.Championships,
			IsActive:         d.IsActive.Bool,
			ConstructorColor: d.ConstructorColor.String,
			FirstYear:        d.FirstRaceDate.Year(),
			LastYear:         d.LastRaceDate.Year(),
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
		Code:             summary.Code,
		Name:             summary.Name,
		Country:          summary.Country,
		CountryCode:      summary.CountryCode,
		Starts:           summary.Starts,
		Wins:             summary.Wins,
		Podiums:          summary.Podiums,
		Poles:            summary.Poles,
		Championships:    summary.Championships,
		IsActive:         summary.IsActive.Bool,
		ConstructorColor: summary.ConstructorColor.String,
		FirstYear:        summary.FirstRaceDate.Year(),
		LastYear:         summary.LastRaceDate.Year(),
		Seasons:          seasons,
	}

	return response, nil
}

func (s *Service) GetSeason(ctx context.Context, driverID string, season int32) (DriverSeason, error) {
	summary, err := s.queries.GetDriverSeason(ctx, database.GetDriverSeasonParams{Season: season, DriverID: driverID})
	if errors.Is(err, pgx.ErrNoRows) {
		return DriverSeason{}, ErrNotFound
	}
	if err != nil {
		return DriverSeason{}, fmt.Errorf("getting driver season: %w", err)
	}

	progressionRows, err := s.queries.ListSeasonDriverProgression(ctx, database.ListSeasonDriverProgressionParams{
		Season:    season,
		DriverIds: []string{driverID},
	})
	if err != nil {
		return DriverSeason{}, fmt.Errorf("listing driver season progression: %w", err)
	}

	raceRows, err := s.queries.ListDriverSeasonRaces(ctx, database.ListDriverSeasonRacesParams{
		Season:   season,
		DriverID: driverID,
	})
	if err != nil {
		return DriverSeason{}, fmt.Errorf("listing driver season races: %w", err)
	}

	progression := make([]progressionPoint, 0, len(progressionRows))
	for _, row := range progressionRows {
		progression = append(progression, progressionPoint{
			Round:  row.RaceRound,
			Points: row.Points,
		})
	}

	races := make([]seasonRace, 0, len(raceRows))
	for _, row := range raceRows {
		race := seasonRace{
			Round:          row.RaceRound,
			Name:           row.RaceName,
			Grid:           row.GridPosition,
			Position:       row.Position,
			PositionLabel:  row.PositionLabel,
			StatusCategory: row.StatusCategory,
			Points:         row.Points,
		}

		if row.SprintPositionLabel.Valid {
			race.Sprint = &sprintResult{
				PositionLabel: row.SprintPositionLabel.String,
				Points:        row.SprintPoints,
			}
		}

		races = append(races, race)
	}

	return DriverSeason{
		Code:        summary.Code,
		Name:        summary.Name,
		Country:     summary.Country,
		CountryCode: summary.CountryCode,
		Constructor: constructor{
			Name:  summary.ConstructorName,
			Color: summary.ConstructorColor,
		},
		CarNumber:   summary.CarNumber,
		Points:      summary.Points,
		Position:    summary.Position.String,
		Wins:        summary.Wins,
		Podiums:     summary.Podiums,
		Poles:       summary.Poles,
		Progression: progression,
		Races:       races,
	}, nil
}
