-- name: CreateRefreshRun :one
INSERT INTO effone.refresh_runs (status, source_version)
VALUES ($1, $2)
RETURNING refresh_id;

-- name: MarkRefreshSucceeded :exec
UPDATE effone.refresh_runs
SET
    status = 'succeeded',
    finished_at = now(),
    duration_ms = extract(EPOCH FROM (now() - started_at)) * 1000,
    row_counts = $2
WHERE refresh_id = $1;

-- name: MarkRefreshFailed :exec
UPDATE effone.refresh_runs
SET
    status = 'failed',
    finished_at = now(),
    duration_ms = extract(EPOCH FROM (now() - started_at)) * 1000,
    row_counts = '{}'::jsonb,
    error_message = $2
WHERE refresh_id = $1;
