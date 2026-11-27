with race_lap_drivers as (select distinct external_driver_id, date_of_birth from {{ ref("int_jolpica__race_laps") }})
select race_lap_drivers.external_driver_id, drivers.driver_id
from race_lap_drivers
inner join
    {{ ref("drivers") }} as drivers
    on drivers.date_of_birth = race_lap_drivers.date_of_birth
    or (
        race_lap_drivers.date_of_birth is null
        and drivers.driver_id = replace(race_lap_drivers.external_driver_id, '_', '-')
    )
