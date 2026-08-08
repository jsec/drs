with
    constructors as (select * from {{ ref("stg_f1db__constructor") }}),

    countries as (select * from {{ ref("stg_f1db__country") }})

select constructors.*, countries.country_name as constructor_country, countries.demonym as constructor_nationality
from constructors
join countries on constructors.country_id = countries.country_id
