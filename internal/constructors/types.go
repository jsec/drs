package constructors

import "github.com/jackc/pgx/v5/pgtype"

type ConstructorResponse struct {
	ID            string      `json:"id"`
	Name          string      `json:"name"`
	Color         string      `json:"color"`
	FirstRaceDate pgtype.Date `json:"firstRaceDate"`
	LastRaceDate  pgtype.Date `json:"lastRaceDate"`
	Championships int32       `json:"championships"`
	Wins          int32       `json:"wins"`
	Podiums       int32       `json:"podiums"`
}

type LineageEntry struct {
	Order    int32       `json:"order"`
	ID       string      `json:"id"`
	Name     string      `json:"name"`
	YearFrom int32       `json:"yearFrom"`
	YearTo   pgtype.Int4 `json:"yearTo"`
}

type SeasonDriver struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ConstructorSeason struct {
	Season     int32          `json:"season"`
	Engine     string         `json:"engine"`
	Position   string         `json:"position"`
	Points     pgtype.Float8  `json:"points"`
	IsChampion bool           `json:"isChampion"`
	Starts     int32          `json:"starts"`
	Wins       int32          `json:"wins"`
	Podiums    int32          `json:"podiums"`
	Poles      int32          `json:"poles"`
	Drivers    []SeasonDriver `json:"drivers"`
}

type ConstructorSummary struct {
	ID            string              `json:"id"`
	Name          string              `json:"name"`
	FullName      string              `json:"fullName"`
	Country       string              `json:"country"`
	CountryCode   string              `json:"countryCode"`
	Color         string              `json:"color"`
	Starts        int32               `json:"starts"`
	Wins          int32               `json:"wins"`
	Podiums       int32               `json:"podiums"`
	Poles         int32               `json:"poles"`
	Championships int32               `json:"championships"`
	FirstYear     pgtype.Int4         `json:"firstYear"`
	LastYear      pgtype.Int4         `json:"lastYear"`
	IsActive      bool                `json:"isActive"`
	Lineage       []LineageEntry      `json:"lineage"`
	Seasons       []ConstructorSeason `json:"seasons"`
}

type SeasonEntry struct {
	Engine   string `json:"engine"`
	Position string `json:"position"`
}

type SeasonDriverSummary struct {
	ID      string  `json:"id"`
	Code    string  `json:"code"`
	Name    string  `json:"name"`
	Starts  int32   `json:"starts"`
	Wins    int32   `json:"wins"`
	Podiums int32   `json:"podiums"`
	Points  float64 `json:"points"`
}

type ProgressionPoint struct {
	Round  int32   `json:"round"`
	Points float64 `json:"points"`
}

type SprintResult struct {
	PositionLabel string  `json:"positionLabel"`
	Points        float64 `json:"points"`
}

type SeasonResult struct {
	Round          int32         `json:"round"`
	RaceName       string        `json:"raceName"`
	FinishOrder    int32         `json:"finishOrder"`
	DriverID       string        `json:"driverId"`
	DriverCode     string        `json:"driverCode"`
	PositionLabel  string        `json:"positionLabel"`
	StatusCategory string        `json:"statusCategory"`
	Points         float64       `json:"points"`
	Sprint         *SprintResult `json:"sprint"`
}

type SeasonDetail struct {
	ID          string                `json:"id"`
	Name        string                `json:"name"`
	CountryCode string                `json:"countryCode"`
	Color       string                `json:"color"`
	Position    string                `json:"position"`
	IsChampion  bool                  `json:"isChampion"`
	Points      pgtype.Float8         `json:"points"`
	Wins        int32                 `json:"wins"`
	Podiums     int32                 `json:"podiums"`
	Poles       int32                 `json:"poles"`
	DNFs        int32                 `json:"dnfs"`
	Entries     []SeasonEntry         `json:"entries"`
	Drivers     []SeasonDriverSummary `json:"drivers"`
	Progression []ProgressionPoint    `json:"progression"`
	Results     []SeasonResult        `json:"results"`
}
