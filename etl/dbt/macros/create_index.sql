{% macro create_index(index_name, columns, unique=false) %}
    create
    {% if unique %}
        unique
    {% endif %}
    index if not exists {{ adapter.quote(index_name) }}
    on {{ this }}
    (
    {% for column in columns %} {{ column }}{{ ", " if not loop.last }} {% endfor %}
    )
{% endmacro %}
