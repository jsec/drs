package circuits

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/jsec/drs/internal/database"
)

type circuitQueries interface {
	ListCircuits(context.Context) ([]database.ListCircuitsRow, error)
	GetCircuitInfo(context.Context, string) (database.GetCircuitInfoRow, error)
	GetRacesByCircuitId(context.Context, string) ([]database.GetRacesByCircuitIdRow, error)
}

type Service struct {
	queries circuitQueries
}

func NewService(queries circuitQueries) *Service {
	return &Service{
		queries: queries,
	}
}

func (s *Service) ListCircuits(ctx context.Context) ([]ListCircuitsResponse, error) {
	rows, err := s.queries.ListCircuits(ctx)
	if err != nil {
		return nil, fmt.Errorf("listing circuits: %w", err)
	}

	out := make([]ListCircuitsResponse, 0, len(rows))

	for _, row := range rows {
		out = append(out, ListCircuitsResponse{
			CircuitID:     row.CircuitID,
			Name:          row.Name,
			Country:       row.Country,
			FirstRaceYear: year(row.FirstRaceDate),
			LastRaceYear:  year(row.LastRaceDate),
			Location:      row.Location,
			RaceCount:     int(row.RaceCount),
		})
	}

	return out, nil
}

func (s *Service) GetCircuitSummary(ctx context.Context, circuitID string) (CircuitSummaryResponse, error) {
	circuit, err := s.queries.GetCircuitInfo(ctx, circuitID)
	if err != nil {
		return CircuitSummaryResponse{}, fmt.Errorf("getting circuit info: %w", err)
	}

	raceList, err := s.queries.GetRacesByCircuitId(ctx, circuitID)
	if err != nil {
		return CircuitSummaryResponse{}, fmt.Errorf("getting circuit races: %w", err)
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

	previousNames := circuit.PreviousNames
	if previousNames == nil {
		previousNames = []string{}
	}

	return CircuitSummaryResponse{
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
		PreviousNames:   previousNames,
		RaceCount:       int(circuit.RaceCount),
		Turns:           int(circuit.Turns),
		Races:           races,
	}, nil
}

func year(d pgtype.Date) *int32 {
	if !d.Valid {
		return nil
	}
	y := int32(d.Time.Year())
	return &y
}
