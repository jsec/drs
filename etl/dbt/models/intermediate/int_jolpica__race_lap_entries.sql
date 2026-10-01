select distinct external_race_id, external_driver_id, date_of_birth from {{ ref("int_jolpica__race_laps") }}
