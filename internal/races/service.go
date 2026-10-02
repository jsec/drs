package races

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jsec/drs/internal/database"
)

var ErrNotFound = errors.New("race not found")

type raceQueries interface {
	GetRaceDetail(ctx context.Context, arg database.GetRaceDetailParams) (database.GetRaceDetailRow, error)
	ListRaceResults(ctx context.Context, raceID int32) ([]database.ListRaceResultsRow, error)
	ListRaceLapTimes(ctx context.Context, arg database.ListRaceLapTimesParams) ([]database.ListRaceLapTimesRow, error)
}

type Service struct {
	queries raceQueries
}

func NewService(queries raceQueries) *Service {
	return &Service{
		queries: queries,
	}
}

func (s *Service) GetRaceDetail(ctx context.Context, season, round int32) (RaceDetailResponse, error) {
	race, err := s.getCompletedRace(ctx, season, round)
	if err != nil {
		return RaceDetailResponse{}, err
	}

	rows, err := s.queries.ListRaceResults(ctx, race.RaceID)
	if err != nil {
		return RaceDetailResponse{}, fmt.Errorf("listing race results: %w", err)
	}

	results := make([]Result, 0, len(rows))

	for _, row := range rows {
		results = append(results, Result{
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
			Time:   txtPointer(row.ElapsedTime),
			Gap:    txtPointer(row.Gap),
			Status: txtPointer(row.Status),
			Points: row.Points,
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
		Results: results,
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

func (s *Service) GetRaceLaps(ctx context.Context, season, round int32, session string) (RaceLapsResponse, error) {
	race, err := s.getCompletedRace(ctx, season, round)
	if err != nil {
		return RaceLapsResponse{}, err
	}

	results, err := s.queries.ListRaceResults(ctx, race.RaceID)
	if err != nil {
		return RaceLapsResponse{}, fmt.Errorf("listing race results: %w", err)
	}

	lapRows, err := s.queries.ListRaceLapTimes(ctx, database.ListRaceLapTimesParams{RaceID: race.RaceID, Session: session})
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

func (s *Service) getCompletedRace(ctx context.Context, season, round int32) (database.GetRaceDetailRow, error) {
	race, err := s.queries.GetRaceDetail(ctx, database.GetRaceDetailParams{Season: season, RaceRound: round})
	if errors.Is(err, pgx.ErrNoRows) {
		return database.GetRaceDetailRow{}, ErrNotFound
	}
	if err != nil {
		return database.GetRaceDetailRow{}, fmt.Errorf("getting race detail: %w", err)
	}
	if !race.WinnerDriverID.Valid {
		return database.GetRaceDetailRow{}, ErrNotFound
	}

	return race, nil
}

func txtPointer(t pgtype.Text) *string {
	if !t.Valid {
		return nil
	}
	return &t.String
}
