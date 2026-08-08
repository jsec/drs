select
    id as grand_prix_id,
    name as grand_prix_name,
    full_name as grand_prix_full_name,
    short_name as grand_prix_short_name,
    abbreviation as grand_prix_code,
    country_id,
    total_races_held
from {{ source("f1db", "grand_prix") }}
