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
