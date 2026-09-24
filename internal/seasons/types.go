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
	Drivers              []DriverStanding      `json:"drivers"`
	Constructors         []ConstructorStanding `json:"constructors"`
	MaxConstructorPoints float64               `json:"maxConstructorPoints"`
}

type ProgressionDataRow map[string]float64

type ProgressionSeries struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}

type Progression struct {
	Data   []ProgressionDataRow `json:"data"`
	Series []ProgressionSeries  `json:"series"`
}

type SeasonOverviewResponse struct {
	Drivers              []DriverStanding      `json:"drivers"`
	Constructors         []ConstructorStanding `json:"constructors"`
	Leader               *DriverStanding       `json:"leader"`
	RunnerUp             *DriverStanding       `json:"runnerUp"`
	MaxConstructorPoints float64               `json:"maxConstructorPoints"`
	Progression          Progression           `json:"progression"`
}
