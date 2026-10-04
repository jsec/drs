-- name: ListDriverSeasons :many
SELECT
    dscs.season,
    c.constructor_name,
    c.primary_color_hex AS constructor_color,
    dscs.race_start_count AS starts,
    dscs.win_count AS wins,
    dscs.podium_count AS podiums,
    dscs.qualifying_p1_count AS poles,
    dss.final_points::INT AS points,
    dss.final_position_text AS position
FROM effone.driver_season_constructor_summaries dscs
    JOIN effone.driver_season_summaries dss
        ON dscs.season = dss.season
        AND dscs.driver_id = dss.driver_id
    JOIN effone.constructors c ON dscs.constructor_id = c.constructor_id
WHERE dscs.driver_id = $1
ORDER BY dscs.season DESC, dscs.constructor_sequence;

-- name: GetDriverSummary :one
WITH current_season AS (
    SELECT max(season) AS season
    FROM effone.driver_season_constructor_summaries
),
active_drivers AS (
    SELECT DISTINCT ON (driver_id)
        driver_id,
        constructor_id
    FROM effone.driver_season_constructor_summaries
    WHERE season = (SELECT season FROM current_season)
    ORDER BY driver_id, constructor_sequence DESC
)
SELECT
    d.driver_code AS code,
    d.driver_name AS name,
    d.nationality AS country,
    d.nationality_country_code AS country_code,
    d.start_count AS starts,
    d.win_count AS wins,
    d.podium_count AS podiums,
    d.qualifying_p1_count AS poles,
    d.championship_count AS championships,
    d.first_race_date,
    d.last_race_date,
    a.driver_id IS NOT NULL AS is_active,
    c.primary_color_hex AS constructor_color
FROM effone.drivers d
LEFT JOIN active_drivers a ON d.driver_id = a.driver_id
LEFT JOIN effone.constructors c ON a.constructor_id = c.constructor_id
WHERE d.driver_id = $1;

-- name: ListDrivers :many
WITH current_season AS (
    SELECT max(season) AS season
    FROM effone.driver_season_constructor_summaries
),
active_drivers AS (
    SELECT DISTINCT ON (driver_id)
        driver_id,
        constructor_id
    FROM effone.driver_season_constructor_summaries
    WHERE season = (SELECT season FROM current_season)
    ORDER BY driver_id, constructor_sequence DESC
)
SELECT
    d.driver_id as id,
    d.driver_code AS code,
    d.driver_name AS name,
    d.start_count AS starts,
    d.win_count AS wins,
    d.podium_count AS podiums,
    d.qualifying_p1_count AS poles,
    d.championship_count AS championships,
    d.first_race_date,
    d.last_race_date,
    a.driver_id IS NOT NULL AS is_active,
    c.primary_color_hex AS constructor_color
FROM effone.drivers d
LEFT JOIN active_drivers a ON d.driver_id = a.driver_id
LEFT JOIN effone.constructors c ON a.constructor_id = c.constructor_id;

-- name: GetDriverSeason :one
SELECT
    d.driver_code AS code,
    d.driver_name AS name,
    d.nationality AS country,
    d.nationality_country_code AS country_code,
    c.constructor_name,
    c.primary_color_hex AS constructor_color,
    (
        SELECT rr.car_number
        FROM effone.race_results rr
        WHERE rr.season = dss.season
            AND rr.driver_id = dss.driver_id
        ORDER BY rr.race_round DESC
        LIMIT 1
    ) AS car_number,
    dss.final_points AS points,
    dss.final_position_text AS position,
    dss.win_count AS wins,
    dss.podium_count AS podiums,
    dss.qualifying_p1_count AS poles
FROM effone.driver_season_summaries dss
    JOIN effone.drivers d ON dss.driver_id = d.driver_id
    JOIN effone.constructors c ON dss.constructor_id = c.constructor_id
WHERE dss.season = sqlc.arg(season)
    AND dss.driver_id = sqlc.arg(driver_id);

