with
    chronology as (select * from {{ ref("stg_f1db__constructor_chronology") }}),

    constructors as (select * from {{ ref("stg_f1db__constructor") }})

select
    chronology.constructor_id,
    chronology.position_display_order,
    chronology.other_constructor_id,
    constructors.constructor_name as other_constructor_name,
    chronology.year_from,
    chronology.year_to
from chronology
join constructors on chronology.other_constructor_id = constructors.constructor_id
