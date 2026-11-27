select
    id as race_id,
    year as season,
    round as race_round,
    date as race_date,
    "time"::time as race_time,
    grand_prix_id,
    official_name as race_official_name,
    circuit_id,
    circuit_layout_id,
    turns,
    laps as race_laps,
    qualifying_time::time as qualifying_time
from {{ source("f1db", "race") }}
