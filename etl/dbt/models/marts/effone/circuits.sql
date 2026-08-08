with
    circuits as (select * from {{ ref("int_f1db__circuits_with_countries") }}),

    circuit_races as (
        select circuit_id, race_id, race_official_name, race_date from {{ ref("int_f1db__races_with_circuits") }}
    ),

    first_last_races as (
        select distinct
            circuit_id,
            first_value(race_id) over first_race as first_race_id,
            first_value(race_official_name) over first_race as first_race_name,
            first_value(race_date) over first_race as first_race_date,
            first_value(race_id) over last_race as last_race_id,
            first_value(race_official_name) over last_race as last_race_name,
            first_value(race_date) over last_race as last_race_date
        from circuit_races
        window
            first_race as (partition by circuit_id order by race_date, race_id),
            last_race as (partition by circuit_id order by race_date desc, race_id desc)
    )

select
    circuits.circuit_id,
    circuits.circuit_name,
    circuits.circuit_full_name,
    circuits.previous_names,
    circuits.circuit_type,
    circuits.direction,
    circuits.place_name as location,
    circuits.country_id,
    circuits.country,
    circuits.latitude,
    circuits.longitude,
    circuits.length_km,
    circuits.turns,
    circuits.total_races_held as race_count,
    first_last_races.first_race_id,
    first_last_races.first_race_name,
    first_last_races.first_race_date,
    first_last_races.last_race_id,
    first_last_races.last_race_name,
    first_last_races.last_race_date,
    {{ var("refresh_id") }}::bigint as refresh_id
from circuits
left join first_last_races on circuits.circuit_id = first_last_races.circuit_id
