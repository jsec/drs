select
    race_identities.race_id,
    race_laps.session,
    driver_identities.driver_id,
    race_laps.lap_number::integer as lap_number,
    race_laps.lap_position::integer as position,
    (extract(epoch from race_laps.lap_time) * 1000)::integer as lap_time_ms
from {{ ref("int_jolpica__race_laps") }} as race_laps
join {{ ref("int_jolpica__race_identities") }} as race_identities using (external_race_id)
join {{ ref("int_jolpica__driver_identities") }} as driver_identities using (external_driver_id)
