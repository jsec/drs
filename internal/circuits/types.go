package circuits

type ListCircuitsResponse struct {
	CircuitID string  `json:"circuit_id"`
	Name      string  `json:"name"`
	Country   string  `json:"country"`
	FirstRace *string `json:"first_race,omitempty"`
	LastRace  *string `json:"last_race,omitempty"`
	Location  *string `json:"location"`
	RaceCount int     `json:"race_count"`
}
