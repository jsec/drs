with
    races as (select * from {{ ref("stg_f1db__race") }}),

    circuits as (select * from {{ ref("int_f1db__circuits_with_countries") }}),

    grands_prix as (select * from {{ ref("stg_f1db__grand_prix") }})

select
    races.*,
    grands_prix.grand_prix_name,
    grands_prix.grand_prix_full_name,
    grands_prix.grand_prix_short_name,
    circuits.circuit_name,
    circuits.circuit_full_name,
    circuits.country_id as circuit_country_id,
    circuits.country as circuit_country,
    circuits.place_name as circuit_location,
    circuits.latitude as circuit_latitude,
    circuits.longitude as circuit_longitude
from races
join circuits on races.circuit_id = circuits.circuit_id
join grands_prix on races.grand_prix_id = grands_prix.grand_prix_id
