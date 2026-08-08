{% macro create_index(index_name, columns, unique=false, using="btree") %}
    create
    {% if unique %}
        unique
    {% endif %}
    index if not exists {{ adapter.quote(index_name) }}
    on {{ this }}
    {% if using %}
        using {{ using }}
    {% endif %}
    (
    {% for column in columns %} {{ column }}{{ ", " if not loop.last }} {% endfor %}
    )
{% endmacro %}
