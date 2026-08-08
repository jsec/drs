-- +goose Up
create extension if not exists pg_trgm;

create schema if not exists effone;

create table effone.refresh_runs (
    refresh_id bigint generated always as identity primary key,
    started_at timestamptz not null default now(),
    finished_at timestamptz,
    duration_ms integer,
    source_version text,
    status text not null check (status in ('running', 'succeeded', 'failed')),
    row_counts jsonb check (row_counts is null or jsonb_typeof(row_counts) = 'object'),
    error_message text,
    notes text
);

comment on schema effone is 'Formula 1 analytical schema.';
comment on table effone.refresh_runs is 'Metadata for source data refreshes.';
comment on column effone.refresh_runs.row_counts is 'Per-table row counts captured by refreshes.';

-- +goose Down
drop table if exists effone.refresh_runs;
drop schema if exists effone;
