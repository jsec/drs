package drivers

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jsec/drs/internal/database"
)

type driverQueries interface {
	GetDriverRace(ctx context.Context, season int32, raceRound int32, driverID string) (database.GetDriverRaceRow, error)
	GetDriverSprint(ctx context.Context, season int32, raceRound int32, driverID string) (database.GetDriverSprintRow, error)
	GetDriverSeason(ctx context.Context, season int32, driverID string) (database.GetDriverSeasonRow, error)
	GetDriverSummary(ctx context.Context, driverID string) (database.GetDriverSummaryRow, error)
	ListDriverRacePitStops(ctx context.Context, raceID int32, driverID string) ([]database.ListDriverRacePitStopsRow, error)
	ListDriverSeasonRaces(ctx context.Context, season int32, driverID string) ([]database.ListDriverSeasonRacesRow, error)
	ListDriverSeasons(ctx context.Context, driverID string) ([]database.ListDriverSeasonsRow, error)
	ListDrivers(ctx context.Context) ([]database.ListDriversRow, error)
	ListSeasonDriverProgression(ctx context.Context, season int32, driverIds []string) ([]database.ListSeasonDriverProgressionRow, error)
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
			FirstYear:        year(d.FirstRaceDate),
			LastYear:         year(d.LastRaceDate),
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
		FirstYear:        year(summary.FirstRaceDate),
		LastYear:         year(summary.LastRaceDate),
		Seasons:          seasons,
	}

	return response, nil
}

func (s *Service) GetSeason(ctx context.Context, driverID string, season int32) (DriverSeason, error) {
	summary, err := s.queries.GetDriverSeason(ctx, season, driverID)
	if err != nil {
		return DriverSeason{}, fmt.Errorf("getting driver season: %w", err)
	}

	progressionRows, err := s.queries.ListSeasonDriverProgression(ctx, season, []string{driverID})
	if err != nil {
		return DriverSeason{}, fmt.Errorf("listing driver season progression: %w", err)
	}

	raceRows, err := s.queries.ListDriverSeasonRaces(ctx, season, driverID)
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

func (s *Service) GetRace(ctx context.Context, driverID string, season, round int32) (DriverRace, error) {
	race, err := s.queries.GetDriverRace(ctx, season, round, driverID)
	if err != nil {
		return DriverRace{}, fmt.Errorf("getting driver race: %w", err)
	}

	stopRows, err := s.queries.ListDriverRacePitStops(ctx, race.RaceID, driverID)
	if err != nil {
		return DriverRace{}, fmt.Errorf("listing driver race pit stops: %w", err)
	}

	stops := make([]pitStop, 0, len(stopRows))
	for _, row := range stopRows {
		stops = append(stops, pitStop{
			Stop:       row.StopNumber,
			Lap:        row.LapNumber,
			Duration:   row.Duration.String,
			DurationMs: row.DurationMs,
		})
	}

	return DriverRace{
		RaceName: race.RaceName,
		Code:     race.Code,
		Name:     race.Name,
		Constructor: constructor{
			Name:  race.ConstructorName,
			Color: race.ConstructorColor.String,
		},
		CarNumber:               race.CarNumber,
		PositionLabel:           race.PositionLabel,
		Position:                race.Position,
		Grid:                    race.GridPosition,
		PositionsGained:         race.PositionsGained,
		Time:                    race.ElapsedTime.String,
		Gap:                     race.Gap.String,
		StatusCategory:          race.StatusCategory,
		LapsCompleted:           race.LapsCompleted,
		Points:                  race.Points,
		PitStopCount:            race.PitStopCount,
		TimePenalty:             race.TimePenalty.String,
		IsWin:                   race.IsWin,
		IsPole:                  race.IsPolePosition,
		IsFastestLap:            race.IsFastestLap,
		IsDriverOfTheDay:        race.IsDriverOfTheDay,
		IsGrandSlam:             race.IsGrandSlam,
		QualifyingPositionLabel: race.QualifyingPositionLabel.String,
		BestQualifyingTime:      race.BestQualifyingTime.String,
		FastestLapRank:          race.FastestLapPosition,
		HasSprint:               race.HasSprint,
		PitStops:                stops,
	}, nil
}

func (s *Service) GetSprint(ctx context.Context, driverID string, season, round int32) (DriverRace, error) {
	sprint, err := s.queries.GetDriverSprint(ctx, season, round, driverID)
	if err != nil {
		return DriverRace{}, fmt.Errorf("getting driver sprint: %w", err)
	}

	return DriverRace{
		RaceName: sprint.RaceName,
		Code:     sprint.Code,
		Name:     sprint.Name,
		Constructor: constructor{
			Name:  sprint.ConstructorName,
			Color: sprint.ConstructorColor.String,
		},
		CarNumber:       sprint.CarNumber,
		PositionLabel:   sprint.PositionLabel,
		Position:        sprint.Position,
		Grid:            sprint.GridPosition,
		PositionsGained: sprint.PositionsGained,
		Time:            sprint.ElapsedTime.String,
		Gap:             sprint.Gap.String,
		StatusCategory:  sprint.StatusCategory,
		LapsCompleted:   sprint.LapsCompleted,
		Points:          sprint.Points,
		TimePenalty:     sprint.TimePenalty.String,
		IsWin:           sprint.IsWin,
		IsPole:          sprint.IsGridP1,
		HasSprint:       true,
		PitStops:        []pitStop{},
	}, nil
}

func year(d pgtype.Date) *int32 {
	if !d.Valid {
		return nil
	}
	y := int32(d.Time.Year())
	return &y
}
