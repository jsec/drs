with

    drivers as (select * from {{ ref("drivers") }}),

    constructors as (select * from {{ ref("constructors") }}),

    {{ season_aggregates(["season", "driver_id", "constructor_id"]) }}

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
    coalesce(sprint_aggregates.sprint_points, 0) as sprint_points,
    coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0) as total_points
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
