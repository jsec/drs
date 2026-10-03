with
    race_results as (select * from {{ ref("race_results") }}),

    qualifying_results as (select * from {{ ref("qualifying_results") }}),

    standings as (
        select distinct on (season, constructor_id, engine_manufacturer_id) *
        from {{ ref("stg_f1db__season_constructor_standing") }}
        order by season, constructor_id, engine_manufacturer_id, position_display_order
    ),

    engine_manufacturers as (select * from {{ ref("stg_f1db__engine_manufacturer") }}),

    race_aggregates as (
        select
            season,
            constructor_id,
            engine_manufacturer_id,
            count(*) filter (where is_start)::integer as start_count,
            count(*) filter (where is_win)::integer as win_count,
            count(*) filter (where is_podium)::integer as podium_count
        from race_results
        group by season, constructor_id, engine_manufacturer_id
    ),

    pole_aggregates as (
        select
            season,
            constructor_id,
            engine_manufacturer_id,
            count(*) filter (where is_qualifying_p1)::integer as pole_count
        from qualifying_results
        group by season, constructor_id, engine_manufacturer_id
    )

select
    race_aggregates.season,
    race_aggregates.constructor_id,
    race_aggregates.engine_manufacturer_id,
    engine_manufacturers.engine_manufacturer_name,
    race_aggregates.start_count,
    race_aggregates.win_count,
    race_aggregates.podium_count,
    coalesce(pole_aggregates.pole_count, 0) as pole_count,
    standings.position_text as final_position_text,
    standings.points as final_points,
    coalesce(standings.championship_won, false) as championship_won
from race_aggregates
join engine_manufacturers on race_aggregates.engine_manufacturer_id = engine_manufacturers.engine_manufacturer_id
left join
    pole_aggregates
    on race_aggregates.season = pole_aggregates.season
    and race_aggregates.constructor_id = pole_aggregates.constructor_id
    and race_aggregates.engine_manufacturer_id = pole_aggregates.engine_manufacturer_id
left join
    standings
    on race_aggregates.season = standings.season
    and race_aggregates.constructor_id = standings.constructor_id
    and race_aggregates.engine_manufacturer_id = standings.engine_manufacturer_id
