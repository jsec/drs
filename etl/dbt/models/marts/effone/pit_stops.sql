select race_id, driver_id, stop_number, lap_number, pit_time as duration from {{ ref("stg_f1db__pit_stop") }}
