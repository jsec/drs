with
    standings as (select * from {{ ref("stg_f1db__race_driver_standing") }}),

    races as (select * from {{ ref("int_f1db__races_with_circuits") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

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
            lag(standings.points) over driver_order as previous_points,
            lag(standings.position_number) over driver_order as previous_position
        from standings
        join races on standings.race_id = races.race_id
        join drivers on standings.driver_id = drivers.driver_id
        window driver_order as (partition by standings.driver_id, races.season order by races.race_round)
    )

select
    season,
    race_round,
    race_id,
    driver_id,
    driver_name,
    driver_code,
    points,
    (points * 100)::integer as points_x100,
    previous_points,
    (previous_points * 100)::integer as previous_points_x100,
    points - previous_points as points_gained,
    ((points - previous_points) * 100)::integer as points_gained_x100,
    position,
    position_text,
    previous_position,
    previous_position - position as position_change,
    championship_won,
    {{ var("refresh_id") }}::bigint as refresh_id
from joined
