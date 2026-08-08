with
    pit_stops as (select * from {{ ref("stg_f1db__pit_stop") }}),

    races as (select * from {{ ref("int_f1db__races_with_circuits") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }})

select
    races.season,
    races.race_round,
    pit_stops.race_id,
    races.race_official_name as race_name,
    races.race_date,
    races.circuit_id,
    pit_stops.driver_id,
    drivers.driver_name,
    drivers.driver_code,
    pit_stops.constructor_id,
    constructors.constructor_name,
    pit_stops.engine_manufacturer_id,
    pit_stops.tyre_manufacturer_id,
    pit_stops.driver_number as car_number,
    pit_stops.stop_number,
    pit_stops.lap_number,
    pit_stops.position_display_order as stop_order,
    pit_stops.position_number as stop_position,
    pit_stops.position_text,
    pit_stops.pit_time as duration,
    pit_stops.pit_time_millis as duration_ms,
    {{ var("refresh_id") }}::bigint as refresh_id
from pit_stops
join races on pit_stops.race_id = races.race_id
join drivers on pit_stops.driver_id = drivers.driver_id
join constructors on pit_stops.constructor_id = constructors.constructor_id
