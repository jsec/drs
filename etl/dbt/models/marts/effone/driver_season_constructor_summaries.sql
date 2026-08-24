with
    race_results as (select * from {{ ref("race_results") }}),

    sprint_results as (select * from {{ ref("sprint_results") }}),

    qualifying_results as (select * from {{ ref("qualifying_results") }}),

    drivers as (select * from {{ ref("drivers") }}),

    constructors as (select * from {{ ref("constructors") }}),

    race_aggregates as (
        select
            season,
            driver_id,
            constructor_id,
            count(*)::integer as race_entry_count,
            count(*) filter (where is_start)::integer as race_start_count,
            count(*) filter (where is_win)::integer as win_count,
            count(*) filter (where is_podium)::integer as podium_count,
            count(*) filter (where is_fastest_lap)::integer as fastest_lap_count,
            sum(points) as race_points,
            min(race_date) as first_race_date
        from race_results
        group by season, driver_id, constructor_id
    ),

    sprint_aggregates as (
        select
            season,
            driver_id,
            constructor_id,
            count(*)::integer as sprint_entry_count,
            count(*) filter (where is_start)::integer as sprint_start_count,
            sum(points) as sprint_points
        from sprint_results
        group by season, driver_id, constructor_id
    ),

    qualifying_aggregates as (
        select
            season,
            driver_id,
            constructor_id,
            count(*)::integer as qualifying_entry_count,
            count(qualifying_position)::integer as qualifying_position_count,
            count(*) filter (where is_qualifying_p1)::integer as qualifying_p1_count,
            avg(qualifying_position)::numeric(6, 2) as average_qualifying_position
        from qualifying_results
        group by season, driver_id, constructor_id
    )

select
    race_aggregates.season,
    race_aggregates.driver_id,
    drivers.driver_name,
    drivers.driver_code,
    race_aggregates.constructor_id,
    constructors.constructor_name,
    row_number() over (
        partition by race_aggregates.season, race_aggregates.driver_id
        order by race_aggregates.first_race_date, race_aggregates.constructor_id
    )::integer as constructor_sequence,
    race_aggregates.race_entry_count + coalesce(sprint_aggregates.sprint_entry_count, 0) as entry_count,
    race_aggregates.race_start_count + coalesce(sprint_aggregates.sprint_start_count, 0) as start_count,
    race_aggregates.race_entry_count,
    coalesce(sprint_aggregates.sprint_entry_count, 0) as sprint_entry_count,
    race_aggregates.race_start_count,
    coalesce(sprint_aggregates.sprint_start_count, 0) as sprint_start_count,
    race_aggregates.win_count,
    race_aggregates.podium_count,
    race_aggregates.fastest_lap_count,
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
    {{ var("refresh_id") }}::bigint as refresh_id
from race_aggregates
join drivers on race_aggregates.driver_id = drivers.driver_id
join constructors on race_aggregates.constructor_id = constructors.constructor_id
left join
    sprint_aggregates
    on race_aggregates.season = sprint_aggregates.season
    and race_aggregates.driver_id = sprint_aggregates.driver_id
    and race_aggregates.constructor_id = sprint_aggregates.constructor_id
left join
    qualifying_aggregates
    on race_aggregates.season = qualifying_aggregates.season
    and race_aggregates.driver_id = qualifying_aggregates.driver_id
    and race_aggregates.constructor_id = qualifying_aggregates.constructor_id
