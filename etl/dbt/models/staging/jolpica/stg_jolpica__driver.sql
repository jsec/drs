select id as driver_id, reference as driver_reference, date_of_birth from {{ source("jolpica", "formula_one_driver") }}
