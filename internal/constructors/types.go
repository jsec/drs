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
