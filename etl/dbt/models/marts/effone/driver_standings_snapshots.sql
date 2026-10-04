with
    standings as (select * from {{ ref("stg_f1db__race_driver_standing") }}),

    races as (select * from {{ ref("stg_f1db__race") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }})

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
    standings.championship_won
from standings
join races on standings.race_id = races.race_id
join drivers on standings.driver_id = drivers.driver_id
