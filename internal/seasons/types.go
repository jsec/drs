package seasons

type SeasonResponse struct {
	Season           int32 `json:"season"`
	RaceCount        int32 `json:"raceCount"`
	ConstructorCount int32 `json:"constructorCount"`
	Wdc              WDC   `json:"wdc"`
	Wcc              *WCC  `json:"wcc"`
}

type WDC struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	CountryCode string `json:"countryCode"`
}

type WCC struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}
