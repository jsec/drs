package constructors

import "github.com/jsec/drs/internal/dbtypes"

type ConstructorResponse struct {
	ID            string       `json:"id"`
	Name          string       `json:"name"`
	Color         string       `json:"color"`
	FirstRaceDate dbtypes.Date `json:"firstRaceDate,omitempty"`
	LastRaceDate  dbtypes.Date `json:"lastRaceDate,omitempty"`
	Championships int32        `json:"championships"`
	Wins          int32        `json:"wins"`
	Podiums       int32        `json:"podiums"`
}
