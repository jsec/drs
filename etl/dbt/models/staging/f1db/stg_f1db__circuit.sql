select
    id as circuit_id,
    name as circuit_name,
    full_name as circuit_full_name,
    place_name,
    country_id,
    turns,
    total_races_held
from {{ source("f1db", "circuit") }}
