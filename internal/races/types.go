package races

import "github.com/jackc/pgx/v5/pgtype"

type DriverRef struct {
	ID   string `json:"id"`
	Code string `json:"code"`
}

type FastestLap struct {
	Driver DriverRef `json:"driver"`
	Time   string    `json:"time"`
}

type Driver struct {
	ID        string `json:"id"`
	Code      string `json:"code"`
	Name      string `json:"name"`
	ShortName string `json:"shortName"`
}

type Constructor struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

type Result struct {
	Position      int32       `json:"position"`
	PositionLabel string      `json:"positionLabel"`
	Driver        Driver      `json:"driver"`
	Constructor   Constructor `json:"constructor"`
	Grid          pgtype.Int4 `json:"grid"`
	Time          *string     `json:"time"`
	Gap           *string     `json:"gap"`
	Status        *string     `json:"status"`
	Points        float64     `json:"points"`
}

type RaceDetailResponse struct {
	RaceID     int32       `json:"raceId"`
	Season     int32       `json:"season"`
	Round      int32       `json:"round"`
	Name       string      `json:"name"`
	Date       pgtype.Date `json:"date"`
	Circuit    string      `json:"circuit"`
	Laps       int32       `json:"laps"`
	Pole       *DriverRef  `json:"pole"`
	Winner     DriverRef   `json:"winner"`
	FastestLap *FastestLap `json:"fastestLap"`
	Results    []Result    `json:"results"`
}

type Lap struct {
	Lap      int32       `json:"lap"`
	Position pgtype.Int4 `json:"position"`
	TimeMs   int32       `json:"timeMs"`
}

type DriverLaps struct {
	Driver DriverRef `json:"driver"`
	Color  string    `json:"color"`
	Laps   []Lap     `json:"laps"`
}

type RaceLapsResponse struct {
	Drivers []DriverLaps `json:"drivers"`
}
