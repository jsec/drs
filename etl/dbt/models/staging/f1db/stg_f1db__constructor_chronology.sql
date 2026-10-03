select constructor_id, position_display_order, other_constructor_id, year_from, year_to
from {{ source("f1db", "constructor_chronology") }}
