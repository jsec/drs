select
    circuit_layout_id,
    circuit_id,
    is_current_configuration,
    length_km,
    turns,
    race_count::integer as race_count,
    first_race_id,
    first_race_name,
    first_race_date,
    last_race_id,
    last_race_name,
    last_race_date,
    {{ var("refresh_id") }}::bigint as refresh_id
from {{ ref("int_f1db__circuit_layouts_with_races") }}
order by first_race_date asc nulls last, circuit_layout_id
