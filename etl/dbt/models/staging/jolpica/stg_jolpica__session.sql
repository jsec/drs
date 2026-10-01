select id as session_id, round_id, type as session_type
from {{ source("jolpica", "formula_one_session") }}
