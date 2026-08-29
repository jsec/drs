{% test driver_season_summaries_participation_coverage(model) %}
    with
        race_results as (select season, driver_id from {{ ref("race_results") }}),

        sprint_results as (select season, driver_id from {{ ref("sprint_results") }}),

        driver_seasons as (
            select season, driver_id
            from race_results
            union
            select season, driver_id
            from sprint_results
        ),

        summaries as (select season, driver_id from {{ model }})

    select driver_seasons.season, driver_seasons.driver_id
    from driver_seasons
    left join summaries on driver_seasons.season = summaries.season and driver_seasons.driver_id = summaries.driver_id
    where summaries.driver_id is null
{% endtest %}
