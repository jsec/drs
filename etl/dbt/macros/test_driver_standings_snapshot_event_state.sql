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

        latest_entries as (
            select
                standings.season,
                standings.race_id,
                standings.driver_id,
                race_results.constructor_id,
                race_results.car_number
            from standings
            left join
                lateral(
                    select constructor_id, car_number
                    from race_results
                    where
                        standings.season = race_results.season
                        and standings.driver_id = race_results.driver_id
                        and race_results.race_round <= standings.race_round
                    order by race_results.race_round desc, race_results.race_id desc
                    limit 1
                ) as race_results
                on true
        ),

        cumulative_race_stats as (
            select
                standings.season,
                standings.race_id,
                standings.driver_id,
                coalesce(sum(race_results.is_win::integer), 0)::integer as win_count,
                coalesce(sum(race_results.is_podium::integer), 0)::integer as podium_count
            from standings
            left join
                race_results
                on standings.season = race_results.season
                and standings.driver_id = race_results.driver_id
                and race_results.race_round <= standings.race_round
            group by standings.season, standings.race_id, standings.driver_id
        ),

        cumulative_qualifying_stats as (
            select
                standings.season,
                standings.race_id,
                standings.driver_id,
                coalesce(sum(qualifying_results.is_qualifying_p1::integer), 0)::integer as qualifying_p1_count
            from standings
            left join
                qualifying_results
                on standings.season = qualifying_results.season
                and standings.driver_id = qualifying_results.driver_id
                and qualifying_results.race_round <= standings.race_round
            group by standings.season, standings.race_id, standings.driver_id
        ),

        expected as (
            select
                latest_entries.season,
                latest_entries.race_id,
                latest_entries.driver_id,
                latest_entries.constructor_id,
                latest_entries.car_number,
                cumulative_race_stats.win_count,
                cumulative_race_stats.podium_count,
                cumulative_qualifying_stats.qualifying_p1_count
            from latest_entries
            join cumulative_race_stats using (season, race_id, driver_id)
            join cumulative_qualifying_stats using (season, race_id, driver_id)
        )

    select snapshots.*
    from {{ model }} as snapshots
    join expected using (season, race_id, driver_id)
    where
        snapshots.constructor_id is distinct from expected.constructor_id
        or snapshots.car_number is distinct from expected.car_number
        or snapshots.win_count is distinct from expected.win_count
        or snapshots.podium_count is distinct from expected.podium_count
        or snapshots.qualifying_p1_count is distinct from expected.qualifying_p1_count
{% endtest %}
