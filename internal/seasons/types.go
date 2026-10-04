package seasons

import "github.com/jackc/pgx/v5/pgtype"

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
	Position      pgtype.Int4  `json:"position"`
	PositionLabel string       `json:"positionLabel"`
	Points        float64      `json:"points"`
	ID            string       `json:"id"`
	Code          string       `json:"code"`
	Name          string       `json:"name"`
	Country       string       `json:"country"`
	CountryCode   string       `json:"countryCode"`
	Constructor   *Constructor `json:"constructor"`
	CarNumber     pgtype.Int4  `json:"carNumber"`
	Wins          int32        `json:"wins"`
	Podiums       int32        `json:"podiums"`
	Poles         int32        `json:"poles"`
}

type ConstructorStanding struct {
	Position      pgtype.Int4 `json:"position"`
	PositionLabel string      `json:"positionLabel"`
	Points        float64     `json:"points"`
	ID            string      `json:"id"`
	EngineID      string      `json:"engineId"`
	Name          string      `json:"name"`
	Color         string      `json:"color"`
	CountryCode   string      `json:"countryCode"`
}

type ProgressionDataRow map[string]float64

type ProgressionSeries struct {
	Name  string `json:"name"`
	Color string `json:"color,omitempty"`
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

type calendarCircuit struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type calendarWinner struct {
	ID          string       `json:"id"`
	Name        string       `json:"name"`
	Code        string       `json:"code"`
	Constructor *Constructor `json:"constructor"`
}

type CalendarEntry struct {
	RaceID    int32           `json:"raceId"`
	Round     int32           `json:"round"`
	Name      string          `json:"name"`
	Code      *string         `json:"code"`
	Date      pgtype.Date     `json:"date"`
	Circuit   calendarCircuit `json:"circuit"`
	Completed bool            `json:"completed"`
	Winner    *calendarWinner `json:"winner"`
}

type CalendarResponse struct {
	Races           []CalendarEntry `json:"races"`
	RoundsCompleted int             `json:"roundsCompleted"`
	TotalRounds     int             `json:"totalRounds"`
}
