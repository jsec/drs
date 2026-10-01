{% test driver_standings_snapshot_event_state(model) %}
    with
        standings as (
            select season, race_id, race_round, driver_id
            from {{ ref("stg_f1db__race_driver_standing") }}
            join {{ ref("int_f1db__races_with_circuits") }} using (race_id)
        ),

        race_results as (
            select distinct
                on (season, race_id, driver_id)
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

        qualifying_results as (
            select distinct on (season, race_id, driver_id) season, race_id, race_round, driver_id, is_qualifying_p1
            from {{ ref("qualifying_results") }}
            order by season, race_id, driver_id, qualifying_order
        ),

        timeline as (
            select
                season,
                race_round,
                race_id,
                driver_id,
                standings.driver_id is not null as has_standing,
                race_results.constructor_id,
                race_results.car_number,
                coalesce(race_results.is_win::integer, 0) as win,
                coalesce(race_results.is_podium::integer, 0) as podium,
                coalesce(qualifying_results.is_qualifying_p1::integer, 0) as qualifying_p1
            from standings
            full join race_results using (season, race_id, race_round, driver_id)
            full join qualifying_results using (season, race_id, race_round, driver_id)
        ),

        running as (
            select
                *,
                sum(win) over driver_season as win_count,
                sum(podium) over driver_season as podium_count,
                sum(qualifying_p1) over driver_season as qualifying_p1_count,
                -- increments at each race result, grouping later rows with the latest entry
                count(constructor_id) over driver_season as entry_group
            from timeline
            window driver_season as (partition by season, driver_id order by race_round, race_id)
        ),

        expected as (
            select
                season,
                race_id,
                driver_id,
                has_standing,
                win_count::integer as win_count,
                podium_count::integer as podium_count,
                qualifying_p1_count::integer as qualifying_p1_count,
                first_value(constructor_id) over latest_entry as constructor_id,
                first_value(car_number) over latest_entry as car_number
            from running
            window latest_entry as (partition by season, driver_id, entry_group order by race_round, race_id)
        )

    select snapshots.*
    from {{ model }} as snapshots
    join expected using (season, race_id, driver_id)
    where
        expected.has_standing
        and (
            snapshots.constructor_id is distinct from expected.constructor_id
            or snapshots.car_number is distinct from expected.car_number
            or snapshots.win_count is distinct from expected.win_count
            or snapshots.podium_count is distinct from expected.podium_count
            or snapshots.qualifying_p1_count is distinct from expected.qualifying_p1_count
        )
{% endtest %}
