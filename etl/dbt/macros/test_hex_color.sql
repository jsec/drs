{% test hex_color(model, column_name) %}

    select * from {{ model }} where {{ column_name }} is not null and not ({{ column_name }} ~ '^#[0-9A-Fa-f]{6}$')

{% endtest %}
