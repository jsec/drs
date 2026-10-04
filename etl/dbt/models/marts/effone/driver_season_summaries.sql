with
    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    race_results as (select * from {{ ref("race_results") }}),

    sprint_results as (select * from {{ ref("sprint_results") }}),

    driver_standings as (select * from {{ ref("driver_standings_snapshots") }}),

    driver_seasons as (
        select season, driver_id
        from race_results
        union
        select season, driver_id
        from sprint_results
    ),

    {{ season_aggregates(["season", "driver_id"]) }},

    race_events as (
        select season, driver_id, constructor_id, race_date, race_round, 2 as event_order
        from race_results
        union all
        select season, driver_id, constructor_id, race_date, race_round, 1 as event_order
        from sprint_results
    ),

    last_constructor as (
        select distinct on (season, driver_id) season, driver_id, constructor_id
        from race_events
        order by season, driver_id, race_date desc, race_round desc, event_order desc
    ),

    latest_standings as (
        select distinct on (season, driver_id) season, driver_id, points, position, position_text, championship_won
        from driver_standings
        order by season, driver_id, race_round desc, race_id desc
    )

select
    driver_seasons.season,
    driver_seasons.driver_id,
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
    coalesce(sprint_aggregates.sprint_points, 0) as sprint_points,
    coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0) as total_points,
    latest_standings.position as final_position,
    latest_standings.position_text as final_position_text,
    coalesce(latest_standings.points, 0) as final_points,
    coalesce(latest_standings.championship_won, false) as championship_won,
    (coalesce(race_aggregates.race_points, 0) + coalesce(sprint_aggregates.sprint_points, 0))
    - coalesce(latest_standings.points, 0) as points_delta
from driver_seasons
join drivers on driver_seasons.driver_id = drivers.driver_id
left join
    race_aggregates
    on driver_seasons.season = race_aggregates.season
    and driver_seasons.driver_id = race_aggregates.driver_id
left join
    sprint_aggregates
    on driver_seasons.season = sprint_aggregates.season
    and driver_seasons.driver_id = sprint_aggregates.driver_id
left join
    qualifying_aggregates
    on driver_seasons.season = qualifying_aggregates.season
    and driver_seasons.driver_id = qualifying_aggregates.driver_id
left join
    last_constructor
    on driver_seasons.season = last_constructor.season
    and driver_seasons.driver_id = last_constructor.driver_id
left join
    latest_standings
    on driver_seasons.season = latest_standings.season
    and driver_seasons.driver_id = latest_standings.driver_id
