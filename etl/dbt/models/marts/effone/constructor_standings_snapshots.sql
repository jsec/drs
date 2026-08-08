with
    standings as (select * from {{ ref("stg_f1db__race_constructor_standing") }}),

    races as (select * from {{ ref("int_f1db__races_with_circuits") }}),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    joined as (
        select
            races.season,
            races.race_round,
            standings.race_id,
            standings.constructor_id,
            constructors.constructor_name,
            standings.engine_manufacturer_id,
            standings.points,
            standings.position_number as position,
            standings.position_text,
            standings.championship_won,
            lag(standings.points) over constructor_order as previous_points,
            lag(standings.position_number) over constructor_order as previous_position
        from standings
        join races on standings.race_id = races.race_id
        join constructors on standings.constructor_id = constructors.constructor_id
        window
            constructor_order as (
                partition by standings.constructor_id, standings.engine_manufacturer_id, races.season
                order by races.race_round
            )
    )

select
    season,
    race_round,
    race_id,
    constructor_id,
    constructor_name,
    engine_manufacturer_id,
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
