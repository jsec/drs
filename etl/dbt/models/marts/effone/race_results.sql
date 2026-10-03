select
    races.season,
    races.race_round,
    results.race_id,
    races.race_official_name as race_name,
    races.race_date,
    races.circuit_id,
    results.driver_id,
    drivers.driver_name,
    drivers.driver_code,
    results.constructor_id,
    constructors.constructor_name,
    results.engine_manufacturer_id,
    results.tyre_manufacturer_id,
    results.driver_number as car_number,
    results.grid_position_number as grid_position,
    results.qualification_position_number as qualifying_position,
    results.position_number as finish_position,
    results.position_display_order as finish_order,
    results.position_text,
    results.positions_gained,
    coalesce(results.points, 0) as points,
    results.laps as laps_completed,
    results.race_time as elapsed_time,
    results.time_penalty,
    results.gap,
    results.gap_laps,
    results."interval",
    results.pit_stops as pit_stop_count,
    {{ result_status_columns() }},
    coalesce(results.pole_position, false) as is_pole_position,
    coalesce(results.fastest_lap, false) as is_fastest_lap,
    coalesce(results.driver_of_the_day, false) as is_driver_of_the_day,
    coalesce(results.grand_slam, false) as is_grand_slam
from {{ ref("stg_f1db__race_result") }} as results
join {{ ref("int_f1db__races_with_circuits") }} as races on results.race_id = races.race_id
join {{ ref("int_f1db__drivers_with_countries") }} as drivers on results.driver_id = drivers.driver_id
join
    {{ ref("int_f1db__constructors_with_countries") }} as constructors
    on results.constructor_id = constructors.constructor_id
