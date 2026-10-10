package circuits

import "github.com/jackc/pgx/v5/pgtype"

type ListCircuitsResponse struct {
	CircuitID     string      `json:"circuitId"`
	Name          string      `json:"name"`
	Country       string      `json:"country"`
	FirstRaceYear pgtype.Int4 `json:"firstRaceYear"`
	LastRaceYear  pgtype.Int4 `json:"lastRaceYear"`
	Location      string      `json:"location"`
	RaceCount     int32       `json:"raceCount"`
}

type CircuitRaceSummary struct {
	RaceID pgtype.Int4 `json:"raceId"`
	Date   pgtype.Date `json:"date"`
	Name   string      `json:"name"`
}

type CircuitRace struct {
	RaceID     int32       `json:"raceId"`
	Date       pgtype.Date `json:"date"`
	LayoutID   string      `json:"layoutId"`
	Name       string      `json:"name"`
	WinnerID   string      `json:"winnerId"`
	WinnerName string      `json:"winnerName"`
}

type CircuitSummaryResponse struct {
	CircuitID       string             `json:"circuitId"`
	Name            string             `json:"name"`
	CircuitType     string             `json:"circuitType"`
	Country         string             `json:"country"`
	CountryCode     string             `json:"countryCode"`
	CountryID       string             `json:"countryId"`
	FirstRace       CircuitRaceSummary `json:"firstRace"`
	LastRace        CircuitRaceSummary `json:"lastRace"`
	CurrentLayoutId string             `json:"layoutId"`
	PreviousNames   []string           `json:"previousNames"`
	RaceCount       int32              `json:"raceCount"`
	Turns           int32              `json:"turns"`
	Races           []CircuitRace      `json:"races"`
}
