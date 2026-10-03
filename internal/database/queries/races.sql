-- name: GetRaceDetail :one
SELECT
    r.race_id,
    r.season,
    r.race_round,
    r.race_name,
    r.race_date,
    ci.circuit_name,
    r.race_laps,
    r.pole_driver_id,
    pole.driver_code AS pole_code,
    r.winner_driver_id,
    r.winner_driver_code,
    fl.driver_id AS fastest_lap_driver_id,
    fl.driver_code AS fastest_lap_code,
    fl.lap_time AS fastest_lap_time
FROM effone.races AS r
JOIN effone.circuits AS ci
    ON r.circuit_id = ci.circuit_id
LEFT JOIN effone.drivers AS pole
    ON r.pole_driver_id = pole.driver_id
LEFT JOIN effone.fastest_laps AS fl
    ON r.race_id = fl.race_id
    AND fl.fastest_lap_order = 1
WHERE r.season = sqlc.arg(season)
    AND r.race_round = sqlc.arg(race_round);

-- name: ListRaceResults :many
SELECT
    rr.finish_order AS position,
    rr.position_text AS position_label,
    rr.driver_id,
    rr.driver_code AS code,
    rr.driver_name AS name,
    d.last_name,
    rr.constructor_id,
    rr.constructor_name,
    c.primary_color_hex AS constructor_color,
    rr.grid_position,
    rr.elapsed_time,
    rr.gap,
    rr.status,
    rr.points AS points
FROM effone.race_results AS rr
JOIN effone.drivers AS d
    ON rr.driver_id = d.driver_id
LEFT JOIN effone.constructors AS c
    ON rr.constructor_id = c.constructor_id
WHERE rr.race_id = $1
ORDER BY rr.finish_order;

-- name: ListRaceLapTimes :many
SELECT
    lt.driver_id,
    lt.lap_number,
    lt.position,
    lt.lap_time_ms
FROM effone.lap_times AS lt
WHERE lt.race_id = sqlc.arg(race_id)
    AND lt.session = sqlc.arg(session)
ORDER BY lt.driver_id, lt.lap_number;
