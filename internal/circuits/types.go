package circuits

type ListCircuitsResponse struct {
	CircuitID     string `json:"circuit_id"`
	Name          string `json:"name"`
	Country       string `json:"country"`
	FirstRaceYear *int32 `json:"first_race_year,omitempty"`
	LastRaceYear  *int32 `json:"last_race_year,omitempty"`
	Location      string `json:"location"`
	RaceCount     int    `json:"race_count"`
}
