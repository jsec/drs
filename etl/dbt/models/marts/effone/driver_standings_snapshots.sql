with
    standings as (select * from {{ ref("stg_f1db__race_driver_standing") }}),

    races as (select * from {{ ref("int_f1db__races_with_circuits") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    race_results as (
        select distinct on (season, race_id, driver_id)
            season,
            race_id,
            race_round,
            driver_id,
            constructor_id,
            car_number,
            is_win,
            is_podium
        from {{ ref("race_results") }}
        order by season, race_id, driver_id, finish_order
    ),

    race_cumulative_stats as (
        select
            race_results.*,
            (sum(is_win::integer) over driver_order)::integer as win_count,
            (sum(is_podium::integer) over driver_order)::integer as podium_count
        from race_results
        window driver_order as (
            partition by driver_id, season
            order by race_round, race_id
            rows between unbounded preceding and current row
        )
    ),

    qualifying_results as (
        select distinct on (season, race_id, driver_id)
            season, race_id, race_round, driver_id, is_qualifying_p1
        from {{ ref("qualifying_results") }}
        order by season, race_id, driver_id, qualifying_order
    ),

    qualifying_cumulative_stats as (
        select
            qualifying_results.*,
            (sum(is_qualifying_p1::integer) over driver_order)::integer as qualifying_p1_count
        from qualifying_results
        window driver_order as (
            partition by driver_id, season
            order by race_round, race_id
            rows between unbounded preceding and current row
        )
    ),

    joined as (
        select
            races.season,
            races.race_round,
            standings.race_id,
            standings.driver_id,
            drivers.driver_name,
            drivers.driver_code,
            standings.points,
            standings.position_number as position,
            standings.position_text,
            standings.championship_won,
            race_results.constructor_id,
            lag(standings.points) over driver_order as previous_points,
            lag(standings.position_number) over driver_order as previous_position
        from standings
        join races on standings.race_id = races.race_id
        join drivers on standings.driver_id = drivers.driver_id
        left join race_results on standings.race_id = race_results.race_id and standings.driver_id = race_results.driver_id
        window driver_order as (partition by standings.driver_id, races.season order by races.race_round, races.race_id)
    ),

    standing_states as (
        select
            joined.*,
            max(race_round) filter (where constructor_id is not null) over driver_order as latest_entry_round
        from joined
        window driver_order as (
            partition by driver_id, season
            order by race_round, race_id
            rows between unbounded preceding and current row
        )
    ),

    standing_qualifying_states as (
        select distinct on (standing_states.season, standing_states.race_id, standing_states.driver_id)
            standing_states.*,
            coalesce(qualifying_cumulative_stats.qualifying_p1_count, 0) as qualifying_p1_count
        from standing_states
        left join
            qualifying_cumulative_stats
            on standing_states.season = qualifying_cumulative_stats.season
            and standing_states.driver_id = qualifying_cumulative_stats.driver_id
            and qualifying_cumulative_stats.race_round <= standing_states.race_round
        order by
            standing_states.season,
            standing_states.race_id,
            standing_states.driver_id,
            qualifying_cumulative_stats.race_round desc nulls last,
            qualifying_cumulative_stats.race_id desc
    )

select
    standing_qualifying_states.season,
    standing_qualifying_states.race_round,
    standing_qualifying_states.race_id,
    standing_qualifying_states.driver_id,
    standing_qualifying_states.driver_name,
    standing_qualifying_states.driver_code,
    latest_entry.constructor_id,
    latest_entry.car_number,
    standing_qualifying_states.points,
    (standing_qualifying_states.points * 100)::integer as points_x100,
    standing_qualifying_states.previous_points,
    (standing_qualifying_states.previous_points * 100)::integer as previous_points_x100,
    standing_qualifying_states.points - standing_qualifying_states.previous_points as points_gained,
    ((standing_qualifying_states.points - standing_qualifying_states.previous_points) * 100)::integer as points_gained_x100,
    standing_qualifying_states.position,
    standing_qualifying_states.position_text,
    standing_qualifying_states.previous_position,
    standing_qualifying_states.previous_position - standing_qualifying_states.position as position_change,
    coalesce(latest_entry.win_count, 0) as win_count,
    coalesce(latest_entry.podium_count, 0) as podium_count,
    standing_qualifying_states.qualifying_p1_count,
    standing_qualifying_states.championship_won,
    {{ var("refresh_id") }}::bigint as refresh_id
from standing_qualifying_states
left join
    race_cumulative_stats as latest_entry
    on standing_qualifying_states.season = latest_entry.season
    and standing_qualifying_states.driver_id = latest_entry.driver_id
    and standing_qualifying_states.latest_entry_round = latest_entry.race_round
