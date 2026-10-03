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
    results.position_display_order as qualifying_order,
    results.position_number as qualifying_position,
    results.position_text,
    results.q1,
    results.q2,
    results.q3,
    results.qualifying_time as best_qualifying_time,
    results.gap,
    results."interval",
    results.laps,
    true as is_entry,
    coalesce(results.position_display_order = 1, false) as is_qualifying_p1,
    results.q2 is not null as advanced_to_q2,
    results.q3 is not null as advanced_to_q3
from {{ ref("stg_f1db__qualifying_result") }} as results
join {{ ref("int_f1db__races_with_circuits") }} as races on results.race_id = races.race_id
join {{ ref("int_f1db__drivers_with_countries") }} as drivers on results.driver_id = drivers.driver_id
join
    {{ ref("int_f1db__constructors_with_countries") }} as constructors
    on results.constructor_id = constructors.constructor_id
