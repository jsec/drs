select distinct race_results.season, race_results.constructor_id
from {{ ref("race_results") }} as race_results
left join
    {{ ref("constructor_season_summaries") }} as season_summaries
    on race_results.season = season_summaries.season
    and race_results.constructor_id = season_summaries.constructor_id
where race_results.season < 1958 and season_summaries.constructor_id is null
