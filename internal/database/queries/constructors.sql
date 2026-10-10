-- name: ListConstructors :many
SELECT
    constructor_id AS id,
    constructor_name AS name,
    primary_color_hex AS color,
    first_race_date,
    last_race_date,
    championship_count AS championships,
    win_count AS wins,
    podium_count AS podiums
FROM effone.constructors
ORDER BY championship_count DESC, win_count DESC;

-- name: GetConstructorSummary :one
SELECT
    constructor_id AS id,
    constructor_name AS name,
    constructor_full_name AS full_name,
    nationality AS country,
    country_code,
    primary_color_hex AS color,
    start_count AS starts,
    win_count AS wins,
    podium_count AS podiums,
    qualifying_p1_count AS poles,
    championship_count AS championships,
    CASE WHEN first_race_date IS NOT NULL THEN date_part('year', first_race_date)::INTEGER END AS first_year,
    CASE WHEN last_race_date IS NOT NULL THEN date_part('year', last_race_date)::INTEGER END AS last_year,
    coalesce(extract(year FROM last_race_date) = (SELECT max(season) FROM effone.race_results), false)::BOOLEAN AS is_active
FROM effone.constructors
WHERE constructor_id = sqlc.arg(constructor_id)::TEXT;

-- name: ListConstructorSeasons :many
SELECT
    season,
    engine_manufacturer_id,
    engine_manufacturer_name,
    race_start_count AS starts,
    win_count AS wins,
    podium_count AS podiums,
    qualifying_p1_count AS poles,
    final_position_text,
    final_points,
    championship_won
FROM effone.constructor_season_summaries
WHERE constructor_id = $1
ORDER BY season DESC, engine_manufacturer_name;

-- name: ListConstructorSeasonDrivers :many
SELECT
    season,
    engine_manufacturer_id,
    driver_id,
    driver_name
FROM effone.race_results
WHERE constructor_id = $1
GROUP BY season, engine_manufacturer_id, driver_id, driver_name
ORDER BY season DESC, engine_manufacturer_id, count(*) DESC, driver_name;

-- name: ListConstructorLineage :many
SELECT
    position_display_order,
    other_constructor_id,
    other_constructor_name,
    year_from,
    year_to
FROM effone.constructor_lineage
WHERE constructor_id = $1
ORDER BY position_display_order;

-- name: ListConstructorSeasonEntries :many
SELECT
    engine_manufacturer_name AS engine_name,
    final_position_text,
    final_points,
    championship_won,
    win_count AS wins,
    podium_count AS podiums,
    qualifying_p1_count AS poles,
    dnf_count AS dnfs
FROM effone.constructor_season_summaries
WHERE season = sqlc.arg(season)
    AND constructor_id = sqlc.arg(constructor_id)
ORDER BY final_order NULLS LAST, engine_manufacturer_name;

-- name: ListConstructorSeasonProgression :many
SELECT
    race_round,
    sum(points)::NUMERIC AS points
FROM effone.constructor_standings_snapshots
WHERE season = sqlc.arg(season)
    AND constructor_id = sqlc.arg(constructor_id)
GROUP BY race_round
ORDER BY race_round;

-- name: ListConstructorSeasonDriverSummaries :many
SELECT
    driver_id,
    driver_code,
    driver_name,
    race_start_count AS starts,
    win_count AS wins,
    podium_count AS podiums,
    total_points AS points
FROM effone.driver_season_constructor_summaries
WHERE season = sqlc.arg(season)
    AND constructor_id = sqlc.arg(constructor_id)
ORDER BY total_points DESC, race_start_count DESC, driver_name;

-- name: ListConstructorSeasonResults :many
SELECT
    rr.race_round,
    rr.race_name,
    rr.finish_order,
    rr.driver_id,
    rr.driver_code,
    rr.position_text AS position_label,
    rr.status_category,
    rr.points,
    sr.position_text AS sprint_position_label,
    coalesce(sr.points, 0) AS sprint_points
FROM effone.race_results rr
    LEFT JOIN effone.sprint_results sr
        ON rr.race_id = sr.race_id
        AND rr.driver_id = sr.driver_id
        AND rr.constructor_id = sr.constructor_id
WHERE rr.season = sqlc.arg(season)
    AND rr.constructor_id = sqlc.arg(constructor_id)
ORDER BY rr.race_round, rr.finish_order;
