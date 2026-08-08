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
