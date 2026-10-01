select id as session_entry_id, round_entry_id, session_id
from {{ source("jolpica", "formula_one_sessionentry") }}
