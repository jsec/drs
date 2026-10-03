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
    first_race_date,
    last_race_date,
    coalesce(extract(year FROM last_race_date) = (SELECT max(season) FROM effone.race_results), false)::BOOLEAN AS is_active
FROM effone.constructors
WHERE constructor_id = sqlc.arg(constructor_id)::TEXT;

-- name: ListConstructorSeasons :many
SELECT
    season,
    engine_manufacturer_id,
    engine_manufacturer_name,
    start_count AS starts,
    win_count AS wins,
    podium_count AS podiums,
    pole_count AS poles,
    final_position_text,
    final_points,
    championship_won
FROM effone.constructor_engine_seasons
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
