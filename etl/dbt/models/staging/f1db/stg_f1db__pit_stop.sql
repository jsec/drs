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
    stop as stop_number,
    lap as lap_number,
    "time" as pit_time,
    time_millis as pit_time_millis
from {{ source("f1db", "pit_stop") }}
