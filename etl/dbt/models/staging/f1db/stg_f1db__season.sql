select year as season from {{ source("f1db", "season") }}
