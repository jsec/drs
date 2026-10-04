{% macro result_status_columns() %}
    reason_retired as status,
    case
        when reason_retired is null
        then 'finished'
        when lower(reason_retired) like '%accident%'
        then 'accident'
        when lower(reason_retired) like '%collision%'
        then 'collision'
        when lower(reason_retired) like '%disqualified%'
        then 'disqualified'
        when lower(reason_retired) like '%not qualified%'
        then 'not_qualified'
        when lower(reason_retired) like '%not classified%'
        then 'not_classified'
        when lower(reason_retired) like '%withdraw%'
        then 'withdrawn'
        when
            lower(reason_retired)
            ~ '(engine|gearbox|hydraulic|electrical|brake|transmission|clutch|suspension|power|fuel|oil|water|radiator|battery)'
        then 'mechanical'
        when lower(reason_retired) ~ '(spin|spun|driver)'
        then 'driver_error'
        else 'other_retirement'
    end as status_category,
    laps is not null as is_start,
    reason_retired is not null as is_dnf,
    coalesce(position_display_order = 1, false) as is_win,
    coalesce(position_display_order <= 3, false) as is_podium,
    coalesce(grid_position_number = 1, false) as is_grid_p1
{% endmacro %}
