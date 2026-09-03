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

func TestDriverSummary_IncludesHeroFields(t *testing.T) {
	t.Parallel()

	jsonSummary, err := json.Marshal(DriverSummary{})

	assert.NoError(t, err)
	var response map[string]any
	assert.NoError(t, json.Unmarshal(jsonSummary, &response))
	assert.Contains(t, response, "constructorColor")
	assert.Contains(t, response, "firstYear")
	assert.Contains(t, response, "isActive")
	assert.Contains(t, response, "lastYear")
}
