package dbtypes_test

import (
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/jsec/drs/internal/dbtypes"
)

func TestInt4_MarshalJSON(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		val  dbtypes.Int4
		want string
	}{
		{name: "valid", val: dbtypes.Int4{Int4: pgtype.Int4{Int32: 42, Valid: true}}, want: "42"},
		{name: "invalid", val: dbtypes.Int4{}, want: "null"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			got, err := tt.val.MarshalJSON()
			require.NoError(t, err)
			assert.Equal(t, tt.want, string(got))
		})
	}
}
