{% test iso_alpha2_country_code(model, column_name) %}

    select * from {{ model }} where {{ column_name }} is not null and not ({{ column_name }} ~ '^[A-Z]{2}$')

{% endtest %}
