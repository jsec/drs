with
    standings as (
        select distinct on (season, constructor_id, engine_manufacturer_id) *
        from {{ ref("stg_f1db__season_constructor_standing") }}
        order by season, constructor_id, engine_manufacturer_id, position_display_order
    ),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    engine_manufacturers as (select * from {{ ref("stg_f1db__engine_manufacturer") }}),

    race_results as (select * from {{ ref("race_results") }}),

    sprint_results as (select * from {{ ref("sprint_results") }}),

    qualifying_results as (select * from {{ ref("qualifying_results") }}),

    race_aggregates as (
        select
            season,
            constructor_id,
            engine_manufacturer_id,
            count(*)::integer as race_entry_count,
            count(*) filter (where is_start)::integer as race_start_count,
            count(*) filter (where is_win)::integer as win_count,
            count(*) filter (where is_podium)::integer as podium_count,
            count(*) filter (where is_dnf)::integer as dnf_count,
            count(*) filter (where is_fastest_lap)::integer as fastest_lap_count,
            sum(points) as race_points
        from race_results
        group by season, constructor_id, engine_manufacturer_id
    ),

    sprint_aggregates as (
        select
            season,
            constructor_id,
            engine_manufacturer_id,
            count(*)::integer as sprint_entry_count,
            count(*) filter (where is_start)::integer as sprint_start_count,
            sum(points) as sprint_points
        from sprint_results
        group by season, constructor_id, engine_manufacturer_id
    ),

    qualifying_aggregates as (
        select
            season,
            constructor_id,
            engine_manufacturer_id,
            count(*)::integer as qualifying_entry_count,
            count(qualifying_position)::integer as qualifying_position_count,
            count(*) filter (where is_qualifying_p1)::integer as qualifying_p1_count,
            avg(qualifying_position)::numeric(6, 2) as average_qualifying_position
        from qualifying_results
        group by season, constructor_id, engine_manufacturer_id
    )

select
    race_aggregates.season,
    standings.position_display_order as final_order,
    race_aggregates.constructor_id,
    constructors.constructor_name,
    race_aggregates.engine_manufacturer_id,
    engine_manufacturers.engine_manufacturer_name,
    race_aggregates.race_entry_count + coalesce(sprint_aggregates.sprint_entry_count, 0) as entry_count,
    race_aggregates.race_start_count + coalesce(sprint_aggregates.sprint_start_count, 0) as start_count,
    race_aggregates.race_entry_count,
    coalesce(sprint_aggregates.sprint_entry_count, 0) as sprint_entry_count,
    race_aggregates.race_start_count,
    coalesce(sprint_aggregates.sprint_start_count, 0) as sprint_start_count,
    race_aggregates.win_count,
    race_aggregates.podium_count,
    race_aggregates.dnf_count,
    race_aggregates.fastest_lap_count,
    coalesce(qualifying_aggregates.qualifying_entry_count, 0) as qualifying_entry_count,
    coalesce(qualifying_aggregates.qualifying_position_count, 0) as qualifying_position_count,
    coalesce(qualifying_aggregates.qualifying_p1_count, 0) as qualifying_p1_count,
    qualifying_aggregates.average_qualifying_position,
    race_aggregates.race_points,
    coalesce(sprint_aggregates.sprint_points, 0) as sprint_points,
    race_aggregates.race_points + coalesce(sprint_aggregates.sprint_points, 0) as total_points,
    standings.position_number as final_position,
    standings.position_text as final_position_text,
    standings.points as final_points,
    coalesce(standings.championship_won, false) as championship_won,
    race_aggregates.race_points + coalesce(sprint_aggregates.sprint_points, 0) - standings.points as points_delta
from race_aggregates
join constructors on race_aggregates.constructor_id = constructors.constructor_id
join engine_manufacturers on race_aggregates.engine_manufacturer_id = engine_manufacturers.engine_manufacturer_id
left join
    standings
    on race_aggregates.season = standings.season
    and race_aggregates.constructor_id = standings.constructor_id
    and race_aggregates.engine_manufacturer_id = standings.engine_manufacturer_id
left join
    sprint_aggregates
    on race_aggregates.season = sprint_aggregates.season
    and race_aggregates.constructor_id = sprint_aggregates.constructor_id
    and race_aggregates.engine_manufacturer_id = sprint_aggregates.engine_manufacturer_id
left join
    qualifying_aggregates
    on race_aggregates.season = qualifying_aggregates.season
    and race_aggregates.constructor_id = qualifying_aggregates.constructor_id
    and race_aggregates.engine_manufacturer_id = qualifying_aggregates.engine_manufacturer_id
