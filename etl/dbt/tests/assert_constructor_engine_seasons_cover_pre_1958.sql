select distinct race_results.season, race_results.constructor_id
from {{ ref("race_results") }} as race_results
left join
    {{ ref("constructor_engine_seasons") }} as engine_seasons
    on race_results.season = engine_seasons.season
    and race_results.constructor_id = engine_seasons.constructor_id
where race_results.season < 1958 and engine_seasons.constructor_id is null
