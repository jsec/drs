package drivers

import "github.com/jsec/drs/internal/dbtypes"

type constructor struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}
type driverSeasonSummary struct {
	Season      int32       `json:"season"`
	Constructor constructor `json:"constructor"`
	Starts      int32       `json:"starts"`
	Wins        int32       `json:"wins"`
	Podiums     int32       `json:"podiums"`
	Poles       int32       `json:"poles"`
	Points      int32       `json:"points"`
	Position    string      `json:"position"`
}

type DriverSummary struct {
	Code             string                `json:"code"`
	Name             string                `json:"name"`
	Country          string                `json:"country"`
	CountryCode      string                `json:"countryCode"`
	Starts           int32                 `json:"starts"`
	Wins             int32                 `json:"wins"`
	Podiums          int32                 `json:"podiums"`
	Poles            int32                 `json:"poles"`
	Championships    int32                 `json:"championships"`
	IsActive         bool                  `json:"isActive"`
	ConstructorColor string                `json:"constructorColor"`
	FirstYear        *int32                `json:"firstYear"`
	LastYear         *int32                `json:"lastYear"`
	Seasons          []driverSeasonSummary `json:"seasons"`
}

type DriverShortSummary struct {
	ID               string `json:"id"`
	Code             string `json:"code"`
	Name             string `json:"name"`
	Starts           int32  `json:"starts"`
	Wins             int32  `json:"wins"`
	Podiums          int32  `json:"podiums"`
	Poles            int32  `json:"poles"`
	Championships    int32  `json:"championships"`
	IsActive         bool   `json:"isActive"`
	ConstructorColor string `json:"constructorColor"`
	FirstYear        *int32 `json:"firstYear"`
	LastYear         *int32 `json:"lastYear"`
}

type sprintResult struct {
	PositionLabel string  `json:"positionLabel"`
	Points        float64 `json:"points"`
}

type seasonRace struct {
	Round          int32         `json:"round"`
	Name           string        `json:"name"`
	Grid           dbtypes.Int4  `json:"grid"`
	Position       dbtypes.Int4  `json:"position"`
	PositionLabel  string        `json:"positionLabel"`
	StatusCategory string        `json:"statusCategory"`
	Points         float64       `json:"points"`
	Sprint         *sprintResult `json:"sprint"`
}

type progressionPoint struct {
	Round  int32   `json:"round"`
	Points float64 `json:"points"`
}

type DriverSeason struct {
	Code        string             `json:"code"`
	Name        string             `json:"name"`
	Country     string             `json:"country"`
	CountryCode string             `json:"countryCode"`
	Constructor constructor        `json:"constructor"`
	CarNumber   dbtypes.Int4       `json:"carNumber"`
	Points      float64            `json:"points"`
	Position    string             `json:"position"`
	Wins        int32              `json:"wins"`
	Podiums     int32              `json:"podiums"`
	Poles       int32              `json:"poles"`
	Progression []progressionPoint `json:"progression"`
	Races       []seasonRace       `json:"races"`
}

type pitStop struct {
	Stop       int32        `json:"stop"`
	Lap        int32        `json:"lap"`
	Duration   string       `json:"duration"`
	DurationMs dbtypes.Int4 `json:"durationMs"`
}

type DriverRace struct {
	RaceName                string       `json:"raceName"`
	Code                    string       `json:"code"`
	Name                    string       `json:"name"`
	Constructor             constructor  `json:"constructor"`
	CarNumber               dbtypes.Int4 `json:"carNumber"`
	PositionLabel           string       `json:"positionLabel"`
	Position                dbtypes.Int4 `json:"position"`
	Grid                    dbtypes.Int4 `json:"grid"`
	PositionsGained         dbtypes.Int4 `json:"positionsGained"`
	Time                    string       `json:"time"`
	Gap                     string       `json:"gap"`
	StatusCategory          string       `json:"statusCategory"`
	LapsCompleted           dbtypes.Int4 `json:"lapsCompleted"`
	Points                  float64      `json:"points"`
	PitStopCount            dbtypes.Int4 `json:"pitStopCount"`
	TimePenalty             string       `json:"timePenalty"`
	IsWin                   bool         `json:"isWin"`
	IsPole                  bool         `json:"isPole"`
	IsFastestLap            bool         `json:"isFastestLap"`
	IsDriverOfTheDay        bool         `json:"isDriverOfTheDay"`
	IsGrandSlam             bool         `json:"isGrandSlam"`
	QualifyingPositionLabel string       `json:"qualifyingPositionLabel"`
	BestQualifyingTime      string       `json:"bestQualifyingTime"`
	FastestLapRank          dbtypes.Int4 `json:"fastestLapRank"`
	HasSprint               bool         `json:"hasSprint"`
	PitStops                []pitStop    `json:"pitStops"`
}
