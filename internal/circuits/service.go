package circuits

import (
	"context"
	"fmt"

	"github.com/jsec/drs/internal/database"
)

func GetCircuitSummary(ctx context.Context, queries database.Querier, circuitID string) (CircuitSummaryResponse, error) {
	circuit, err := queries.GetCircuitInfo(ctx, circuitID)
	if err != nil {
		return CircuitSummaryResponse{}, fmt.Errorf("getting circuit info: %w", err)
	}

	raceList, err := queries.GetRacesByCircuitId(ctx, circuitID)
	if err != nil {
		return CircuitSummaryResponse{}, fmt.Errorf("getting circuit races: %w", err)
	}

	races := make([]CircuitRace, 0, len(raceList))

	for _, race := range raceList {
		races = append(races, CircuitRace{
			RaceID:     race.RaceID,
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
		RaceCount:       circuit.RaceCount,
		Turns:           circuit.Turns,
		Races:           races,
	}, nil
}
