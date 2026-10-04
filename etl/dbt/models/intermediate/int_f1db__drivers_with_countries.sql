with
    drivers as (select * from {{ ref("stg_f1db__driver") }}),

    countries as (select * from {{ ref("stg_f1db__country") }})

select drivers.*, countries.country_name as nationality, countries.alpha2_code as nationality_country_code
from drivers
join countries on drivers.nationality_country_id = countries.country_id
