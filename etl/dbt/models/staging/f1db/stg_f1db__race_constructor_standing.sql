select
    race_id,
    position_display_order,
    position_number,
    position_text,
    constructor_id,
    engine_manufacturer_id,
    points,
    championship_won
from {{ source("f1db", "race_constructor_standing") }}
