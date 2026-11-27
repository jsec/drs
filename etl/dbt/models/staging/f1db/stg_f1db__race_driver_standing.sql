select race_id, position_display_order, position_number, position_text, driver_id, points, championship_won
from {{ source("f1db", "race_driver_standing") }}
