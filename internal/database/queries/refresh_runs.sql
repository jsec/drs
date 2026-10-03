-- name: CreateRefreshRun :one
INSERT INTO effone.refresh_runs (status)
VALUES ($1)
RETURNING refresh_id;

-- name: MarkRefreshSucceeded :exec
UPDATE effone.refresh_runs
SET
    status = 'succeeded',
    finished_at = now(),
    row_counts = $2
WHERE refresh_id = $1;

-- name: MarkRefreshFailed :exec
UPDATE effone.refresh_runs
SET
    status = 'failed',
    finished_at = now(),
    row_counts = '{}'::jsonb,
    error_message = $2
WHERE refresh_id = $1;
