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
	Order    int32  `json:"order"`
	ID       string `json:"id"`
	Name     string `json:"name"`
	YearFrom int32  `json:"yearFrom"`
	YearTo   *int32 `json:"yearTo"`
}

type SeasonDriver struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ConstructorSeason struct {
	Season     int32          `json:"season"`
	Engine     string         `json:"engine"`
	Position   string         `json:"position"`
	Points     *float64       `json:"points"`
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
	FirstYear     *int32              `json:"firstYear"`
	LastYear      *int32              `json:"lastYear"`
	IsActive      bool                `json:"isActive"`
	Lineage       []LineageEntry      `json:"lineage"`
	Seasons       []ConstructorSeason `json:"seasons"`
}
