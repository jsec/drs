package constructors

type ConstructorResponse struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Color         string  `json:"color"`
	FirstRaceDate *string `json:"firstRaceDate,omitempty"`
	LastRaceDate  *string `json:"lastRaceDate,omitempty"`
	Championships int32   `json:"championships"`
	Wins          int32   `json:"wins"`
	Podiums       int32   `json:"podiums"`
}
