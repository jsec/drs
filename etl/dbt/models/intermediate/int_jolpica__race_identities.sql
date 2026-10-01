select
    'jolpica' as source,
    round.round_id as external_race_id,
    races.race_id,
    round.round_date as external_race_date,
    races.race_date
from {{ ref("stg_jolpica__round") }} as round
inner join {{ ref("stg_jolpica__season") }} as season using (season_id)
inner join
    {{ ref("races") }} as races
    on season.season = races.season
    and round.round_number = races.race_round
