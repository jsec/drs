package seasons

import (
	"context"
	"fmt"

	"github.com/jsec/drs/internal/database"
)

type seasonQueries interface {
	ListSeasons(ctx context.Context) ([]database.ListSeasonsRow, error)
	ListSeasonCalendar(ctx context.Context, season int32) ([]database.ListSeasonCalendarRow, error)
	ListSeasonConstructorStandings(ctx context.Context, season int32) ([]database.ListSeasonConstructorStandingsRow, error)
	ListSeasonDriverProgression(ctx context.Context, season int32, driverIds []string) ([]database.ListSeasonDriverProgressionRow, error)
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

func (s *Service) GetOverview(ctx context.Context, season int32) (SeasonOverviewResponse, error) {
	driverRows, err := s.queries.ListSeasonDriverStandings(ctx, season)
	if err != nil {
		return SeasonOverviewResponse{}, fmt.Errorf("listing season driver standings: %w", err)
	}

	constructorRows, err := s.queries.ListSeasonConstructorStandings(ctx, season)
	if err != nil {
		return SeasonOverviewResponse{}, fmt.Errorf("listing season constructor standings: %w", err)
	}

	drivers := make([]DriverStanding, 0, len(driverRows))
	for _, row := range driverRows {
		var constructor *Constructor
		if row.ConstructorName.Valid && row.ConstructorColor.Valid {
			constructor = &Constructor{
				ID: row.ConstructorID, Name: row.ConstructorName.String, Color: row.ConstructorColor.String,
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

	var maxConstructorPoints float64
	constructors := make([]ConstructorStanding, 0, len(constructorRows))
	for _, row := range constructorRows {
		maxConstructorPoints = max(maxConstructorPoints, row.Points)
		constructors = append(constructors, ConstructorStanding{
			Position:      row.Position,
			PositionLabel: row.PositionLabel,
			Points:        row.Points,
			ID:            row.ConstructorID,
			EngineID:      row.EngineID,
			Name:          row.Name,
			Color:         row.ConstructorColor,
			CountryCode:   row.CountryCode,
		})
	}

	overview := SeasonOverviewResponse{
		Drivers:              drivers,
		Constructors:         constructors,
		MaxConstructorPoints: maxConstructorPoints,
		Progression: Progression{
			Data:   []ProgressionDataRow{},
			Series: []ProgressionSeries{},
		},
	}
	if len(drivers) == 0 {
		return overview, nil
	}

	overview.Leader = &drivers[0]
	if len(drivers) > 1 {
		overview.RunnerUp = &drivers[1]
	}

	selectedDrivers := drivers
	if len(selectedDrivers) > 6 {
		selectedDrivers = selectedDrivers[:6]
	}

	driverIDs := make([]string, 0, len(selectedDrivers))
	for _, driver := range selectedDrivers {
		driverIDs = append(driverIDs, driver.ID)
		series := ProgressionSeries{Name: driver.Code}
		if driver.Constructor != nil {
			series.Color = driver.Constructor.Color
		}
		overview.Progression.Series = append(overview.Progression.Series, series)
	}

	rows, err := s.queries.ListSeasonDriverProgression(ctx, season, driverIDs)
	if err != nil {
		return SeasonOverviewResponse{}, fmt.Errorf("listing season driver progression: %w", err)
	}

	for _, row := range rows {
		last := len(overview.Progression.Data) - 1
		if last < 0 || overview.Progression.Data[last]["round"] != float64(row.RaceRound) {
			overview.Progression.Data = append(overview.Progression.Data, ProgressionDataRow{
				"round": float64(row.RaceRound),
			})
			last++
		}
		overview.Progression.Data[last][row.Code] = row.Points
	}

	return overview, nil
}

func (s *Service) GetCalendar(ctx context.Context, season int32) (CalendarResponse, error) {
	raceRows, err := s.queries.ListSeasonCalendar(ctx, season)
	if err != nil {
		return CalendarResponse{}, err
	}

	calendar := CalendarResponse{
		Races:       make([]CalendarEntry, 0, len(raceRows)),
		TotalRounds: len(raceRows),
	}

	for _, race := range raceRows {
		entry := CalendarEntry{
			RaceID: race.RaceID,
			Round:  race.RaceRound,
			Name:   race.RaceName,
			Code:   race.GrandPrixCode.String,
			Date:   race.RaceDate,
			Circuit: calendarCircuit{
				ID:   race.CircuitID,
				Name: race.CircuitName,
			},
			Completed: race.Completed.Bool,
		}

		if race.WinnerDriverID.Valid {
			calendar.RoundsCompleted++

			entry.Winner = &calendarWinner{
				ID:   race.WinnerDriverID.String,
				Name: race.WinnerDriverName.String,
				Code: race.WinnerDriverCode.String,
				Constructor: &Constructor{
					ID:    race.WinnerConstructorID.String,
					Name:  race.WinnerConstructorName.String,
					Color: race.WinnerConstructorColor.String,
				},
			}
		}

		calendar.Races = append(calendar.Races, entry)
	}

	return calendar, nil
}
