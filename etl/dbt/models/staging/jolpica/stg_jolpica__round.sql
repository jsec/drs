select id as round_id, season_id, number as round_number, date as round_date
from {{ source("jolpica", "formula_one_round") }}
