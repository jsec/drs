select 1
where
    (select count(*) from {{ ref("driver_standings_snapshots") }})
    != (select count(*) from {{ ref("stg_f1db__race_driver_standing") }})
