with
    seasons as (select * from {{ ref("stg_f1db__season") }}),

    races as (select * from {{ ref("stg_f1db__race") }}),

    driver_standings as (select * from {{ ref("stg_f1db__season_driver_standing") }}),

    constructor_standings as (select * from {{ ref("stg_f1db__season_constructor_standing") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    race_counts as (select season, count(*)::integer as race_count from races group by season),

    constructor_counts as (
        select season, count(distinct constructor_id)::integer as constructor_count
        from {{ ref("race_results") }}
        group by season
    ),

    wdc as (
        select driver_standings.season, driver_standings.driver_id, drivers.driver_name
        from driver_standings
        join drivers on driver_standings.driver_id = drivers.driver_id
        where driver_standings.position_display_order = 1
    ),

    wcc as (
        select constructor_standings.season, constructor_standings.constructor_id, constructors.constructor_name
        from constructor_standings
        join constructors on constructor_standings.constructor_id = constructors.constructor_id
        where constructor_standings.position_display_order = 1
    )

select
    seasons.season,
    coalesce(race_counts.race_count, 0) as race_count,
    coalesce(constructor_counts.constructor_count, 0) as constructor_count,
    wdc.driver_id as wdc_driver_id,
    wdc.driver_name as wdc_driver_name,
    wcc.constructor_id as wcc_constructor_id,
    wcc.constructor_name as wcc_constructor_name
from seasons
left join race_counts on seasons.season = race_counts.season
left join constructor_counts on seasons.season = constructor_counts.season
left join wdc on seasons.season = wdc.season
left join wcc on seasons.season = wcc.season
