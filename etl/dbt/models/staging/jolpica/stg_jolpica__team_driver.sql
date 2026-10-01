select id as team_driver_id, driver_id
from {{ source("jolpica", "formula_one_teamdriver") }}
