select
    race_id,
    position_display_order,
    position_number,
    position_text,
    driver_number::integer as driver_number,
    driver_id,
    constructor_id,
    engine_manufacturer_id,
    tyre_manufacturer_id,
    lap as lap_number,
    "time" as lap_time,
    time_millis as lap_time_millis,
    gap,
    gap_millis,
    "interval",
    interval_millis
from {{ source("f1db", "fastest_lap") }}
