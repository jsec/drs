-- name: ListCircuits :many
SELECT
    circuit_id,
    circuit_name as name,
    country,
    first_race_date,
    last_race_date,
    location,
    race_count
FROM effone.circuits
ORDER BY last_race_date DESC;
