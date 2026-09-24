-- name: ListSeasons :many
SELECT
    s.season,
    s.race_count,
    s.constructor_count,
    s.wdc_driver_id,
    s.wdc_driver_name,
    d.nationality_country_code AS wdc_country_code,
    s.wcc_constructor_id,
    s.wcc_constructor_name,
    c.primary_color_hex AS wcc_color
FROM effone.seasons s
INNER JOIN effone.drivers d ON s.wdc_driver_id = d.driver_id
LEFT JOIN effone.constructors c ON s.wcc_constructor_id = c.constructor_id
ORDER BY s.season DESC;

-- name: ListSeasonDriverStandings :many
WITH latest_round AS (
    SELECT max(race_round) AS race_round
    FROM effone.driver_standings_snapshots
    WHERE season = $1
)
SELECT
    dss.position,
    dss.position_text AS position_label,
    dss.points::double precision AS points,
    dss.driver_id,
    dss.driver_code AS code,
    dss.driver_name AS name,
    d.nationality AS country,
    d.nationality_country_code AS country_code,
    dss.constructor_id,
    c.constructor_name,
    c.primary_color_hex AS constructor_color,
    dss.car_number,
    dss.win_count AS wins,
    dss.podium_count AS podiums,
    dss.qualifying_p1_count AS poles
FROM effone.driver_standings_snapshots AS dss
JOIN latest_round
    ON dss.race_round = latest_round.race_round
JOIN effone.drivers AS d
    ON dss.driver_id = d.driver_id
LEFT JOIN effone.constructors AS c
    ON dss.constructor_id = c.constructor_id
WHERE dss.season = $1
ORDER BY dss.position NULLS LAST, dss.driver_name;

-- name: ListSeasonConstructorStandings :many
WITH latest_round AS (
    SELECT max(race_round) AS race_round
    FROM effone.constructor_standings_snapshots
    WHERE season = $1
)
SELECT
    css.position,
    css.position_text AS position_label,
    css.points::double precision AS points,
    css.constructor_id,
    css.constructor_name AS name,
    c.primary_color_hex AS constructor_color
FROM effone.constructor_standings_snapshots AS css
JOIN latest_round
    ON css.race_round = latest_round.race_round
JOIN effone.constructors AS c
    ON css.constructor_id = c.constructor_id
WHERE css.season = $1
ORDER BY css.position NULLS LAST, css.constructor_name;

-- name: ListSeasonDriverProgression :many
SELECT
    dss.race_round,
    dss.driver_id,
    dss.driver_code AS code,
    dss.points::double precision AS points
FROM effone.driver_standings_snapshots AS dss
WHERE dss.season = $1
ORDER BY dss.driver_id, dss.race_round;
