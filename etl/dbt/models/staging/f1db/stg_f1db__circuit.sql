select
    id as circuit_id,
    name as circuit_name,
    full_name as circuit_full_name,
    previous_names,
    "type" as circuit_type,
    direction,
    place_name,
    country_id,
    latitude,
    longitude,
    "length" as length_km,
    turns,
    total_races_held
from {{ source("f1db", "circuit") }}
