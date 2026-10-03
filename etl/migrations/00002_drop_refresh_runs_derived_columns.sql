-- +goose Up
alter table effone.refresh_runs
    drop column duration_ms,
    drop column notes,
    drop column source_version;

-- +goose Down
alter table effone.refresh_runs
    add column duration_ms integer,
    add column source_version text,
    add column notes text;
