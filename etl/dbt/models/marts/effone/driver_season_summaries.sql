with
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
        select season, driver_id, constructor_id, car_number, race_date, race_round, 2 as event_order, finish_order
        from race_results
        union all
        select season, driver_id, constructor_id, car_number, race_date, race_round, 1 as event_order, finish_order
        from sprint_results
    ),

    last_entry as (
        select distinct on (season, driver_id) season, driver_id, constructor_id, car_number
        from race_events
        order by season, driver_id, race_date desc, race_round desc, event_order desc, finish_order
    ),

    latest_standings as (
        select distinct on (season, driver_id) season, driver_id, points, position_text
        from driver_standings
        order by season, driver_id, race_round desc, race_id desc
    )

select
    driver_seasons.season,
    driver_seasons.driver_id,
    last_entry.constructor_id,
    last_entry.car_number,
    coalesce(race_aggregates.win_count, 0) as win_count,
    coalesce(race_aggregates.podium_count, 0) as podium_count,
    coalesce(qualifying_aggregates.qualifying_p1_count, 0) as qualifying_p1_count,
    latest_standings.position_text as final_position_text,
    coalesce(latest_standings.points, 0) as final_points
from driver_seasons
left join
    race_aggregates
    on driver_seasons.season = race_aggregates.season
    and driver_seasons.driver_id = race_aggregates.driver_id
left join
    qualifying_aggregates
    on driver_seasons.season = qualifying_aggregates.season
    and driver_seasons.driver_id = qualifying_aggregates.driver_id
left join last_entry on driver_seasons.season = last_entry.season and driver_seasons.driver_id = last_entry.driver_id
left join
    latest_standings
    on driver_seasons.season = latest_standings.season
    and driver_seasons.driver_id = latest_standings.driver_id
