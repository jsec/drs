with
    races as (select * from {{ ref("stg_f1db__race") }}),

    grands_prix as (select * from {{ ref("stg_f1db__grand_prix") }}),

    race_winners as (select * from {{ ref("race_results") }} where finish_order = 1),

    pole_sitters as (select * from {{ ref("qualifying_results") }} where qualifying_order = 1)

select
    races.race_id,
    races.season,
    races.race_round,
    grands_prix.grand_prix_name as race_name,
    races.race_official_name,
    races.race_date,
    grands_prix.grand_prix_code,
    races.circuit_id,
    races.circuit_layout_id,
    races.race_laps,
    race_winners.driver_id as winner_driver_id,
    race_winners.driver_name as winner_driver_name,
    race_winners.driver_code as winner_driver_code,
    race_winners.constructor_id as winner_constructor_id,
    race_winners.constructor_name as winner_constructor_name,
    pole_sitters.driver_id as pole_driver_id
from races
join grands_prix on races.grand_prix_id = grands_prix.grand_prix_id
left join race_winners on races.race_id = race_winners.race_id
left join pole_sitters on races.race_id = pole_sitters.race_id
