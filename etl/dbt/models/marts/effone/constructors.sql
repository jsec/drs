with
    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    first_last_races as (
        select constructor_id, min(race_date) as first_race_date, max(race_date) as last_race_date
        from {{ ref("race_results") }}
        group by constructor_id
    ),

    constructor_branding as (select * from {{ ref("constructor_branding") }})

select
    constructors.constructor_id,
    constructors.constructor_name,
    constructors.constructor_full_name,
    constructors.constructor_country_code as country_code,
    constructors.constructor_nationality as nationality,
    constructors.total_race_starts as start_count,
    constructors.total_race_wins as win_count,
    constructors.total_podiums as podium_count,
    constructors.total_pole_positions as qualifying_p1_count,
    constructors.total_championship_wins as championship_count,
    constructor_branding.primary_color_hex,
    first_last_races.first_race_date,
    first_last_races.last_race_date
from constructors
left join first_last_races on constructors.constructor_id = first_last_races.constructor_id
left join constructor_branding on constructors.constructor_id = constructor_branding.constructor_id
