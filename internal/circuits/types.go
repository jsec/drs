package circuits

import "github.com/jsec/drs/internal/dbtypes"

type ListCircuitsResponse struct {
	CircuitID     string `json:"circuit_id"`
	Name          string `json:"name"`
	Country       string `json:"country"`
	FirstRaceYear *int32 `json:"first_race_year,omitempty"`
	LastRaceYear  *int32 `json:"last_race_year,omitempty"`
	Location      string `json:"location"`
	RaceCount     int    `json:"race_count"`
}

type CircuitRaceSummary struct {
	RaceID dbtypes.Int4 `json:"raceId"`
	Date   dbtypes.Date `json:"date,omitempty"`
	Name   string       `json:"name"`
}

type CircuitRace struct {
	RaceID     int          `json:"raceId"`
	Date       dbtypes.Date `json:"date"`
	LayoutID   string       `json:"layoutId"`
	Name       string       `json:"name"`
	WinnerID   string       `json:"winnerId"`
	WinnerName string       `json:"winnerName"`
}

type CircuitSummaryResponse struct {
	CircuitID       string             `json:"circuitId"`
	Name            string             `json:"name"`
	CircuitType     string             `json:"circuitType"`
	Country         string             `json:"country"`
	CountryID       string             `json:"firstRaceId"`
	FirstRace       CircuitRaceSummary `json:"firstRace"`
	LastRace        CircuitRaceSummary `json:"lastRace"`
	CurrentLayoutId string             `json:"layoutId"`
	PreviousNames   []string           `json:"previousNames"`
	RaceCount       int                `json:"raceCount"`
	Turns           int                `json:"turns"`
	Races           []CircuitRace      `json:"races"`
}
