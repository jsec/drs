package circuits

import "github.com/jackc/pgx/v5/pgtype"

type CircuitRaceSummary struct {
	Date pgtype.Date `json:"date"`
	Name string      `json:"name"`
}

type CircuitRace struct {
	RaceID     int32       `json:"raceId"`
	Date       pgtype.Date `json:"date"`
	LayoutID   string      `json:"layoutId"`
	Name       string      `json:"name"`
	WinnerName string      `json:"winnerName"`
}

type CircuitSummaryResponse struct {
	CircuitID       string             `json:"circuitId"`
	Name            string             `json:"name"`
	Country         string             `json:"country"`
	CountryCode     string             `json:"countryCode"`
	FirstRace       CircuitRaceSummary `json:"firstRace"`
	LastRace        CircuitRaceSummary `json:"lastRace"`
	CurrentLayoutId string             `json:"layoutId"`
	RaceCount       int32              `json:"raceCount"`
	Turns           int32              `json:"turns"`
	Races           []CircuitRace      `json:"races"`
}
