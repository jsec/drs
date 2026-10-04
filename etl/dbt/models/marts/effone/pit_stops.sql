select
    race_id,
    driver_id,
    stop_number,
    lap_number,
    position_display_order as stop_order,
    pit_time as duration,
    pit_time_millis as duration_ms
from {{ ref("stg_f1db__pit_stop") }}
