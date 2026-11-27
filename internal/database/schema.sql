--
-- PostgreSQL database dump
--


-- Dumped from database version 18.4 (Postgres.app)
-- Dumped by pg_dump version 19.0

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
-- Name: circuits; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.circuits (
    circuit_full_name text NOT NULL,
    circuit_id text NOT NULL,
    circuit_name text NOT NULL,
    country text NOT NULL,
    country_code text NOT NULL,
    first_race_date date,
    first_race_name text,
    last_race_date date,
    last_race_name text,
    location text NOT NULL,
    current_layout_id text,
    race_count integer NOT NULL,
    turns integer NOT NULL,
    CONSTRAINT circuits_country_code_check CHECK ((country_code ~ '^[A-Z]{2}$'::text))
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
    championship_won boolean NOT NULL,
    constructor_id text NOT NULL,
    engine_manufacturer_id text NOT NULL,
    engine_manufacturer_name text NOT NULL,
    dnf_count integer NOT NULL,
    final_order integer,
    final_points numeric(8,2),
    final_position_text text,
    podium_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    race_start_count integer NOT NULL,
    season integer NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: constructor_standings_snapshots; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.constructor_standings_snapshots (
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    engine_manufacturer_id text NOT NULL,
    engine_manufacturer_name text NOT NULL,
    points numeric(8,2) NOT NULL,
    "position" integer,
    position_text text NOT NULL,
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
    country_code text NOT NULL,
    first_race_date date,
    last_race_date date,
    nationality text NOT NULL,
    podium_count integer NOT NULL,
    primary_color_hex text NOT NULL,
    qualifying_p1_count integer NOT NULL,
    start_count integer NOT NULL,
    win_count integer NOT NULL,
    CONSTRAINT constructors_country_code_check CHECK ((country_code ~ '^[A-Z]{2}$'::text)),
    CONSTRAINT constructors_primary_color_hex_check CHECK ((primary_color_hex ~ '^#[0-9A-Fa-f]{6}$'::text))
);


--
-- Name: driver_season_constructor_summaries; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.driver_season_constructor_summaries (
    constructor_id text NOT NULL,
    constructor_sequence integer NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    podium_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    race_start_count integer NOT NULL,
    season integer NOT NULL,
    total_points numeric(8,2) NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: driver_season_summaries; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.driver_season_summaries (
    car_number integer,
    constructor_id text NOT NULL,
    driver_id text NOT NULL,
    final_points numeric(8,2) NOT NULL,
    final_position_text text,
    podium_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    season integer NOT NULL,
    win_count integer NOT NULL
);


--
-- Name: driver_standings_snapshots; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.driver_standings_snapshots (
    championship_won boolean NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    points numeric(8,2) NOT NULL,
    "position" integer,
    position_text text NOT NULL,
    race_id integer NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL
);


--
-- Name: drivers; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.drivers (
    championship_count integer NOT NULL,
    current_constructor_id text,
    date_of_birth date NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    first_race_date date,
    last_name text NOT NULL,
    last_race_date date,
    nationality text NOT NULL,
    nationality_country_code text NOT NULL,
    podium_count integer NOT NULL,
    qualifying_p1_count integer NOT NULL,
    start_count integer NOT NULL,
    win_count integer NOT NULL,
    CONSTRAINT drivers_nationality_country_code_check CHECK ((nationality_country_code ~ '^[A-Z]{2}$'::text))
);


--
-- Name: fastest_laps; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.fastest_laps (
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    fastest_lap_order integer NOT NULL,
    fastest_lap_position integer,
    lap_number integer,
    lap_time text,
    race_id integer NOT NULL
);


--
-- Name: lap_times; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.lap_times (
    driver_id text NOT NULL,
    lap_number integer NOT NULL,
    lap_time_ms integer NOT NULL,
    "position" integer,
    race_id integer NOT NULL,
    session text NOT NULL
);


--
-- Name: pit_stops; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.pit_stops (
    driver_id text NOT NULL,
    duration text,
    lap_number integer NOT NULL,
    race_id integer NOT NULL,
    stop_number integer NOT NULL
);


--
-- Name: qualifying_results; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.qualifying_results (
    best_qualifying_time text,
    car_number integer,
    constructor_id text NOT NULL,
    constructor_name text NOT NULL,
    driver_code text NOT NULL,
    driver_id text NOT NULL,
    driver_name text NOT NULL,
    engine_manufacturer_id text NOT NULL,
    gap text,
    is_qualifying_p1 boolean NOT NULL,
    position_text text NOT NULL,
    q1 text,
    q2 text,
    q3 text,
    qualifying_order integer NOT NULL,
    race_id integer NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL
);


--
-- Name: race_results; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.race_results (
    car_number integer,
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
    grid_position integer,
    is_dnf boolean NOT NULL,
    is_driver_of_the_day boolean NOT NULL,
    is_fastest_lap boolean NOT NULL,
    is_grand_slam boolean NOT NULL,
    is_grid_p1 boolean NOT NULL,
    is_podium boolean NOT NULL,
    is_pole_position boolean NOT NULL,
    is_start boolean NOT NULL,
    is_win boolean NOT NULL,
    pit_stop_count integer,
    points numeric(8,2) NOT NULL,
    position_text text NOT NULL,
    race_date date NOT NULL,
    race_id integer NOT NULL,
    race_name text NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL,
    status text,
    status_category text NOT NULL,
    time_penalty text
);


--
-- Name: races; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.races (
    circuit_id text NOT NULL,
    circuit_layout_id text NOT NULL,
    grand_prix_code text,
    pole_driver_id text,
    race_date date NOT NULL,
    race_id integer NOT NULL,
    race_laps integer NOT NULL,
    race_name text NOT NULL,
    race_official_name text NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL,
    winner_constructor_id text,
    winner_constructor_name text,
    winner_driver_code text,
    winner_driver_id text,
    winner_driver_name text
);


--
-- Name: seasons; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.seasons (
    race_count integer NOT NULL,
    season integer NOT NULL,
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
    grid_position integer,
    is_dnf boolean NOT NULL,
    is_grid_p1 boolean NOT NULL,
    is_podium boolean NOT NULL,
    is_start boolean NOT NULL,
    is_win boolean NOT NULL,
    points numeric(8,2) NOT NULL,
    position_text text NOT NULL,
    race_date date NOT NULL,
    race_id integer NOT NULL,
    race_name text NOT NULL,
    race_round integer NOT NULL,
    season integer NOT NULL,
    status text,
    status_category text NOT NULL,
    time_penalty text
);


--
-- Name: circuits circuits_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.circuits
    ADD CONSTRAINT circuits_pkey PRIMARY KEY (circuit_id);


--
-- Name: constructor_lineage constructor_lineage_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.constructor_lineage
    ADD CONSTRAINT constructor_lineage_pkey PRIMARY KEY (constructor_id, position_display_order);


--
-- Name: constructor_season_summaries constructor_season_summaries_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.constructor_season_summaries
    ADD CONSTRAINT constructor_season_summaries_pkey PRIMARY KEY (season, constructor_id, engine_manufacturer_id);


--
-- Name: constructor_standings_snapshots constructor_standings_snapshots_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.constructor_standings_snapshots
    ADD CONSTRAINT constructor_standings_snapshots_pkey PRIMARY KEY (race_id, constructor_id, engine_manufacturer_id);


--
-- Name: constructors constructors_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.constructors
    ADD CONSTRAINT constructors_pkey PRIMARY KEY (constructor_id);


--
-- Name: driver_season_constructor_summaries driver_season_constructor_summaries_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.driver_season_constructor_summaries
    ADD CONSTRAINT driver_season_constructor_summaries_pkey PRIMARY KEY (season, driver_id, constructor_id);


--
-- Name: driver_season_summaries driver_season_summaries_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.driver_season_summaries
    ADD CONSTRAINT driver_season_summaries_pkey PRIMARY KEY (season, driver_id);


--
-- Name: driver_standings_snapshots driver_standings_snapshots_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.driver_standings_snapshots
    ADD CONSTRAINT driver_standings_snapshots_pkey PRIMARY KEY (race_id, driver_id);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (driver_id);


--
-- Name: fastest_laps fastest_laps_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.fastest_laps
    ADD CONSTRAINT fastest_laps_pkey PRIMARY KEY (race_id, driver_id);


--
-- Name: lap_times lap_times_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.lap_times
    ADD CONSTRAINT lap_times_pkey PRIMARY KEY (race_id, session, driver_id, lap_number);


--
-- Name: pit_stops pit_stops_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.pit_stops
    ADD CONSTRAINT pit_stops_pkey PRIMARY KEY (race_id, driver_id, stop_number);


--
-- Name: qualifying_results qualifying_results_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.qualifying_results
    ADD CONSTRAINT qualifying_results_pkey PRIMARY KEY (race_id, qualifying_order);


--
-- Name: race_results race_results_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.race_results
    ADD CONSTRAINT race_results_pkey PRIMARY KEY (race_id, finish_order);


--
-- Name: races races_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.races
    ADD CONSTRAINT races_pkey PRIMARY KEY (race_id);


--
-- Name: seasons seasons_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.seasons
    ADD CONSTRAINT seasons_pkey PRIMARY KEY (season);


--
-- Name: sprint_results sprint_results_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.sprint_results
    ADD CONSTRAINT sprint_results_pkey PRIMARY KEY (race_id, driver_id);


--
-- Name: 6defef6fb2883ace7109ce4309f6f104; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX "6defef6fb2883ace7109ce4309f6f104" ON effone.race_results USING btree (season, driver_id);


--
-- Name: 744292b5b3e43b58f2821ae64fd49b9f; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX "744292b5b3e43b58f2821ae64fd49b9f" ON effone.constructor_standings_snapshots USING btree (season, constructor_id);


--
-- Name: 905db97f33987381b53866035a4cdd0b; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX "905db97f33987381b53866035a4cdd0b" ON effone.sprint_results USING btree (season, driver_id);


--
-- Name: 91b7244389d8557e8dda485506a0fb1a; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX "91b7244389d8557e8dda485506a0fb1a" ON effone.driver_standings_snapshots USING btree (season, driver_id);


--
-- Name: a409a643d986f94a37194aa5881c4d0e; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX a409a643d986f94a37194aa5881c4d0e ON effone.races USING btree (circuit_id);


--
-- Name: cf6b86ee31383a8ea53b99e6eb65bf75; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX cf6b86ee31383a8ea53b99e6eb65bf75 ON effone.races USING btree (season, race_round);


--
-- Name: f848e467e9e26615119d0ba4bafb22e8; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX f848e467e9e26615119d0ba4bafb22e8 ON effone.driver_season_constructor_summaries USING btree (driver_id, season);


--
-- PostgreSQL database dump complete
--


