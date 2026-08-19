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
