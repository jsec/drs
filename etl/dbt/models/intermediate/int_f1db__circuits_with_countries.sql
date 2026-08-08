with
    circuits as (select * from {{ ref("stg_f1db__circuit") }}),

    countries as (select * from {{ ref("stg_f1db__country") }})

select circuits.*, countries.country_name as country
from circuits
join countries on circuits.country_id = countries.country_id
