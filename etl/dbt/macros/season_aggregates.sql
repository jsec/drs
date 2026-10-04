{% macro season_aggregates(grain) %}
    {%- set grain_columns = grain | join(", ") -%}
    race_aggregates as (
        select
            {{ grain_columns }},
            count(*)::integer as race_entry_count,
            count(*) filter (where is_start)::integer as race_start_count,
            count(*) filter (where is_win)::integer as win_count,
            count(*) filter (where is_podium)::integer as podium_count,
            count(*) filter (where is_dnf)::integer as dnf_count,
            count(*) filter (where is_fastest_lap)::integer as fastest_lap_count,
            sum(points) as race_points,
            min(race_date) as first_race_date
        from {{ ref("race_results") }}
        group by {{ grain_columns }}
    ),

    sprint_aggregates as (
        select
            {{ grain_columns }},
            count(*)::integer as sprint_entry_count,
            count(*) filter (where is_start)::integer as sprint_start_count,
            sum(points) as sprint_points
        from {{ ref("sprint_results") }}
        group by {{ grain_columns }}
    ),

    qualifying_aggregates as (
        select
            {{ grain_columns }},
            count(*)::integer as qualifying_entry_count,
            count(qualifying_position)::integer as qualifying_position_count,
            count(*) filter (where is_qualifying_p1)::integer as qualifying_p1_count,
            avg(qualifying_position)::numeric(6, 2) as average_qualifying_position
        from {{ ref("qualifying_results") }}
        group by {{ grain_columns }}
    )
{% endmacro %}
