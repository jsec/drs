{{ config(severity="warn") }}

select *
from {{ ref("int_jolpica__race_identities") }}
where abs(external_race_date - race_date) > 1
