package drivers

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDriverShortSummary_UsesCamelCaseLastYear(t *testing.T) {
	t.Parallel()

	lastYear := int32(2012)
	summary := DriverShortSummary{LastYear: &lastYear}

	jsonSummary, err := json.Marshal(summary)

	assert.NoError(t, err)
	var response map[string]any
	assert.NoError(t, json.Unmarshal(jsonSummary, &response))
	assert.InDelta(t, 2012, response["lastYear"], 0)
	assert.NotContains(t, response, "LastYear")
}
