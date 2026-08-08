with
    drivers as (select * from {{ ref("stg_f1db__driver") }}),

    nationality_countries as (select * from {{ ref("stg_f1db__country") }}),

    birth_countries as (select * from {{ ref("stg_f1db__country") }}),

    second_nationality_countries as (select * from {{ ref("stg_f1db__country") }})

select
    drivers.*,
    nationality_countries.country_name as nationality,
    nationality_countries.alpha2_code as nationality_country_code,
    birth_countries.country_name as country_of_birth,
    birth_countries.alpha2_code as country_of_birth_code,
    second_nationality_countries.alpha2_code as second_nationality_country_code,
    second_nationality_countries.country_name as second_nationality
from drivers
join nationality_countries on drivers.nationality_country_id = nationality_countries.country_id
join birth_countries on drivers.country_of_birth_country_id = birth_countries.country_id
left join
    second_nationality_countries on drivers.second_nationality_country_id = second_nationality_countries.country_id
