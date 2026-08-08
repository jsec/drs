with
    season_constructors as (select * from {{ ref("stg_f1db__season_constructor_standing") }}),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    race_results as (select * from {{ ref("race_results") }}),

    sprint_results as (select * from {{ ref("sprint_results") }}),

    qualifying_results as (select * from {{ ref("qualifying_results") }}),

    race_aggregates as (
        select
            season,
            constructor_id,
            count(*)::integer as race_entry_count,
            count(*) filter (where is_start)::integer as race_start_count,
            count(*) filter (where is_win)::integer as win_count,
            count(*) filter (where is_podium)::integer as podium_count,
            count(*) filter (where is_fastest_lap)::integer as fastest_lap_count,
            sum(points) as race_points
        from race_results
        group by season, constructor_id
    ),

    sprint_aggregates as (
        select
            season,
            constructor_id,
            count(*)::integer as sprint_entry_count,
            count(*) filter (where is_start)::integer as sprint_start_count,
            sum(points) as sprint_points
        from sprint_results
        group by season, constructor_id
    ),

    qualifying_aggregates as (
        select
            season,
            constructor_id,
            count(*)::integer as qualifying_entry_count,
            count(qualifying_position)::integer as qualifying_position_count,
            count(*) filter (where is_qualifying_p1)::integer as qualifying_p1_count,
            avg(qualifying_position)::numeric(6, 2) as average_qualifying_position
        from qualifying_results
        group by season, constructor_id
    )

select
    season_constructors.season,
    season_constructors.position_display_order as final_order,
    season_constructors.constructor_id,
    constructors.constructor_name,
    season_constructors.engine_manufacturer_id,
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
    season_constructors.position_number as final_position,
    season_constructors.position_text as final_position_text,
    season_constructors.points as final_points,
    (season_constructors.points * 100)::integer as final_points_x100,
    season_constructors.championship_won,
    (coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0))
    - season_constructors.points as points_delta,
    (
        (
            (coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0))
            - season_constructors.points
        )
        * 100
    )::integer as points_delta_x100,
    {{ var("refresh_id") }}::bigint as refresh_id
from season_constructors
join constructors on season_constructors.constructor_id = constructors.constructor_id
left join
    race_aggregates
    on season_constructors.season = race_aggregates.season
    and season_constructors.constructor_id = race_aggregates.constructor_id
left join
    sprint_aggregates
    on season_constructors.season = sprint_aggregates.season
    and season_constructors.constructor_id = sprint_aggregates.constructor_id
left join
    qualifying_aggregates
    on season_constructors.season = qualifying_aggregates.season
    and season_constructors.constructor_id = qualifying_aggregates.constructor_id
