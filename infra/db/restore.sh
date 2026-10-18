#!/bin/sh
set -eu

initdb --username=postgres --wal-segsize=1 --auth-local=peer --auth-host=scram-sha-256
echo "host drs drs all scram-sha-256" >> "$PGDATA/pg_hba.conf"

pg_ctl -w start -o "-c listen_addresses='' -c wal_level=minimal -c max_wal_senders=0 -c min_wal_size=2MB -c max_wal_size=4MB"

createdb drs
pg_restore --no-owner --no-acl --single-transaction --exit-on-error -d drs /effone.dump

psql -v ON_ERROR_STOP=1 -q -d drs -v password="$(cat /run/secrets/db_password)" <<'SQL'
CREATE ROLE drs LOGIN PASSWORD :'password';
GRANT USAGE ON SCHEMA effone TO drs;
GRANT SELECT ON ALL TABLES IN SCHEMA effone TO drs;
VACUUM (FREEZE, ANALYZE);
CHECKPOINT;
SQL

pg_ctl -w stop -m fast
