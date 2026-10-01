select id as season_id, year as season
from {{ source("jolpica", "formula_one_season") }}
