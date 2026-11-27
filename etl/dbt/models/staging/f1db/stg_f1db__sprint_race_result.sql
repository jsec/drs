select
    race_id,
    position_display_order,
    position_number,
    position_text,
    driver_number::integer as driver_number,
    driver_id,
    constructor_id,
    engine_manufacturer_id,
    laps,
    "time" as sprint_time,
    time_penalty,
    gap,
    "interval",
    reason_retired,
    points,
    grid_position_number
from {{ source("f1db", "sprint_race_result") }}
