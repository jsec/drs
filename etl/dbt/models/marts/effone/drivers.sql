with
    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    driver_races as (
        select driver_id, race_id, race_official_name, race_date from {{ ref("int_f1db__race_results_with_entities") }}
    ),

    first_last_races as (
        select distinct
            driver_id,
            first_value(race_id) over first_race as first_race_id,
            first_value(race_official_name) over first_race as first_race_name,
            first_value(race_date) over first_race as first_race_date,
            first_value(race_id) over last_race as last_race_id,
            first_value(race_official_name) over last_race as last_race_name,
            first_value(race_date) over last_race as last_race_date
        from driver_races
        window
            first_race as (partition by driver_id order by race_date, race_id),
            last_race as (partition by driver_id order by race_date desc, race_id desc)
    )

select
    drivers.driver_id,
    drivers.driver_code,
    drivers.driver_number,
    drivers.first_name,
    drivers.last_name,
    drivers.driver_name,
    drivers.driver_full_name,
    drivers.gender,
    drivers.date_of_birth,
    drivers.date_of_death,
    drivers.place_of_birth,
    drivers.country_of_birth_country_id as country_of_birth_id,
    drivers.nationality_country_id,
    drivers.nationality_country_code,
    drivers.nationality,
    drivers.second_nationality_country_id,
    drivers.second_nationality_country_code,
    drivers.total_race_entries as entry_count,
    drivers.total_race_starts as start_count,
    drivers.total_race_entries as race_entry_count,
    drivers.total_sprint_race_starts as sprint_entry_count,
    drivers.total_race_starts as race_start_count,
    drivers.total_sprint_race_starts as sprint_start_count,
    drivers.total_race_wins as win_count,
    drivers.total_podiums as podium_count,
    drivers.total_fastest_laps as fastest_lap_count,
    drivers.total_race_entries as qualifying_entry_count,
    drivers.total_pole_positions as qualifying_p1_count,
    drivers.total_championship_wins as championship_count,
    drivers.total_points,
    (drivers.total_points * 100)::integer as total_points_x100,
    first_last_races.first_race_id,
    first_last_races.first_race_name,
    first_last_races.first_race_date,
    first_last_races.last_race_id,
    first_last_races.last_race_name,
    first_last_races.last_race_date,
    {{ var("refresh_id") }}::bigint as refresh_id
from drivers
left join first_last_races on drivers.driver_id = first_last_races.driver_id
