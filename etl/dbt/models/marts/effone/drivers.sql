with
    drivers as (select * from {{ ref("int_f1db__drivers_with_countries") }}),

    first_last_races as (
        select driver_id, min(race_date) as first_race_date, max(race_date) as last_race_date
        from {{ ref("race_results") }}
        group by driver_id
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
    first_last_races.first_race_date,
    first_last_races.last_race_date
from drivers
left join first_last_races on drivers.driver_id = first_last_races.driver_id
