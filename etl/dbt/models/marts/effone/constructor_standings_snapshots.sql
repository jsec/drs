with
    standings as (select * from {{ ref("stg_f1db__race_constructor_standing") }}),

    races as (select * from {{ ref("stg_f1db__race") }}),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    engine_manufacturers as (select * from {{ ref("stg_f1db__engine_manufacturer") }})

select
    races.season,
    races.race_round,
    standings.race_id,
    standings.constructor_id,
    constructors.constructor_name,
    standings.engine_manufacturer_id,
    engine_manufacturers.engine_manufacturer_name,
    standings.points,
    standings.position_number as position,
    standings.position_text
from standings
join races on standings.race_id = races.race_id
join constructors on standings.constructor_id = constructors.constructor_id
join engine_manufacturers on standings.engine_manufacturer_id = engine_manufacturers.engine_manufacturer_id
