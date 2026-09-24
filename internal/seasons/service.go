package seasons

import (
	"context"
	"fmt"

	"github.com/jsec/drs/internal/database"
)

type seasonQueries interface {
	ListSeasons(ctx context.Context) ([]database.ListSeasonsRow, error)
	ListSeasonConstructorStandings(ctx context.Context, season int32) ([]database.ListSeasonConstructorStandingsRow, error)
	ListSeasonDriverProgression(ctx context.Context, arg database.ListSeasonDriverProgressionParams) ([]database.ListSeasonDriverProgressionRow, error)
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

	return StandingsResponse{
		Drivers:              drivers,
		Constructors:         constructors,
		MaxConstructorPoints: maxConstructorPoints(constructors),
	}, nil
}

func (s *Service) GetOverview(ctx context.Context, season int32) (SeasonOverviewResponse, error) {
	standings, err := s.GetStandings(ctx, season)
	if err != nil {
		return SeasonOverviewResponse{}, fmt.Errorf("getting season standings: %w", err)
	}

	overview := SeasonOverviewResponse{
		Drivers:              standings.Drivers,
		Constructors:         standings.Constructors,
		MaxConstructorPoints: standings.MaxConstructorPoints,
		Progression: Progression{
			Data:   []ProgressionDataRow{},
			Series: []ProgressionSeries{},
		},
	}
	if len(standings.Drivers) == 0 {
		return overview, nil
	}

	overview.Leader = &standings.Drivers[0]
	if len(standings.Drivers) > 1 {
		overview.RunnerUp = &standings.Drivers[1]
	}

	selectedDrivers := standings.Drivers
	if len(selectedDrivers) > 6 {
		selectedDrivers = selectedDrivers[:6]
	}

	driverIDs := make([]string, 0, len(selectedDrivers))
	for _, driver := range selectedDrivers {
		driverIDs = append(driverIDs, driver.ID)
		overview.Progression.Series = append(overview.Progression.Series, ProgressionSeries{
			Name:  driver.Code,
			Color: driver.Constructor.Color,
		})
	}

	rows, err := s.queries.ListSeasonDriverProgression(ctx, database.ListSeasonDriverProgressionParams{
		Season:    season,
		DriverIds: driverIDs,
	})
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

func maxConstructorPoints(constructors []ConstructorStanding) float64 {
	var maximum float64
	for _, constructor := range constructors {
		if constructor.Points > maximum {
			maximum = constructor.Points
		}
	}

	return maximum
}
