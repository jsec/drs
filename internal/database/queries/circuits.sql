-- name: ListCircuits :many
SELECT
    circuit_id,
    circuit_name as name,
    country,
    CASE WHEN first_race_date IS NOT NULL THEN date_part('year', first_race_date)::INTEGER END AS first_race_year,
    CASE WHEN last_race_date IS NOT NULL THEN date_part('year', last_race_date)::INTEGER END AS last_race_year,
    location,
    race_count
FROM effone.circuits
ORDER BY last_race_date DESC;

-- name: GetRacesByCircuitId :many
SELECT
    race_id,
    race_date,
    circuit_layout_id,
    race_official_name,
    winner_driver_id,
    winner_driver_name
FROM effone.races
WHERE circuit_id = $1
ORDER BY race_date DESC;

-- name: GetCircuitInfo :one
SELECT
    circuit_id,
    circuit_full_name as name,
    circuit_type,
    country,
    country_code,
    country_id,
    first_race_id,
    first_race_date,
    first_race_name,
    last_race_id,
    last_race_date,
    last_race_name,
    current_layout_id,
    previous_names,
    race_count,
    turns
FROM effone.circuits
WHERE circuit_id = $1;
