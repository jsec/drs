with
    fastest_laps as (select * from {{ ref("stg_f1db__fastest_lap") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }})

select
    fastest_laps.race_id,
    fastest_laps.driver_id,
    drivers.driver_code,
    fastest_laps.position_display_order as fastest_lap_order,
    fastest_laps.position_number as fastest_lap_position,
    fastest_laps.lap_number,
    fastest_laps.lap_time
from fastest_laps
join drivers on fastest_laps.driver_id = drivers.driver_id
