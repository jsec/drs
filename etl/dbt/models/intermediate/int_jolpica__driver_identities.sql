with
    race_lap_drivers as (
        select distinct external_driver_id, date_of_birth
        from {{ ref("int_jolpica__race_lap_entries") }}
    )

select 'jolpica' as source, race_lap_drivers.external_driver_id, drivers.driver_id
from race_lap_drivers
inner join {{ ref("drivers") }} as drivers using (date_of_birth)
