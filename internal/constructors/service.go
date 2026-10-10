package constructors

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"

	"github.com/jsec/drs/internal/database"
)

func ListConstructors(ctx context.Context, queries database.Querier) ([]ConstructorResponse, error) {
	rows, err := queries.ListConstructors(ctx)
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

func GetSummary(ctx context.Context, queries database.Querier, constructorID string) (ConstructorSummary, error) {
	summary, err := queries.GetConstructorSummary(ctx, constructorID)
	if err != nil {
		return ConstructorSummary{}, fmt.Errorf("getting constructor summary: %w", err)
	}

	seasonRows, err := queries.ListConstructorSeasons(ctx, constructorID)
	if err != nil {
		return ConstructorSummary{}, fmt.Errorf("listing constructor seasons: %w", err)
	}

	driverRows, err := queries.ListConstructorSeasonDrivers(ctx, constructorID)
	if err != nil {
		return ConstructorSummary{}, fmt.Errorf("listing constructor season drivers: %w", err)
	}

	lineageRows, err := queries.ListConstructorLineage(ctx, constructorID)
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

		seasons = append(seasons, ConstructorSeason{
			Season:     row.Season,
			Engine:     row.EngineManufacturerName,
			Position:   row.FinalPositionText.String,
			Points:     row.FinalPoints,
			IsChampion: row.ChampionshipWon,
			Starts:     row.Starts,
			Wins:       row.Wins,
			Podiums:    row.Podiums,
			Poles:      row.Poles,
			Drivers:    seasonDrivers,
		})
	}

	lineage := make([]LineageEntry, 0, len(lineageRows))
	for _, row := range lineageRows {
		lineage = append(lineage, LineageEntry{
			Order:    row.PositionDisplayOrder,
			ID:       row.OtherConstructorID,
			Name:     row.OtherConstructorName,
			YearFrom: row.YearFrom,
			YearTo:   row.YearTo,
		})
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
		FirstYear:     summary.FirstYear,
		LastYear:      summary.LastYear,
		IsActive:      summary.IsActive,
		Lineage:       lineage,
		Seasons:       seasons,
	}, nil
}

func GetSeason(ctx context.Context, queries database.Querier, constructorID string, season int32) (SeasonDetail, error) {
	entryRows, err := queries.ListConstructorSeasonEntries(ctx, season, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("listing constructor season entries: %w", err)
	}
	if len(entryRows) == 0 {
		return SeasonDetail{}, fmt.Errorf("listing constructor season entries: %w", pgx.ErrNoRows)
	}

	summary, err := queries.GetConstructorSummary(ctx, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("getting constructor summary: %w", err)
	}

	progressionRows, err := queries.ListConstructorSeasonProgression(ctx, season, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("listing constructor season progression: %w", err)
	}

	driverRows, err := queries.ListConstructorSeasonDriverSummaries(ctx, season, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("listing constructor season drivers: %w", err)
	}

	resultRows, err := queries.ListConstructorSeasonResults(ctx, season, constructorID)
	if err != nil {
		return SeasonDetail{}, fmt.Errorf("listing constructor season results: %w", err)
	}

	detail := SeasonDetail{
		ID:          summary.ID,
		Name:        summary.Name,
		CountryCode: summary.CountryCode,
		Color:       summary.Color,
		Position:    entryRows[0].FinalPositionText.String,
		Entries:     make([]SeasonEntry, 0, len(entryRows)),
		Drivers:     make([]SeasonDriverSummary, 0, len(driverRows)),
		Progression: make([]ProgressionPoint, 0, len(progressionRows)),
		Results:     make([]SeasonResult, 0, len(resultRows)),
	}

	for _, row := range entryRows {
		if row.FinalPoints.Valid {
			detail.Points.Float64 += row.FinalPoints.Float64
			detail.Points.Valid = true
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
