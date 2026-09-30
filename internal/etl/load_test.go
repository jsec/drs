package etl

import (
	"testing"
	"time"
)

func TestHTTPClientHasTimeout(t *testing.T) {
	if httpClient.Timeout <= 0 {
		t.Fatal("ETL HTTP client must have a timeout")
	}

	if httpClient.Timeout != 30*time.Second {
		t.Fatalf("HTTP client timeout = %s, want %s", httpClient.Timeout, 30*time.Second)
	}
}
