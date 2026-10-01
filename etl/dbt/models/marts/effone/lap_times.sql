with
    laps as (
        select
            race_identities.race_id,
            driver_identities.driver_id,
            race_laps.lap_number,
            race_laps.lap_position,
            race_laps.lap_time,
            (extract(epoch from race_laps.lap_time) * 1000)::integer as lap_time_ms
        from {{ ref("int_jolpica__race_laps") }} as race_laps
        join {{ ref("int_jolpica__race_identities") }} as race_identities using (external_race_id)
        join {{ ref("int_jolpica__driver_identities") }} as driver_identities using (external_driver_id)
    )

select
    races.season,
    races.race_round,
    laps.race_id,
    laps.driver_id,
    laps.lap_number::integer as lap_number,
    laps.lap_position::integer as position,
    case
        when laps.lap_time >= interval '1 hour'
        then to_char(laps.lap_time, 'FMHH24:MI:SS.MS')
        else to_char(laps.lap_time, 'FMMI:SS.MS')
    end as lap_time,
    laps.lap_time_ms,
    {{ var("refresh_id") }}::bigint as refresh_id
from laps
join {{ ref("races") }} as races using (race_id)
