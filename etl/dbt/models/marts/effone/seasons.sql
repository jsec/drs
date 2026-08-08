with
    seasons as (select * from {{ ref("stg_f1db__season") }}),

    races as (select * from {{ ref("int_f1db__races_with_circuits") }}),

    driver_standings as (select * from {{ ref("stg_f1db__season_driver_standing") }}),

    constructor_standings as (select * from {{ ref("stg_f1db__season_constructor_standing") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    race_counts as (
        select
            season,
            count(*)::integer as race_count,
            count(*) filter (where sprint_race_date is not null)::integer as sprint_count,
            min(race_date) as first_race_date,
            max(race_date) as last_race_date
        from races
        group by season
    ),

    driver_counts as (
        select season, count(distinct driver_id)::integer as driver_count
        from {{ ref("int_f1db__race_results_with_entities") }}
        group by season
    ),

    constructor_counts as (
        select season, count(distinct constructor_id)::integer as constructor_count
        from {{ ref("int_f1db__race_results_with_entities") }}
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
    coalesce(race_counts.sprint_count, 0) as sprint_count,
    coalesce(driver_counts.driver_count, 0) as driver_count,
    coalesce(constructor_counts.constructor_count, 0) as constructor_count,
    race_counts.first_race_date,
    race_counts.last_race_date,
    wdc.driver_id as wdc_driver_id,
    wdc.driver_name as wdc_driver_name,
    wcc.constructor_id as wcc_constructor_id,
    wcc.constructor_name as wcc_constructor_name,
    {{ var("refresh_id") }}::bigint as refresh_id
from seasons
left join race_counts on seasons.season = race_counts.season
left join driver_counts on seasons.season = driver_counts.season
left join constructor_counts on seasons.season = constructor_counts.season
left join wdc on seasons.season = wdc.season
left join wcc on seasons.season = wcc.season
