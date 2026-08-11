with
    layouts as (select * from {{ ref("stg_f1db__circuit_layout") }}),

    races as (
        select circuit_layout_id, race_id, race_official_name, race_date from {{ ref("int_f1db__races_with_circuits") }}
    ),

    layout_races as (
        select distinct
            circuit_layout_id,
            count(*) over layout as race_count,
            first_value(race_id) over first_race as first_race_id,
            first_value(race_official_name) over first_race as first_race_name,
            first_value(race_date) over first_race as first_race_date,
            first_value(race_id) over last_race as last_race_id,
            first_value(race_official_name) over last_race as last_race_name,
            first_value(race_date) over last_race as last_race_date
        from races
        window
            layout as (partition by circuit_layout_id),
            first_race as (partition by circuit_layout_id order by race_date, race_id),
            last_race as (partition by circuit_layout_id order by race_date desc, race_id desc)
    )

select
    layouts.circuit_layout_id,
    layouts.circuit_id,
    layouts.is_current_configuration,
    layouts.length_km,
    layouts.turns,
    coalesce(layout_races.race_count, 0) as race_count,
    layout_races.first_race_id,
    layout_races.first_race_name,
    layout_races.first_race_date,
    layout_races.last_race_id,
    layout_races.last_race_name,
    layout_races.last_race_date
from layouts
left join layout_races on layouts.circuit_layout_id = layout_races.circuit_layout_id
