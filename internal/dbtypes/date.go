package dbtypes

import (
	"encoding/json"

	"github.com/jackc/pgx/v5/pgtype"
)

type Date struct {
	pgtype.Date
}

func (d Date) MarshalJSON() ([]byte, error) {
	if !d.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(d.Time.Format("2006-01-02"))
}

func (d Date) Year() *int32 {
	if !d.Valid {
		return nil
	}
	y := int32(d.Time.Year())
	return &y
}
