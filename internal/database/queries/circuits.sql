-- name: ListCircuits :many
SELECT
    circuit_id,
    circuit_name as name,
    country,
    first_race_name as first_race,
    last_race_name as last_race,
    location,
    race_count
FROM effone.circuits
ORDER BY last_race_date DESC;
