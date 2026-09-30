package etl

import (
	"context"
	"strings"
	"testing"
)

func TestDownloadDumpFileIncludesDownloadOperation(t *testing.T) {
	_, _, err := downloadF1dbDump(context.Background(), "://invalid")
	if err == nil {
		t.Fatal("downloadDumpFile() error = nil, want error")
	}

	if !strings.Contains(err.Error(), "downloading dump file") {
		t.Fatalf("downloadDumpFile() error = %q, want download operation context", err)
	}
}
