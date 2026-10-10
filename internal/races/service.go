package races

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"

	"github.com/jsec/drs/internal/database"
)

func GetRaceDetail(ctx context.Context, queries database.Querier, season, round int32) (RaceDetailResponse, error) {
	race, err := getCompletedRace(ctx, queries, season, round)
	if err != nil {
		return RaceDetailResponse{}, err
	}

	rows, err := queries.ListRaceResults(ctx, race.RaceID)
	if err != nil {
		return RaceDetailResponse{}, fmt.Errorf("listing race results: %w", err)
	}

	results := make([]Result, 0, len(rows))

	for _, row := range rows {
		results = append(results, toResult(row))
	}

	sprintRows, err := queries.ListSprintResults(ctx, race.RaceID)
	if err != nil {
		return RaceDetailResponse{}, fmt.Errorf("listing sprint results: %w", err)
	}

	sprint := make([]Result, 0, len(sprintRows))

	for _, row := range sprintRows {
		sprint = append(sprint, toResult(database.ListRaceResultsRow(row)))
	}

	qualifyingRows, err := queries.ListQualifyingResults(ctx, race.RaceID)
	if err != nil {
		return RaceDetailResponse{}, fmt.Errorf("listing qualifying results: %w", err)
	}

	qualifying := make([]QualifyingResult, 0, len(qualifyingRows))

	for _, row := range qualifyingRows {
		qualifying = append(qualifying, QualifyingResult{
			Position:      row.Position,
			PositionLabel: row.PositionLabel,
			Driver: Driver{
				ID:        row.DriverID,
				Code:      row.Code,
				Name:      row.Name,
				ShortName: row.LastName,
			},
			Constructor: Constructor{
				ID:    row.ConstructorID,
				Name:  row.ConstructorName,
				Color: row.ConstructorColor.String,
			},
			Q1:   row.Q1,
			Q2:   row.Q2,
			Q3:   row.Q3,
			Time: row.BestQualifyingTime,
			Gap:  row.Gap,
		})
	}

	resp := RaceDetailResponse{
		RaceID:  race.RaceID,
		Season:  race.Season,
		Round:   race.RaceRound,
		Name:    race.RaceName,
		Date:    race.RaceDate,
		Circuit: race.CircuitName,
		Laps:    race.RaceLaps,
		Winner: DriverRef{
			ID:   race.WinnerDriverID.String,
			Code: race.WinnerDriverCode.String,
		},
		Results:    results,
		Qualifying: qualifying,
		Sprint:     sprint,
	}

	if race.PoleDriverID.Valid {
		resp.Pole = &DriverRef{
			ID:   race.PoleDriverID.String,
			Code: race.PoleCode.String,
		}
	}

	if race.FastestLapDriverID.Valid {
		resp.FastestLap = &FastestLap{
			Driver: DriverRef{
				ID:   race.FastestLapDriverID.String,
				Code: race.FastestLapCode.String,
			},
			Time: race.FastestLapTime.String,
		}
	}

	return resp, nil
}

func GetRaceLaps(ctx context.Context, queries database.Querier, season, round int32, session string) (RaceLapsResponse, error) {
	race, err := getCompletedRace(ctx, queries, season, round)
	if err != nil {
		return RaceLapsResponse{}, err
	}

	results, err := queries.ListRaceResults(ctx, race.RaceID)
	if err != nil {
		return RaceLapsResponse{}, fmt.Errorf("listing race results: %w", err)
	}

	lapRows, err := queries.ListRaceLapTimes(ctx, race.RaceID, session)
	if err != nil {
		return RaceLapsResponse{}, fmt.Errorf("listing race lap times: %w", err)
	}

	lapsByDriver := make(map[string][]Lap)

	for _, row := range lapRows {
		lapsByDriver[row.DriverID] = append(lapsByDriver[row.DriverID], Lap{
			Lap:      row.LapNumber,
			Position: row.Position,
			TimeMs:   row.LapTimeMs,
		})
	}

	drivers := make([]DriverLaps, 0, len(results))

	for _, result := range results {
		laps := lapsByDriver[result.DriverID]
		if laps == nil {
			laps = []Lap{}
		}

		drivers = append(drivers, DriverLaps{
			Driver: DriverRef{
				ID:   result.DriverID,
				Code: result.Code,
			},
			Color: result.ConstructorColor.String,
			Laps:  laps,
		})
	}

	return RaceLapsResponse{Drivers: drivers}, nil
}

func toResult(row database.ListRaceResultsRow) Result {
	return Result{
		Position:      row.Position,
		PositionLabel: row.PositionLabel,
		Driver: Driver{
			ID:        row.DriverID,
			Code:      row.Code,
			Name:      row.Name,
			ShortName: row.LastName,
		},
		Constructor: Constructor{
			ID:    row.ConstructorID,
			Name:  row.ConstructorName,
			Color: row.ConstructorColor.String,
		},
		Grid:   row.GridPosition,
		Time:   row.ElapsedTime,
		Gap:    row.Gap,
		Status: row.Status,
		Points: row.Points,
	}
}

func getCompletedRace(ctx context.Context, queries database.Querier, season, round int32) (database.GetRaceDetailRow, error) {
	race, err := queries.GetRaceDetail(ctx, season, round)
	if err != nil {
		return database.GetRaceDetailRow{}, fmt.Errorf("getting race detail: %w", err)
	}
	if !race.WinnerDriverID.Valid {
		return database.GetRaceDetailRow{}, fmt.Errorf("race not completed: %w", pgx.ErrNoRows)
	}

	return race, nil
}
