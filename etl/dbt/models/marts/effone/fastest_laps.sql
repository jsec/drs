with
    fastest_laps as (select * from {{ ref("stg_f1db__fastest_lap") }}),

    races as (select * from {{ ref("int_f1db__races_with_circuits") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }})

select
    races.season,
    races.race_round,
    fastest_laps.race_id,
    races.race_official_name as race_name,
    races.race_date,
    races.circuit_id,
    fastest_laps.driver_id,
    drivers.driver_name,
    drivers.driver_code,
    fastest_laps.constructor_id,
    constructors.constructor_name,
    fastest_laps.engine_manufacturer_id,
    fastest_laps.tyre_manufacturer_id,
    fastest_laps.driver_number as car_number,
    fastest_laps.position_display_order as fastest_lap_order,
    fastest_laps.position_number as fastest_lap_position,
    fastest_laps.position_text,
    fastest_laps.lap_number,
    fastest_laps.lap_time,
    fastest_laps.lap_time_millis as lap_time_ms,
    fastest_laps.gap,
    fastest_laps.gap_millis as gap_ms,
    fastest_laps."interval",
    fastest_laps.interval_millis as interval_ms,
    {{ var("refresh_id") }}::bigint as refresh_id
from fastest_laps
join races on fastest_laps.race_id = races.race_id
join drivers on fastest_laps.driver_id = drivers.driver_id
join constructors on fastest_laps.constructor_id = constructors.constructor_id
