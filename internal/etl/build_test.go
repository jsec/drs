package etl

import (
	"context"
	"testing"
	"time"
)

func TestFailureCleanupContext(t *testing.T) {
	parentCtx, cancelParent := context.WithCancel(context.Background())
	cancelParent()

	cleanupCtx, cancelCleanup := failureCleanupContext(parentCtx)
	defer cancelCleanup()

	if err := cleanupCtx.Err(); err != nil {
		t.Fatalf("cleanup context error = %v, want nil", err)
	}

	deadline, ok := cleanupCtx.Deadline()
	if !ok {
		t.Fatal("cleanup context has no deadline")
	}
	if !deadline.After(time.Now()) {
		t.Fatalf("cleanup context deadline = %v, want future deadline", deadline)
	}
}
