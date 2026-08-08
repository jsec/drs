with
    season_drivers as (select * from {{ ref("stg_f1db__season_driver_standing") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    race_results as (select * from {{ ref("race_results") }}),

    sprint_results as (select * from {{ ref("sprint_results") }}),

    qualifying_results as (select * from {{ ref("qualifying_results") }}),

    race_aggregates as (
        select
            season,
            driver_id,
            count(*)::integer as race_entry_count,
            count(*) filter (where is_start)::integer as race_start_count,
            count(*) filter (where is_win)::integer as win_count,
            count(*) filter (where is_podium)::integer as podium_count,
            count(*) filter (where is_fastest_lap)::integer as fastest_lap_count,
            sum(points) as race_points
        from race_results
        group by season, driver_id
    ),

    sprint_aggregates as (
        select
            season,
            driver_id,
            count(*)::integer as sprint_entry_count,
            count(*) filter (where is_start)::integer as sprint_start_count,
            sum(points) as sprint_points
        from sprint_results
        group by season, driver_id
    ),

    qualifying_aggregates as (
        select
            season,
            driver_id,
            count(*)::integer as qualifying_entry_count,
            count(qualifying_position)::integer as qualifying_position_count,
            count(*) filter (where is_qualifying_p1)::integer as qualifying_p1_count,
            avg(qualifying_position)::numeric(6, 2) as average_qualifying_position
        from qualifying_results
        group by season, driver_id
    ),

    last_constructor as (
        select distinct on (season, driver_id) season, driver_id, constructor_id
        from race_results
        order by season, driver_id, race_date desc, race_round desc
    )

select
    season_drivers.season,
    season_drivers.driver_id,
    drivers.driver_name,
    drivers.driver_code,
    last_constructor.constructor_id,
    coalesce(race_aggregates.race_entry_count, 0) + coalesce(sprint_aggregates.sprint_entry_count, 0) as entry_count,
    coalesce(race_aggregates.race_start_count, 0) + coalesce(sprint_aggregates.sprint_start_count, 0) as start_count,
    coalesce(race_aggregates.race_entry_count, 0) as race_entry_count,
    coalesce(sprint_aggregates.sprint_entry_count, 0) as sprint_entry_count,
    coalesce(race_aggregates.race_start_count, 0) as race_start_count,
    coalesce(sprint_aggregates.sprint_start_count, 0) as sprint_start_count,
    coalesce(race_aggregates.win_count, 0) as win_count,
    coalesce(race_aggregates.podium_count, 0) as podium_count,
    coalesce(race_aggregates.fastest_lap_count, 0) as fastest_lap_count,
    coalesce(qualifying_aggregates.qualifying_entry_count, 0) as qualifying_entry_count,
    coalesce(qualifying_aggregates.qualifying_position_count, 0) as qualifying_position_count,
    coalesce(qualifying_aggregates.qualifying_p1_count, 0) as qualifying_p1_count,
    qualifying_aggregates.average_qualifying_position,
    coalesce(race_aggregates.race_points, 0) as race_points,
    (coalesce(race_aggregates.race_points, 0) * 100)::integer as race_points_x100,
    coalesce(sprint_aggregates.sprint_points, 0) as sprint_points,
    (coalesce(sprint_aggregates.sprint_points, 0) * 100)::integer as sprint_points_x100,
    coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0) as total_points,
    ((coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0)) * 100)::integer
    as total_points_x100,
    season_drivers.position_number as final_position,
    season_drivers.position_text as final_position_text,
    season_drivers.points as final_points,
    (season_drivers.points * 100)::integer as final_points_x100,
    season_drivers.championship_won,
    (coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0))
    - season_drivers.points as points_delta,
    (
        (
            (coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0))
            - season_drivers.points
        )
        * 100
    )::integer as points_delta_x100,
    {{ var("refresh_id") }}::bigint as refresh_id
from season_drivers
join drivers on season_drivers.driver_id = drivers.driver_id
left join
    race_aggregates
    on season_drivers.season = race_aggregates.season
    and season_drivers.driver_id = race_aggregates.driver_id
left join
    sprint_aggregates
    on season_drivers.season = sprint_aggregates.season
    and season_drivers.driver_id = sprint_aggregates.driver_id
left join
    qualifying_aggregates
    on season_drivers.season = qualifying_aggregates.season
    and season_drivers.driver_id = qualifying_aggregates.driver_id
left join
    last_constructor
    on season_drivers.season = last_constructor.season
    and season_drivers.driver_id = last_constructor.driver_id
