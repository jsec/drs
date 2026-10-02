{% macro create_index(index_name, columns, unique=false) %}
    drop index if exists {{ this.schema }}.{{ adapter.quote(index_name) }};
    create
    {% if unique %}
        unique
    {% endif %}
    index {{ adapter.quote(index_name) }}
    on {{ this }}
    (
    {% for column in columns %} {{ column }}{{ ", " if not loop.last }} {% endfor %}
    )
{% endmacro %}
