package constructors

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jsec/drs/internal/database"
)

type constructorsQueries interface {
	ListConstructors(ctx context.Context) ([]database.ListConstructorsRow, error)
	GetConstructorSummary(ctx context.Context, constructorID string) (database.GetConstructorSummaryRow, error)
	ListConstructorSeasons(ctx context.Context, constructorID string) ([]database.ListConstructorSeasonsRow, error)
	ListConstructorSeasonDrivers(ctx context.Context, constructorID string) ([]database.ListConstructorSeasonDriversRow, error)
	ListConstructorLineage(ctx context.Context, constructorID string) ([]database.ListConstructorLineageRow, error)
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

func (s *Service) GetSummary(ctx context.Context, constructorID string) (ConstructorSummary, error) {
	summary, err := s.queries.GetConstructorSummary(ctx, constructorID)
	if err != nil {
		return ConstructorSummary{}, fmt.Errorf("getting constructor summary: %w", err)
	}

	seasonRows, err := s.queries.ListConstructorSeasons(ctx, constructorID)
	if err != nil {
		return ConstructorSummary{}, fmt.Errorf("listing constructor seasons: %w", err)
	}

	driverRows, err := s.queries.ListConstructorSeasonDrivers(ctx, constructorID)
	if err != nil {
		return ConstructorSummary{}, fmt.Errorf("listing constructor season drivers: %w", err)
	}

	lineageRows, err := s.queries.ListConstructorLineage(ctx, constructorID)
	if err != nil {
		return ConstructorSummary{}, fmt.Errorf("listing constructor lineage: %w", err)
	}

	drivers := make(map[seasonEngine][]SeasonDriver)
	for _, row := range driverRows {
		key := seasonEngine{row.Season, row.EngineManufacturerID}
		drivers[key] = append(drivers[key], SeasonDriver{ID: row.DriverID, Name: row.DriverName})
	}

	seasons := make([]ConstructorSeason, 0, len(seasonRows))
	for _, row := range seasonRows {
		seasonDrivers := drivers[seasonEngine{row.Season, row.EngineManufacturerID}]
		if seasonDrivers == nil {
			seasonDrivers = []SeasonDriver{}
		}

		season := ConstructorSeason{
			Season:     row.Season,
			Engine:     row.EngineManufacturerName,
			Position:   row.FinalPositionText.String,
			IsChampion: row.ChampionshipWon,
			Starts:     row.Starts,
			Wins:       row.Wins,
			Podiums:    row.Podiums,
			Poles:      row.Poles,
			Drivers:    seasonDrivers,
		}

		if row.FinalPoints.Valid {
			season.Points = &row.FinalPoints.Float64
		}

		seasons = append(seasons, season)
	}

	lineage := make([]LineageEntry, 0, len(lineageRows))
	for _, row := range lineageRows {
		entry := LineageEntry{
			Order:    row.PositionDisplayOrder,
			ID:       row.OtherConstructorID,
			Name:     row.OtherConstructorName,
			YearFrom: row.YearFrom,
		}

		if row.YearTo.Valid {
			entry.YearTo = &row.YearTo.Int32
		}

		lineage = append(lineage, entry)
	}

	return ConstructorSummary{
		ID:            summary.ID,
		Name:          summary.Name,
		FullName:      summary.FullName,
		Country:       summary.Country,
		CountryCode:   summary.CountryCode,
		Color:         summary.Color,
		Starts:        summary.Starts,
		Wins:          summary.Wins,
		Podiums:       summary.Podiums,
		Poles:         summary.Poles,
		Championships: summary.Championships,
		FirstYear:     year(summary.FirstRaceDate),
		LastYear:      year(summary.LastRaceDate),
		IsActive:      summary.IsActive,
		Lineage:       lineage,
		Seasons:       seasons,
	}, nil
}

type seasonEngine struct {
	season int32
	engine string
}

func year(d pgtype.Date) *int32 {
	if !d.Valid {
		return nil
	}
	y := int32(d.Time.Year())
	return &y
}
