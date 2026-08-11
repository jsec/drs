select id as circuit_layout_id, circuit_id, effective as is_current_configuration, "length" as length_km, turns
from {{ source("f1db", "circuit_layout") }}
