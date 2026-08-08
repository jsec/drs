with
    race_results as (select * from {{ ref("stg_f1db__race_result") }}),

    races as (select * from {{ ref("int_f1db__races_with_circuits") }}),

    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }})

select
    race_results.*,
    races.season,
    races.race_round,
    races.race_date,
    races.race_official_name,
    races.circuit_id,
    races.circuit_name,
    races.circuit_country,
    drivers.driver_name,
    drivers.driver_full_name,
    drivers.driver_code,
    drivers.nationality as driver_nationality,
    constructors.constructor_name,
    constructors.constructor_full_name,
    constructors.constructor_nationality
from race_results
join races on race_results.race_id = races.race_id
join drivers on race_results.driver_id = drivers.driver_id
join constructors on race_results.constructor_id = constructors.constructor_id
