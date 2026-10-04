package constructors

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jsec/drs/internal/database"
)

type constructorsQueries interface {
	ListConstructors(ctx context.Context) ([]database.ListConstructorsRow, error)
	GetConstructorSummary(ctx context.Context, constructorID string) (database.GetConstructorSummaryRow, error)
	ListConstructorSeasons(ctx context.Context, constructorID string) ([]database.ListConstructorSeasonsRow, error)
	ListConstructorSeasonDrivers(ctx context.Context, constructorID string) ([]database.ListConstructorSeasonDriversRow, error)
	ListConstructorLineage(ctx context.Context, constructorID string) ([]database.ListConstructorLineageRow, error)
	ListConstructorSeasonEntries(ctx context.Context, season int32, constructorID string) ([]database.ListConstructorSeasonEntriesRow, error)
	ListConstructorSeasonProgression(ctx context.Context, season int32, constructorID string) ([]database.ListConstructorSeasonProgressionRow, error)
	ListConstructorSeasonDriverSummaries(ctx context.Context, season int32, constructorID string) ([]database.ListConstructorSeasonDriverSummariesRow, error)
	ListConstructorSeasonResults(ctx context.Context, season int32, constructorID string) ([]database.ListConstructorSeasonResultsRow, error)
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

func (s *Service) GetSeason(ctx context.Context, constructorID string, season int32) (SeasonDetail, error) {
	entryRows, err := s.queries.ListConstructorSeasonEntries(ctx, season, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("listing constructor season entries: %w", err)
	}
	if len(entryRows) == 0 {
		return SeasonDetail{}, fmt.Errorf("listing constructor season entries: %w", pgx.ErrNoRows)
	}

	summary, err := s.queries.GetConstructorSummary(ctx, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("getting constructor summary: %w", err)
	}

	progressionRows, err := s.queries.ListConstructorSeasonProgression(ctx, season, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("listing constructor season progression: %w", err)
	}

	driverRows, err := s.queries.ListConstructorSeasonDriverSummaries(ctx, season, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("listing constructor season drivers: %w", err)
	}

	resultRows, err := s.queries.ListConstructorSeasonResults(ctx, season, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("listing constructor season results: %w", err)
	}

	best := entryRows[0]
	detail := SeasonDetail{
		ID:          summary.ID,
		Name:        summary.Name,
		CountryCode: summary.CountryCode,
		Color:       summary.Color,
		Position:    best.FinalPositionText.String,
		Entries:     make([]SeasonEntry, 0, len(entryRows)),
		Drivers:     make([]SeasonDriverSummary, 0, len(driverRows)),
		Progression: make([]ProgressionPoint, 0, len(progressionRows)),
		Results:     make([]SeasonResult, 0, len(resultRows)),
	}

	for _, row := range entryRows {
		if row.FinalPoints.Valid {
			points := row.FinalPoints.Float64
			if detail.Points != nil {
				points += *detail.Points
			}
			detail.Points = &points
		}
		detail.IsChampion = detail.IsChampion || row.ChampionshipWon
		detail.Wins += row.Wins
		detail.Podiums += row.Podiums
		detail.Poles += row.Poles
		detail.DNFs += row.Dnfs
		detail.Entries = append(detail.Entries, SeasonEntry{
			Engine:   row.EngineName,
			Position: row.FinalPositionText.String,
		})
	}

	for _, row := range driverRows {
		detail.Drivers = append(detail.Drivers, SeasonDriverSummary{
			ID:      row.DriverID,
			Code:    row.DriverCode,
			Name:    row.DriverName,
			Starts:  row.Starts,
			Wins:    row.Wins,
			Podiums: row.Podiums,
			Points:  row.Points,
		})
	}

	for _, row := range progressionRows {
		detail.Progression = append(detail.Progression, ProgressionPoint{
			Round:  row.RaceRound,
			Points: row.Points,
		})
	}

	for _, row := range resultRows {
		result := SeasonResult{
			Round:          row.RaceRound,
			RaceName:       row.RaceName,
			FinishOrder:    row.FinishOrder,
			DriverID:       row.DriverID,
			DriverCode:     row.DriverCode,
			PositionLabel:  row.PositionLabel,
			StatusCategory: row.StatusCategory,
			Points:         row.Points,
		}

		if row.SprintPositionLabel.Valid {
			result.Sprint = &SprintResult{
				PositionLabel: row.SprintPositionLabel.String,
				Points:        row.SprintPoints,
			}
		}

		detail.Results = append(detail.Results, result)
	}

	return detail, nil
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
