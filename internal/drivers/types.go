package drivers

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
	Code          string                `json:"code"`
	Name          string                `json:"name"`
	Country       string                `json:"country"`
	CountryCode   string                `json:"countryCode"`
	Starts        int32                 `json:"starts"`
	Wins          int32                 `json:"wins"`
	Podiums       int32                 `json:"podiums"`
	Poles         int32                 `json:"poles"`
	Championships int32                 `json:"championships"`
	Seasons       []driverSeasonSummary `json:"seasons"`
}

type DriverShortSummary struct {
	Code          string `json:"code"`
	Name          string `json:"name"`
	Starts        int32  `json:"starts"`
	Wins          int32  `json:"wins"`
	Podiums       int32  `json:"podiums"`
	Poles         int32  `json:"poles"`
	Championships int32  `json:"championships"`
	FirstYear     *int32 `json:"firstYear"`
	LastYear      *int32 `json:"LastYear"`
}
