DO $$
DECLARE
    expected record;
    actual bigint;
BEGIN
    FOR expected IN
        SELECT * FROM (VALUES
            ('seasons', 77),
            ('races', 1172),
            ('drivers', 917),
            ('race_results', 27621),
            ('lap_times', 639374)
        ) AS v(table_name, min_rows)
    LOOP
        EXECUTE format('SELECT count(*) FROM effone.%I', expected.table_name) INTO actual;
        IF actual < expected.min_rows THEN
            RAISE EXCEPTION 'effone.% has % rows, expected at least %', expected.table_name, actual, expected.min_rows;
        END IF;
    END LOOP;
END $$;
