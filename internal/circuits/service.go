package circuits

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"

	"github.com/jsec/drs/internal/database"
)

var ErrNotFound = errors.New("circuit not found")

type Service struct {
	queries database.Querier
}

func NewService(queries database.Querier) *Service {
	return &Service{queries}
}

func (s *Service) ListCircuits(ctx context.Context) ([]ListCircuitsResponse, error) {
	rows, err := s.queries.ListCircuits(ctx)
	if err != nil {
		return nil, err
	}

	out := make([]ListCircuitsResponse, 0, len(rows))

	for _, row := range rows {
		out = append(out, ListCircuitsResponse{
			CircuitID:     row.CircuitID,
			Name:          row.Name,
			Country:       row.Country,
			FirstRaceYear: row.FirstRaceDate.Year(),
			LastRaceYear:  row.LastRaceDate.Year(),
			Location:      row.Location,
			RaceCount:     int(row.RaceCount),
		})
	}

	return out, nil
}

func (s *Service) GetCircuitSummary(ctx context.Context, circuitID string) (CircuitSummaryResponse, error) {
	circuit, err := s.queries.GetCircuitInfo(ctx, circuitID)
	if errors.Is(err, pgx.ErrNoRows) {
		return CircuitSummaryResponse{}, ErrNotFound
	}
	if err != nil {
		return CircuitSummaryResponse{}, err
	}

	raceList, err := s.queries.GetRacesByCircuitId(ctx, circuitID)
	if err != nil {
		return CircuitSummaryResponse{}, err
	}

	races := make([]CircuitRace, 0, len(raceList))

	for _, race := range raceList {
		races = append(races, CircuitRace{
			RaceID:     int(race.RaceID),
			Date:       race.RaceDate,
			LayoutID:   race.CircuitLayoutID,
			Name:       race.RaceOfficialName,
			WinnerID:   race.WinnerDriverID.String,
			WinnerName: race.WinnerDriverName.String,
		})
	}

	result := CircuitSummaryResponse{
		CircuitID:   circuit.CircuitID,
		Name:        circuit.Name,
		CircuitType: circuit.CircuitType,
		Country:     circuit.Country,
		CountryCode: circuit.CountryCode,
		CountryID:   circuit.CountryID,
		FirstRace: CircuitRaceSummary{
			RaceID: circuit.FirstRaceID,
			Date:   circuit.FirstRaceDate,
			Name:   circuit.FirstRaceName.String,
		},
		LastRace: CircuitRaceSummary{
			RaceID: circuit.LastRaceID,
			Date:   circuit.LastRaceDate,
			Name:   circuit.LastRaceName.String,
		},
		CurrentLayoutId: circuit.CurrentLayoutID.String,
		PreviousNames:   circuit.PreviousNames,
		RaceCount:       int(circuit.RaceCount),
		Turns:           int(circuit.Turns),
		Races:           races,
	}

	return result, nil
}
