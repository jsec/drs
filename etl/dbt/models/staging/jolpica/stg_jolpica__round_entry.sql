select id as round_entry_id, round_id, team_driver_id from {{ source("jolpica", "formula_one_roundentry") }}
