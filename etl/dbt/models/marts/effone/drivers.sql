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
    drivers.last_name,
    drivers.driver_name,
    drivers.date_of_birth,
    drivers.nationality_country_code,
    drivers.nationality,
    drivers.total_race_starts as start_count,
    drivers.total_race_wins as win_count,
    drivers.total_podiums as podium_count,
    drivers.total_pole_positions as qualifying_p1_count,
    drivers.total_championship_wins as championship_count,
    first_last_races.first_race_date,
    first_last_races.last_race_date
from drivers
left join first_last_races on drivers.driver_id = first_last_races.driver_id
