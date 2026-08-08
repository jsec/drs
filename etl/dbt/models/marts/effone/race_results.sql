with results as (select * from {{ ref("int_f1db__race_results_with_entities") }})

select
    season,
    race_round,
    race_id,
    race_official_name as race_name,
    race_date,
    circuit_id,
    driver_id,
    driver_name,
    driver_code,
    constructor_id,
    constructor_name,
    engine_manufacturer_id,
    tyre_manufacturer_id,
    driver_number as car_number,
    grid_position_number as grid_position,
    qualification_position_number as qualifying_position,
    position_number as finish_position,
    position_display_order as finish_order,
    position_text,
    positions_gained,
    coalesce(points, 0) as points,
    (coalesce(points, 0) * 100)::integer as points_x100,
    laps as laps_completed,
    race_time as elapsed_time,
    race_time_millis as elapsed_time_ms,
    time_penalty,
    time_penalty_millis as time_penalty_ms,
    gap,
    gap_millis as gap_ms,
    gap_laps,
    "interval",
    interval_millis as interval_ms,
    pit_stops as pit_stop_count,
    reason_retired as status,
    case
        when reason_retired is null
        then 'finished'
        when lower(reason_retired) like '%accident%'
        then 'accident'
        when lower(reason_retired) like '%collision%'
        then 'collision'
        when lower(reason_retired) like '%disqualified%'
        then 'disqualified'
        when lower(reason_retired) like '%not qualified%'
        then 'not_qualified'
        when lower(reason_retired) like '%not classified%'
        then 'not_classified'
        when lower(reason_retired) like '%withdraw%'
        then 'withdrawn'
        when
            lower(reason_retired)
            ~ '(engine|gearbox|hydraulic|electrical|brake|transmission|clutch|suspension|power|fuel|oil|water|radiator|battery)'
        then 'mechanical'
        when lower(reason_retired) ~ '(spin|spun|driver)'
        then 'driver_error'
        else 'other_retirement'
    end as status_category,
    true as is_entry,
    laps is not null as is_start,
    reason_retired is not null as is_dnf,
    position_number is not null as is_classified_finish,
    coalesce(position_display_order = 1, false) as is_win,
    coalesce(position_display_order <= 3, false) as is_podium,
    coalesce(points, 0) > 0 as is_points_finish,
    coalesce(grid_position_number = 1, false) as is_grid_p1,
    coalesce(pole_position, false) as is_pole_position,
    coalesce(fastest_lap, false) as is_fastest_lap,
    coalesce(driver_of_the_day, false) as is_driver_of_the_day,
    coalesce(grand_slam, false) as is_grand_slam,
    {{ var("refresh_id") }}::bigint as refresh_id
from results
