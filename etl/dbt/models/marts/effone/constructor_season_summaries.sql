with
    standings as (
        select distinct on (season, constructor_id, engine_manufacturer_id) *
        from {{ ref("stg_f1db__season_constructor_standing") }}
        order by season, constructor_id, engine_manufacturer_id, position_display_order
    ),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    engine_manufacturers as (select * from {{ ref("stg_f1db__engine_manufacturer") }}),

    {{ season_aggregates(["season", "constructor_id", "engine_manufacturer_id"]) }}

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
