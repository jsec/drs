select distinct
    session.round_id as external_race_id, driver.driver_reference as external_driver_id, driver.date_of_birth
from {{ ref("stg_jolpica__lap") }} as lap
inner join {{ ref("stg_jolpica__session_entry") }} as session_entry using (session_entry_id)
inner join {{ ref("stg_jolpica__session") }} as session using (session_id)
inner join {{ ref("stg_jolpica__round_entry") }} as round_entry using (round_entry_id)
inner join {{ ref("stg_jolpica__team_driver") }} as team_driver using (team_driver_id)
inner join {{ ref("stg_jolpica__driver") }} as driver using (driver_id)
where session.session_type = 'R'