-- name: ListDriverSeasonRaces :many
SELECT DISTINCT ON (rr.race_round)
    rr.race_round,
    r.race_name,
    rr.grid_position,
    rr.position_text AS position_label,
    rr.finish_position AS position,
    rr.status_category,
    rr.points AS points,
    sr.position_text AS sprint_position_label,
    coalesce(sr.points, 0) AS sprint_points
FROM effone.race_results rr
    JOIN effone.races r ON rr.race_id = r.race_id
    LEFT JOIN effone.sprint_results sr
        ON rr.race_id = sr.race_id
        AND rr.driver_id = sr.driver_id
WHERE rr.season = sqlc.arg(season)
    AND rr.driver_id = sqlc.arg(driver_id)
ORDER BY rr.race_round, rr.finish_order;

-- name: GetDriverRace :one
SELECT
    rr.race_id,
    r.race_name,
    rr.driver_code AS code,
    rr.driver_name AS name,
    rr.constructor_name,
    c.primary_color_hex AS constructor_color,
    rr.car_number,
    rr.position_text AS position_label,
    rr.finish_position AS position,
    rr.grid_position,
    rr.positions_gained,
    rr.elapsed_time,
    rr.gap,
    rr.status_category,
    rr.laps_completed,
    rr.points AS points,
    rr.pit_stop_count,
    rr.time_penalty,
    rr.is_win,
    rr.is_pole_position,
    rr.is_fastest_lap,
    rr.is_driver_of_the_day,
    rr.is_grand_slam,
    q.position_text AS qualifying_position_label,
    coalesce(q.q3, q.q2, q.q1, q.best_qualifying_time) AS best_qualifying_time,
    fl.fastest_lap_position,
    EXISTS (
        SELECT 1
        FROM effone.sprint_results sr
        WHERE sr.race_id = rr.race_id
            AND sr.driver_id = rr.driver_id
    ) AS has_sprint
FROM effone.race_results rr
    JOIN effone.races r ON rr.race_id = r.race_id
    LEFT JOIN effone.constructors c ON rr.constructor_id = c.constructor_id
    LEFT JOIN effone.qualifying_results q
        ON rr.race_id = q.race_id
        AND rr.driver_id = q.driver_id
    LEFT JOIN effone.fastest_laps fl
        ON rr.race_id = fl.race_id
        AND rr.driver_id = fl.driver_id
WHERE rr.season = sqlc.arg(season)
    AND rr.race_round = sqlc.arg(race_round)
    AND rr.driver_id = sqlc.arg(driver_id)
ORDER BY rr.finish_order
LIMIT 1;

-- name: ListDriverRacePitStops :many
SELECT
    ps.stop_number,
    ps.lap_number,
    ps.duration,
    ps.duration_ms
FROM effone.pit_stops ps
WHERE ps.race_id = sqlc.arg(race_id)
    AND ps.driver_id = sqlc.arg(driver_id)
ORDER BY ps.stop_number;

-- name: GetDriverSprint :one
SELECT
    r.race_name,
    sr.driver_code AS code,
    sr.driver_name AS name,
    sr.constructor_name,
    c.primary_color_hex AS constructor_color,
    sr.car_number,
    sr.position_text AS position_label,
    sr.finish_position AS position,
    sr.grid_position,
    sr.positions_gained,
    sr.elapsed_time,
    sr.gap,
    sr.status_category,
    sr.laps_completed,
    sr.points AS points,
    sr.time_penalty,
    sr.is_win,
    sr.is_grid_p1
FROM effone.sprint_results sr
    JOIN effone.races r ON sr.race_id = r.race_id
    LEFT JOIN effone.constructors c ON sr.constructor_id = c.constructor_id
WHERE sr.season = sqlc.arg(season)
    AND sr.race_round = sqlc.arg(race_round)
    AND sr.driver_id = sqlc.arg(driver_id);
