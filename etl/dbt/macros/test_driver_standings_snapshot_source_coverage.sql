{% test driver_standings_snapshot_source_coverage(model) %}
    select standings.race_id, standings.driver_id
    from {{ ref("stg_f1db__race_driver_standing") }} as standings
    join {{ ref("int_f1db__races_with_circuits") }} as races using (race_id)
    left join {{ model }} as snapshots using (race_id, driver_id)
    where snapshots.race_id is null
{% endtest %}
