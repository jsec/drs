select
    race_id,
    position_display_order,
    position_number,
    position_text,
    driver_number::integer as driver_number,
    driver_id,
    constructor_id,
    engine_manufacturer_id,
    "time" as qualifying_time,
    q1,
    q2,
    q3,
    gap,
    "interval",
    laps
from {{ source("f1db", "qualifying_result") }}
