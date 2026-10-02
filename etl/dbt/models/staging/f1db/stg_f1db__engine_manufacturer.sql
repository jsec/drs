select id as engine_manufacturer_id, name as engine_manufacturer_name from {{ source("f1db", "engine_manufacturer") }}
