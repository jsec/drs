--
-- PostgreSQL database dump
--


-- Dumped from database version 18.4 (Postgres.app)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: effone; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA effone;


--
-- Name: SCHEMA effone; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA effone IS 'Formula 1 analytical schema.';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: circuit_layouts; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.circuit_layouts (
    circuit_layout_id text NOT NULL,
    circuit_id text NOT NULL,
    is_current_configuration boolean NOT NULL,
    length_km numeric(6,3) NOT NULL,
    turns integer NOT NULL,
    race_count integer NOT NULL,
    first_race_id integer,
    first_race_name text,
    first_race_date date,
    last_race_id integer,
    last_race_name text,
    last_race_date date
);


--
-- Name: circuits; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.circuits (
    circuit_full_name text NOT NULL,
    circuit_id text NOT NULL,
    circuit_name text NOT NULL,
    circuit_type text NOT NULL,
    country text NOT NULL,
    country_code text NOT NULL,
    country_id text NOT NULL,
    direction text NOT NULL,
    first_race_date date,
    first_race_id integer,
    first_race_name text,
    last_race_date date,
    last_race_id integer,
    last_race_name text,
    latitude numeric(10,6) NOT NULL,
    length_km numeric(6,3) NOT NULL,
    location text NOT NULL,
    longitude numeric(10,6) NOT NULL,
    current_layout_id text,
    current_layout_length_km numeric(6,3),
    current_layout_turns integer,
    previous_names text[],
    race_count integer NOT NULL,
    turns integer NOT NULL
);


--
-- Name: constructor_lineage; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.constructor_lineage (
    constructor_id text NOT NULL,
    position_display_order integer NOT NULL,
    other_constructor_id text NOT NULL,
    other_constructor_name text NOT NULL,
    year_from integer NOT NULL,
    year_to integer
);


