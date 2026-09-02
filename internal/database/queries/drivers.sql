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
SELECT
    driver_code AS code,
    driver_name AS name,
    nationality AS country,
    nationality_country_code AS country_code,
    start_count AS starts,
    win_count AS wins,
    podium_count AS podiums,
    qualifying_p1_count AS poles,
    championship_count AS championships
FROM effone.drivers
WHERE driver_id = $1;

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
