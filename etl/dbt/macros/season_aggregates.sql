{% macro season_aggregates(grain) %}
    {%- set grain_columns = grain | join(", ") -%}
    race_aggregates as (
        select
            {{ grain_columns }},
            count(*) filter (where is_start)::integer as race_start_count,
            count(*) filter (where is_win)::integer as win_count,
            count(*) filter (where is_podium)::integer as podium_count,
            count(*) filter (where is_dnf)::integer as dnf_count,
            sum(points) as race_points,
            min(race_date) as first_race_date
        from {{ ref("race_results") }}
        group by {{ grain_columns }}
    ),

    sprint_aggregates as (
        select {{ grain_columns }}, sum(points) as sprint_points
        from {{ ref("sprint_results") }}
        group by {{ grain_columns }}
    ),

    qualifying_aggregates as (
        select {{ grain_columns }}, count(*) filter (where is_qualifying_p1)::integer as qualifying_p1_count
        from {{ ref("qualifying_results") }}
        group by {{ grain_columns }}
    )
{% endmacro %}
