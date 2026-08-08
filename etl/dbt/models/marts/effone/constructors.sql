with
    constructors as (select * from {{ ref("int_f1db__constructors_with_countries") }}),

    constructor_races as (
        select constructor_id, race_id, race_official_name, race_date
        from {{ ref("int_f1db__race_results_with_entities") }}
    ),

    first_last_races as (
        select distinct
            constructor_id,
            first_value(race_id) over first_race as first_race_id,
            first_value(race_official_name) over first_race as first_race_name,
            first_value(race_date) over first_race as first_race_date,
            first_value(race_id) over last_race as last_race_id,
            first_value(race_official_name) over last_race as last_race_name,
            first_value(race_date) over last_race as last_race_date
        from constructor_races
        window
            first_race as (partition by constructor_id order by race_date, race_id),
            last_race as (partition by constructor_id order by race_date desc, race_id desc)
    ),

    constructor_branding as (select * from {{ ref("constructor_branding") }})

select
    constructors.constructor_id,
    constructors.constructor_name,
    constructors.constructor_full_name,
    constructors.country_id,
    constructors.constructor_nationality as nationality,
    constructors.total_race_entries as entry_count,
    constructors.total_race_starts as start_count,
    constructors.total_race_entries as race_entry_count,
    constructors.total_sprint_race_starts as sprint_entry_count,
    constructors.total_race_starts as race_start_count,
    constructors.total_sprint_race_starts as sprint_start_count,
    constructors.total_race_wins as win_count,
    constructors.total_podiums as podium_count,
    constructors.total_fastest_laps as fastest_lap_count,
    constructors.total_race_entries as qualifying_entry_count,
    constructors.total_pole_positions as qualifying_p1_count,
    constructors.total_championship_wins as championship_count,
    constructors.total_points,
    (constructors.total_points * 100)::integer as total_points_x100,
    constructor_branding.primary_color_hex,
    constructor_branding.secondary_color_hex,
    first_last_races.first_race_id,
    first_last_races.first_race_name,
    first_last_races.first_race_date,
    first_last_races.last_race_id,
    first_last_races.last_race_name,
    first_last_races.last_race_date,
    {{ var("refresh_id") }}::bigint as refresh_id
from constructors
left join first_last_races on constructors.constructor_id = first_last_races.constructor_id
left join constructor_branding on constructors.constructor_id = constructor_branding.constructor_id
