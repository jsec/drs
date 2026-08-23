package dbtypes

import (
	"encoding/json"

	"github.com/jackc/pgx/v5/pgtype"
)

type Int4 struct {
	pgtype.Int4
}

func (i Int4) MarshalJSON() ([]byte, error) {
	if !i.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(i.Int32)
}
