select
    id as constructor_id,
    name as constructor_name,
    full_name as constructor_full_name,
    country_id,
    total_championship_wins,
    total_race_starts,
    total_race_wins,
    total_podiums,
    total_points,
    total_pole_positions
from {{ source("f1db", "constructor") }}