--
-- Name: constructor_season_summaries; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.constructor_season_summaries (
    average_qualifying_position numeric(6,2),
    championship_won boolean NOT NULL,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    engine_manufacturer_id text NOT NULL,
    engine_manufacturer_name text NOT NULL,
    dnf_count integer NOT NULL,
    entry_count integer NOT NULL,
    fastest_lap_count integer NOT NULL,
    final_order integer,
    final_points numeric(8,2),
    final_position integer,
    final_position_text text,
    podium_count integer NOT NULL,
    points_delta numeric(8,2),
    qualifying_entry_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    qualifying_position_count integer NOT NULL,
    race_entry_count integer NOT NULL,
    race_points numeric(8,2) NOT NULL,
    race_start_count integer NOT NULL,
    season integer NOT NULL,
    sprint_entry_count integer NOT NULL,
    sprint_points numeric(8,2) NOT NULL,
    sprint_start_count integer NOT NULL,
    start_count integer NOT NULL,
    total_points numeric(8,2) NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: constructor_standings_snapshots; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.constructor_standings_snapshots (
    championship_won boolean NOT NULL,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    engine_manufacturer_id text NOT NULL,
    engine_manufacturer_name text NOT NULL,
    points numeric(8,2) NOT NULL,
    points_gained numeric(8,2),
    "position" integer,
    position_change integer,
    position_text text NOT NULL,
    previous_points numeric(8,2),
    previous_position integer,
    race_id integer NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL
);


--
-- Name: constructors; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.constructors (
    championship_count integer NOT NULL,
    constructor_full_name text NOT NULL,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    country_id text NOT NULL,
    country_code text NOT NULL,
    entry_count integer NOT NULL,
    fastest_lap_count integer NOT NULL,
    first_race_date date,
    last_race_date date,
    nationality text NOT NULL,
    podium_count integer NOT NULL,
    primary_color_hex text NOT NULL,
    qualifying_entry_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    race_entry_count integer NOT NULL,
    race_start_count integer NOT NULL,
    secondary_color_hex text,
    sprint_entry_count integer NOT NULL,
    sprint_start_count integer NOT NULL,
    start_count integer NOT NULL,
    total_points numeric(8,2) NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: driver_season_constructor_summaries; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.driver_season_constructor_summaries (
    average_qualifying_position numeric(6,2),
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    constructor_sequence integer NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    entry_count integer NOT NULL,
    fastest_lap_count integer NOT NULL,
    podium_count integer NOT NULL,
    qualifying_entry_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    qualifying_position_count integer NOT NULL,
    race_entry_count integer NOT NULL,
    race_points numeric(8,2) NOT NULL,
    race_start_count integer NOT NULL,
    season integer NOT NULL,
    sprint_entry_count integer NOT NULL,
    sprint_points numeric(8,2) NOT NULL,
    sprint_start_count integer NOT NULL,
    start_count integer NOT NULL,
    total_points numeric(8,2) NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: driver_season_summaries; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.driver_season_summaries (
    average_qualifying_position numeric(6,2),
    championship_won boolean NOT NULL,
    constructor_id text NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    entry_count integer NOT NULL,
    fastest_lap_count integer NOT NULL,
    final_points numeric(8,2),
    final_position integer,
    final_position_text text,
    podium_count integer NOT NULL,
    points_delta numeric(8,2) NOT NULL,
    qualifying_entry_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    qualifying_position_count integer NOT NULL,
    race_entry_count integer NOT NULL,
    race_points numeric(8,2) NOT NULL,
    race_start_count integer NOT NULL,
    season integer NOT NULL,
    sprint_entry_count integer NOT NULL,
    sprint_points numeric(8,2) NOT NULL,
    sprint_start_count integer NOT NULL,
    start_count integer NOT NULL,
    total_points numeric(8,2) NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: driver_standings_snapshots; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.driver_standings_snapshots (
    car_number integer,
    championship_won boolean NOT NULL,
    constructor_id text,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    points numeric(8,2) NOT NULL,
    points_gained numeric(8,2),
    podium_count integer NOT NULL,
    "position" integer,
    position_change integer,
    position_text text NOT NULL,
    previous_points numeric(8,2),
    previous_position integer,
    race_id integer NOT NULL,
    race_round integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    season integer NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: drivers; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.drivers (
    championship_count integer NOT NULL,
    country_of_birth_id text NOT NULL,
    date_of_birth date NOT NULL,
    date_of_death date,
    driver_code text NOT NULL,
    driver_full_name text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    driver_number integer,
    entry_count integer NOT NULL,
    fastest_lap_count integer NOT NULL,
    first_name text NOT NULL,
    first_race_date date,
    gender text NOT NULL,
    last_name text NOT NULL,
    last_race_date date,
    nationality text NOT NULL,
    nationality_country_id text NOT NULL,
    nationality_country_code text NOT NULL,
    place_of_birth text NOT NULL,
    podium_count integer NOT NULL,
    qualifying_entry_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    race_entry_count integer NOT NULL,
    race_start_count integer NOT NULL,
    second_nationality_country_id text,
    second_nationality_country_code text,
    sprint_entry_count integer NOT NULL,
    sprint_start_count integer NOT NULL,
    start_count integer NOT NULL,
    total_points numeric(8,2) NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: fastest_laps; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.fastest_laps (
    car_number integer,
    circuit_id text NOT NULL,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    engine_manufacturer_id text NOT NULL,
    fastest_lap_order integer NOT NULL,
    fastest_lap_position integer,
    gap text,
    "interval" text,
    lap_number integer,
    lap_time text,
    position_text text NOT NULL,
    race_date date NOT NULL,
    race_id integer NOT NULL,
    race_name text NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL,
    tyre_manufacturer_id text NOT NULL
);


--
-- Name: lap_times; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.lap_times (
    driver_id text NOT NULL,
    lap_number integer NOT NULL,
    lap_time text NOT NULL,
    lap_time_ms integer NOT NULL,
    "position" integer,
    race_id integer NOT NULL,
    race_round integer NOT NULL,
    session text NOT NULL,
    season integer NOT NULL
);


--
-- Name: pit_stops; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.pit_stops (
    car_number integer,
    circuit_id text NOT NULL,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    duration text,
    duration_ms integer,
    engine_manufacturer_id text NOT NULL,
    lap_number integer NOT NULL,
    position_text text NOT NULL,
    race_date date NOT NULL,
    race_id integer NOT NULL,
    race_name text NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL,
    stop_number integer NOT NULL,
    stop_order integer NOT NULL,
    stop_position integer,
    tyre_manufacturer_id text NOT NULL
);


--
-- Name: qualifying_results; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.qualifying_results (
    advanced_to_q2 boolean NOT NULL,
    advanced_to_q3 boolean NOT NULL,
    best_qualifying_time text,
    car_number integer,
    circuit_id text NOT NULL,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    engine_manufacturer_id text NOT NULL,
    gap text,
    "interval" text,
    is_entry boolean NOT NULL,
    is_qualifying_p1 boolean NOT NULL,
    laps integer,
    position_text text NOT NULL,
    q1 text,
    q2 text,
    q3 text,
    qualifying_order integer NOT NULL,
    qualifying_position integer,
    race_date date NOT NULL,
    race_id integer NOT NULL,
    race_name text NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL,
    tyre_manufacturer_id text NOT NULL
);


--
-- Name: race_results; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.race_results (
    car_number integer,
    circuit_id text NOT NULL,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    elapsed_time text,
    engine_manufacturer_id text NOT NULL,
    finish_order integer NOT NULL,
    finish_position integer,
    gap text,
    gap_laps integer,
    grid_position integer,
    "interval" text,
    is_classified_finish boolean NOT NULL,
    is_dnf boolean NOT NULL,
    is_driver_of_the_day boolean NOT NULL,
    is_entry boolean NOT NULL,
    is_fastest_lap boolean NOT NULL,
    is_grand_slam boolean NOT NULL,
    is_grid_p1 boolean NOT NULL,
    is_podium boolean NOT NULL,
    is_points_finish boolean NOT NULL,
    is_pole_position boolean NOT NULL,
    is_start boolean NOT NULL,
    is_win boolean NOT NULL,
    laps_completed integer,
    pit_stop_count integer,
    points numeric(8,2) NOT NULL,
    positions_gained integer,
    position_text text NOT NULL,
    qualifying_position integer,
    race_date date NOT NULL,
    race_id integer NOT NULL,
    race_name text NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL,
    status text,
    status_category text NOT NULL,
    time_penalty text,
    tyre_manufacturer_id text NOT NULL
);


--
-- Name: races; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.races (
    circuit_id text NOT NULL,
    circuit_layout_id text NOT NULL,
    circuit_type text NOT NULL,
    course_length_km numeric(6,3) NOT NULL,
    direction text NOT NULL,
    fp1_date date,
    fp1_time time without time zone,
    fp2_date date,
    fp2_time time without time zone,
    fp3_date date,
    fp3_time time without time zone,
    grand_prix_code text,
    grand_prix_id text NOT NULL,
    grand_prix_name text NOT NULL,
    pole_driver_id text,
    pole_driver_name text,
    qualifying_date date,
    qualifying_format text NOT NULL,
    qualifying_time time without time zone,
    race_date date NOT NULL,
    race_distance_km numeric(6,3) NOT NULL,
    race_id integer NOT NULL,
    race_laps integer NOT NULL,
    race_name text NOT NULL,
    race_official_name text NOT NULL,
    race_round integer NOT NULL,
    race_time time without time zone,
    scheduled_distance_km numeric(6,3),
    scheduled_laps integer,
    season integer NOT NULL,
    sprint_date date,
    sprint_qualifying_date date,
    sprint_qualifying_format text,
    sprint_qualifying_time time without time zone,
    sprint_time time without time zone,
    sprint_winner_constructor_id text,
    sprint_winner_constructor_name text,
    sprint_winner_driver_id text,
    sprint_winner_driver_name text,
    turns integer NOT NULL,
    winner_constructor_id text,
    winner_constructor_name text,
    winner_driver_code text,
    winner_driver_id text,
    winner_driver_name text
);


--
-- Name: refresh_runs; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.refresh_runs (
    refresh_id bigint NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone,
    status text NOT NULL,
    row_counts jsonb,
    error_message text,
    CONSTRAINT refresh_runs_row_counts_check CHECK (((row_counts IS NULL) OR (jsonb_typeof(row_counts) = 'object'::text))),
    CONSTRAINT refresh_runs_status_check CHECK ((status = ANY (ARRAY['running'::text, 'succeeded'::text, 'failed'::text])))
);


--
-- Name: TABLE refresh_runs; Type: COMMENT; Schema: effone; Owner: -
--

COMMENT ON TABLE effone.refresh_runs IS 'Metadata for source data refreshes.';


--
-- Name: COLUMN refresh_runs.row_counts; Type: COMMENT; Schema: effone; Owner: -
--

COMMENT ON COLUMN effone.refresh_runs.row_counts IS 'Per-table row counts captured by refreshes.';


--
-- Name: refresh_runs_refresh_id_seq; Type: SEQUENCE; Schema: effone; Owner: -
--

ALTER TABLE effone.refresh_runs ALTER COLUMN refresh_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME effone.refresh_runs_refresh_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: seasons; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.seasons (
    constructor_count integer NOT NULL,
    driver_count integer NOT NULL,
    first_race_date date,
    last_race_date date,
    race_count integer NOT NULL,
    season integer NOT NULL,
    sprint_count integer NOT NULL,
    wcc_constructor_id text,
    wcc_constructor_name text,
    wdc_driver_id text,
    wdc_driver_name text
);


--
-- Name: sprint_results; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.sprint_results (
    car_number integer,
    circuit_id text NOT NULL,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    elapsed_time text,
    engine_manufacturer_id text NOT NULL,
    finish_order integer NOT NULL,
    finish_position integer,
    gap text,
    gap_laps integer,
    grid_position integer,
    "interval" text,
    is_classified_finish boolean NOT NULL,
    is_dnf boolean NOT NULL,
    is_entry boolean NOT NULL,
    is_grid_p1 boolean NOT NULL,
    is_podium boolean NOT NULL,
    is_points_finish boolean NOT NULL,
    is_start boolean NOT NULL,
    is_win boolean NOT NULL,
    laps_completed integer,
    points numeric(8,2) NOT NULL,
    positions_gained integer,
    position_text text NOT NULL,
    qualifying_position integer,
    race_date date NOT NULL,
    race_id integer NOT NULL,
    race_name text NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL,
    status text,
    status_category text NOT NULL,
    time_penalty text,
    tyre_manufacturer_id text NOT NULL
);


--
-- Name: circuit_layouts circuit_layouts__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.circuit_layouts
    ADD CONSTRAINT circuit_layouts__dbt_tmp_pkey PRIMARY KEY (circuit_layout_id);


--
-- Name: circuits circuits__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.circuits
    ADD CONSTRAINT circuits__dbt_tmp_pkey PRIMARY KEY (circuit_id);


--
-- Name: constructor_lineage constructor_lineage__dbt_tmp_pkey1; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.constructor_lineage
    ADD CONSTRAINT constructor_lineage__dbt_tmp_pkey1 PRIMARY KEY (constructor_id, position_display_order);


--
-- Name: constructor_season_summaries constructor_season_summaries__dbt_tmp_pkey1; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.constructor_season_summaries
    ADD CONSTRAINT constructor_season_summaries__dbt_tmp_pkey1 PRIMARY KEY (season, constructor_id, engine_manufacturer_id);


--
-- Name: constructor_standings_snapshots constructor_standings_snapshots__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.constructor_standings_snapshots
    ADD CONSTRAINT constructor_standings_snapshots__dbt_tmp_pkey PRIMARY KEY (race_id, constructor_id, engine_manufacturer_id);


--
-- Name: constructors constructors__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.constructors
    ADD CONSTRAINT constructors__dbt_tmp_pkey PRIMARY KEY (constructor_id);


--
-- Name: driver_season_constructor_summaries driver_season_constructor_summaries__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.driver_season_constructor_summaries
    ADD CONSTRAINT driver_season_constructor_summaries__dbt_tmp_pkey PRIMARY KEY (season, driver_id, constructor_id);


--
-- Name: driver_season_summaries driver_season_summaries__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.driver_season_summaries
    ADD CONSTRAINT driver_season_summaries__dbt_tmp_pkey PRIMARY KEY (season, driver_id);


--
-- Name: driver_standings_snapshots driver_standings_snapshots__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.driver_standings_snapshots
    ADD CONSTRAINT driver_standings_snapshots__dbt_tmp_pkey PRIMARY KEY (race_id, driver_id);


--
-- Name: drivers drivers__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.drivers
    ADD CONSTRAINT drivers__dbt_tmp_pkey PRIMARY KEY (driver_id);


--
-- Name: fastest_laps fastest_laps__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.fastest_laps
    ADD CONSTRAINT fastest_laps__dbt_tmp_pkey PRIMARY KEY (race_id, driver_id);


--
-- Name: lap_times lap_times__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.lap_times
    ADD CONSTRAINT lap_times__dbt_tmp_pkey PRIMARY KEY (race_id, session, driver_id, lap_number);


--
-- Name: pit_stops pit_stops__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.pit_stops
    ADD CONSTRAINT pit_stops__dbt_tmp_pkey PRIMARY KEY (race_id, stop_order);


--
-- Name: qualifying_results qualifying_results__dbt_tmp_pkey1; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.qualifying_results
    ADD CONSTRAINT qualifying_results__dbt_tmp_pkey1 PRIMARY KEY (race_id, qualifying_order);


--
-- Name: race_results race_results__dbt_tmp_pkey1; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.race_results
    ADD CONSTRAINT race_results__dbt_tmp_pkey1 PRIMARY KEY (race_id, finish_order);


--
-- Name: races races__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.races
    ADD CONSTRAINT races__dbt_tmp_pkey PRIMARY KEY (race_id);


--
-- Name: refresh_runs refresh_runs_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.refresh_runs
    ADD CONSTRAINT refresh_runs_pkey PRIMARY KEY (refresh_id);


--
-- Name: seasons seasons__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.seasons
    ADD CONSTRAINT seasons__dbt_tmp_pkey PRIMARY KEY (season);


--
-- Name: sprint_results sprint_results__dbt_tmp_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.sprint_results
    ADD CONSTRAINT sprint_results__dbt_tmp_pkey PRIMARY KEY (race_id, driver_id);


--
-- Name: 31cc4ba2a610265f6af569638d4be8ff; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX "31cc4ba2a610265f6af569638d4be8ff" ON effone.races USING btree (season, race_round);


--
-- Name: 344de05eb8ec58cb4e0de5b43e838312; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX "344de05eb8ec58cb4e0de5b43e838312" ON effone.races USING btree (circuit_id);


--
-- Name: 5987450a53535a211aa27ca653409219; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX "5987450a53535a211aa27ca653409219" ON effone.race_results USING btree (season, driver_id);


--
-- Name: 91309e4b44b2f2e94838bfa2d7e16ac6; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX "91309e4b44b2f2e94838bfa2d7e16ac6" ON effone.pit_stops USING btree (race_id, driver_id);


--
-- Name: a2562eb61095204262007f262aa2677b; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX a2562eb61095204262007f262aa2677b ON effone.sprint_results USING btree (season, driver_id);


--
-- Name: c4256c0667dd35b698c6887ed9437179; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX c4256c0667dd35b698c6887ed9437179 ON effone.constructor_standings_snapshots USING btree (season, constructor_id);


--
-- Name: cea8ab0872e9037dd307fdb927f3bef0; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX cea8ab0872e9037dd307fdb927f3bef0 ON effone.driver_standings_snapshots USING btree (season, driver_id);


--
-- Name: e61ee40f472ce2ef642aae4a6b193439; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX e61ee40f472ce2ef642aae4a6b193439 ON effone.driver_season_constructor_summaries USING btree (driver_id, season);


--
-- PostgreSQL database dump complete
--


