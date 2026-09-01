package etl

import (
	"context"
	"strings"
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

func TestDownloadDumpFileIncludesDownloadOperation(t *testing.T) {
	_, _, err := downloadDumpFile(context.Background(), "://invalid")
	if err == nil {
		t.Fatal("downloadDumpFile() error = nil, want error")
	}

	if !strings.Contains(err.Error(), "downloading dump file") {
		t.Fatalf("downloadDumpFile() error = %q, want download operation context", err)
	}
}
