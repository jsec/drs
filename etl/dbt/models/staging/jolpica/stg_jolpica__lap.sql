select
    id as lap_id,
    session_entry_id,
    number as lap_number,
    position as lap_position,
    time as lap_time,
    is_entry_fastest_lap
from {{ source("jolpica", "formula_one_lap") }}
where not is_deleted
