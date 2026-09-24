package seasons

import "github.com/jsec/drs/internal/dbtypes"

type SeasonResponse struct {
	Season           int32        `json:"season"`
	RaceCount        int32        `json:"raceCount"`
	ConstructorCount int32        `json:"constructorCount"`
	Wdc              WDC          `json:"wdc"`
	Wcc              *Constructor `json:"wcc"`
}

type WDC struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	CountryCode string `json:"countryCode"`
}

type Constructor struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

type DriverStanding struct {
	Position      dbtypes.Int4 `json:"position"`
	PositionLabel string       `json:"positionLabel"`
	Points        float64      `json:"points"`
	ID            string       `json:"id"`
	Code          string       `json:"code"`
	Name          string       `json:"name"`
	Country       string       `json:"country"`
	CountryCode   string       `json:"countryCode"`
	Constructor   *Constructor `json:"constructor"`
	CarNumber     dbtypes.Int4 `json:"carNumber"`
	Wins          int32        `json:"wins"`
	Podiums       int32        `json:"podiums"`
	Poles         int32        `json:"poles"`
}

type ConstructorStanding struct {
	Position      dbtypes.Int4 `json:"position"`
	PositionLabel string       `json:"positionLabel"`
	Points        float64      `json:"points"`
	ID            string       `json:"id"`
	Name          string       `json:"name"`
	Color         string       `json:"color"`
}

type StandingsResponse struct {
	Drivers      []DriverStanding      `json:"drivers"`
	Constructors []ConstructorStanding `json:"constructors"`
}

type DriverProgression struct {
	RaceRound int32   `json:"raceRound"`
	DriverID  string  `json:"driverId"`
	Code      string  `json:"code"`
	Points    float64 `json:"points"`
}
