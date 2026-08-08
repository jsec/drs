with
    races as (select * from {{ ref("int_f1db__races_with_circuits") }}),

    race_winners as (select * from {{ ref("int_f1db__race_results_with_entities") }} where position_display_order = 1),

    pole_sitters as (
        select * from {{ ref("int_f1db__qualifying_results_with_entities") }} where position_display_order = 1
    ),

    sprint_winners as (
        select * from {{ ref("int_f1db__sprint_results_with_entities") }} where position_display_order = 1
    )

select
    races.race_id,
    races.season,
    races.race_round,
    races.grand_prix_name as race_name,
    races.race_official_name,
    races.race_date,
    races.race_time,
    races.grand_prix_id,
    races.grand_prix_name,
    races.circuit_id,
    races.circuit_layout_id,
    races.circuit_type,
    races.direction,
    races.course_length_km,
    races.turns,
    races.scheduled_laps,
    races.scheduled_distance_km,
    races.race_laps,
    races.race_distance_km,
    races.qualifying_format,
    races.sprint_qualifying_format,
    races.free_practice_1_date as fp1_date,
    races.free_practice_1_time as fp1_time,
    races.free_practice_2_date as fp2_date,
    races.free_practice_2_time as fp2_time,
    races.free_practice_3_date as fp3_date,
    races.free_practice_3_time as fp3_time,
    races.qualifying_date,
    races.qualifying_time,
    races.sprint_qualifying_date,
    races.sprint_qualifying_time,
    races.sprint_race_date as sprint_date,
    races.sprint_race_time as sprint_time,
    race_winners.driver_id as winner_driver_id,
    race_winners.driver_name as winner_driver_name,
    race_winners.constructor_id as winner_constructor_id,
    race_winners.constructor_name as winner_constructor_name,
    pole_sitters.driver_id as pole_driver_id,
    pole_sitters.driver_name as pole_driver_name,
    sprint_winners.driver_id as sprint_winner_driver_id,
    sprint_winners.driver_name as sprint_winner_driver_name,
    sprint_winners.constructor_id as sprint_winner_constructor_id,
    sprint_winners.constructor_name as sprint_winner_constructor_name,
    {{ var("refresh_id") }}::bigint as refresh_id
from races
left join race_winners on races.race_id = race_winners.race_id
left join pole_sitters on races.race_id = pole_sitters.race_id
left join sprint_winners on races.race_id = sprint_winners.race_id
