select
    id as driver_id,
    name as driver_name,
    last_name,
    abbreviation as driver_code,
    permanent_number::integer as driver_number,
    date_of_birth,
    nationality_country_id,
    total_championship_wins,
    total_race_starts,
    total_race_wins,
    total_podiums,
    total_points,
    total_pole_positions
from {{ source("f1db", "driver") }}
