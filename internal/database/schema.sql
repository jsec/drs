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
    circuit_layout_id text CONSTRAINT circuit_layouts__dbt_tmp_circuit_layout_id_not_null1 NOT NULL,
    circuit_id text CONSTRAINT circuit_layouts__dbt_tmp_circuit_id_not_null1 NOT NULL,
    is_current_configuration boolean CONSTRAINT circuit_layouts__dbt_tmp_is_current_configuration_not_null1 NOT NULL,
    length_km numeric(6,3) CONSTRAINT circuit_layouts__dbt_tmp_length_km_not_null1 NOT NULL,
    turns integer CONSTRAINT circuit_layouts__dbt_tmp_turns_not_null1 NOT NULL,
    race_count integer CONSTRAINT circuit_layouts__dbt_tmp_race_count_not_null1 NOT NULL,
    first_race_id integer,
    first_race_name text,
    first_race_date date,
    last_race_id integer,
    last_race_name text,
    last_race_date date,
    refresh_id bigint CONSTRAINT circuit_layouts__dbt_tmp_refresh_id_not_null1 NOT NULL
);


--
-- Name: circuits; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.circuits (
    circuit_full_name text CONSTRAINT circuits__dbt_tmp_circuit_full_name_not_null NOT NULL,
    circuit_id text CONSTRAINT circuits__dbt_tmp_circuit_id_not_null NOT NULL,
    circuit_name text CONSTRAINT circuits__dbt_tmp_circuit_name_not_null NOT NULL,
    circuit_type text CONSTRAINT circuits__dbt_tmp_circuit_type_not_null NOT NULL,
    country text CONSTRAINT circuits__dbt_tmp_country_not_null NOT NULL,
    country_id text CONSTRAINT circuits__dbt_tmp_country_id_not_null NOT NULL,
    direction text CONSTRAINT circuits__dbt_tmp_direction_not_null NOT NULL,
    first_race_date date,
    first_race_id integer,
    first_race_name text,
    last_race_date date,
    last_race_id integer,
    last_race_name text,
    latitude numeric(10,6) CONSTRAINT circuits__dbt_tmp_latitude_not_null NOT NULL,
    length_km numeric(6,3) CONSTRAINT circuits__dbt_tmp_length_km_not_null NOT NULL,
    location text CONSTRAINT circuits__dbt_tmp_location_not_null NOT NULL,
    longitude numeric(10,6) CONSTRAINT circuits__dbt_tmp_longitude_not_null NOT NULL,
    current_layout_id text,
    current_layout_length_km numeric(6,3),
    current_layout_turns integer,
    previous_names text[],
    race_count integer CONSTRAINT circuits__dbt_tmp_race_count_not_null NOT NULL,
    refresh_id bigint CONSTRAINT circuits__dbt_tmp_refresh_id_not_null NOT NULL,
    turns integer CONSTRAINT circuits__dbt_tmp_turns_not_null NOT NULL
);


--
-- Name: constructor_season_summaries; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.constructor_season_summaries (
    average_qualifying_position numeric(6,2),
    championship_won boolean CONSTRAINT constructor_season_summaries__dbt_tm_championship_won_not_null1 NOT NULL,
    constructor_id text CONSTRAINT constructor_season_summaries__dbt_tmp_constructor_id_not_null1 NOT NULL,
    constructor_name text CONSTRAINT constructor_season_summaries__dbt_tm_constructor_name_not_null1 NOT NULL,
    engine_manufacturer_id text CONSTRAINT constructor_season_summaries___engine_manufacturer_id_not_null1 NOT NULL,
    entry_count integer CONSTRAINT constructor_season_summaries__dbt_tmp_entry_count_not_null1 NOT NULL,
    fastest_lap_count integer CONSTRAINT constructor_season_summaries__dbt_t_fastest_lap_count_not_null1 NOT NULL,
    final_order integer CONSTRAINT constructor_season_summaries__dbt_tmp_final_order_not_null1 NOT NULL,
    final_points numeric(8,2),
    final_points_x100 integer,
    final_position integer,
    final_position_text text,
    podium_count integer CONSTRAINT constructor_season_summaries__dbt_tmp_podium_count_not_null1 NOT NULL,
    points_delta numeric(8,2) CONSTRAINT constructor_season_summaries__dbt_tmp_points_delta_not_null1 NOT NULL,
    points_delta_x100 integer CONSTRAINT constructor_season_summaries__dbt_t_points_delta_x100_not_null1 NOT NULL,
    qualifying_entry_count integer CONSTRAINT constructor_season_summaries___qualifying_entry_count_not_null1 NOT NULL,
    qualifying_p1_count integer CONSTRAINT constructor_season_summaries__dbt_qualifying_p1_count_not_null1 NOT NULL,
    qualifying_position_count integer CONSTRAINT constructor_season_summarie_qualifying_position_count_not_null1 NOT NULL,
    race_entry_count integer CONSTRAINT constructor_season_summaries__dbt_tm_race_entry_count_not_null1 NOT NULL,
    race_points numeric(8,2) CONSTRAINT constructor_season_summaries__dbt_tmp_race_points_not_null1 NOT NULL,
    race_points_x100 integer CONSTRAINT constructor_season_summaries__dbt_tm_race_points_x100_not_null1 NOT NULL,
    race_start_count integer CONSTRAINT constructor_season_summaries__dbt_tm_race_start_count_not_null1 NOT NULL,
    refresh_id bigint CONSTRAINT constructor_season_summaries__dbt_tmp_refresh_id_not_null1 NOT NULL,
    season integer CONSTRAINT constructor_season_summaries__dbt_tmp_season_not_null1 NOT NULL,
    sprint_entry_count integer CONSTRAINT constructor_season_summaries__dbt__sprint_entry_count_not_null1 NOT NULL,
    sprint_points numeric(8,2) CONSTRAINT constructor_season_summaries__dbt_tmp_sprint_points_not_null1 NOT NULL,
    sprint_points_x100 integer CONSTRAINT constructor_season_summaries__dbt__sprint_points_x100_not_null1 NOT NULL,
    sprint_start_count integer CONSTRAINT constructor_season_summaries__dbt__sprint_start_count_not_null1 NOT NULL,
    start_count integer CONSTRAINT constructor_season_summaries__dbt_tmp_start_count_not_null1 NOT NULL,
    total_points numeric(8,2) CONSTRAINT constructor_season_summaries__dbt_tmp_total_points_not_null1 NOT NULL,
    total_points_x100 integer CONSTRAINT constructor_season_summaries__dbt_t_total_points_x100_not_null1 NOT NULL,
    win_count integer CONSTRAINT constructor_season_summaries__dbt_tmp_win_count_not_null1 NOT NULL
);


--
-- Name: constructor_standings_snapshots; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.constructor_standings_snapshots (
    championship_won boolean CONSTRAINT constructor_standings_snapshots__dbt__championship_won_not_null NOT NULL,
    constructor_id text CONSTRAINT constructor_standings_snapshots__dbt_tm_constructor_id_not_null NOT NULL,
    constructor_name text CONSTRAINT constructor_standings_snapshots__dbt__constructor_name_not_null NOT NULL,
    engine_manufacturer_id text NOT NULL,
    points numeric(8,2) CONSTRAINT constructor_standings_snapshots__dbt_tmp_points_not_null NOT NULL,
    points_gained numeric(8,2),
    points_gained_x100 integer,
    points_x100 integer CONSTRAINT constructor_standings_snapshots__dbt_tmp_points_x100_not_null NOT NULL,
    "position" integer,
    position_change integer,
    position_text text CONSTRAINT constructor_standings_snapshots__dbt_tmp_position_text_not_null NOT NULL,
    previous_points numeric(8,2),
    previous_points_x100 integer,
    previous_position integer,
    race_id integer CONSTRAINT constructor_standings_snapshots__dbt_tmp_race_id_not_null NOT NULL,
    race_round integer CONSTRAINT constructor_standings_snapshots__dbt_tmp_race_round_not_null NOT NULL,
    refresh_id bigint CONSTRAINT constructor_standings_snapshots__dbt_tmp_refresh_id_not_null NOT NULL,
    season integer CONSTRAINT constructor_standings_snapshots__dbt_tmp_season_not_null NOT NULL
);


--
-- Name: constructors; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.constructors (
    championship_count integer CONSTRAINT constructors__dbt_tmp_championship_count_not_null NOT NULL,
    constructor_full_name text CONSTRAINT constructors__dbt_tmp_constructor_full_name_not_null NOT NULL,
    constructor_id text CONSTRAINT constructors__dbt_tmp_constructor_id_not_null NOT NULL,
    constructor_name text CONSTRAINT constructors__dbt_tmp_constructor_name_not_null NOT NULL,
    country_id text CONSTRAINT constructors__dbt_tmp_country_id_not_null NOT NULL,
    entry_count integer CONSTRAINT constructors__dbt_tmp_entry_count_not_null NOT NULL,
    fastest_lap_count integer CONSTRAINT constructors__dbt_tmp_fastest_lap_count_not_null NOT NULL,
    first_race_date date,
    first_race_id integer,
    first_race_name text,
    last_race_date date,
    last_race_id integer,
    last_race_name text,
    nationality text CONSTRAINT constructors__dbt_tmp_nationality_not_null NOT NULL,
    podium_count integer CONSTRAINT constructors__dbt_tmp_podium_count_not_null NOT NULL,
    primary_color_hex text CONSTRAINT constructors__dbt_tmp_primary_color_hex_not_null NOT NULL,
    qualifying_entry_count integer CONSTRAINT constructors__dbt_tmp_qualifying_entry_count_not_null NOT NULL,
    qualifying_p1_count integer CONSTRAINT constructors__dbt_tmp_qualifying_p1_count_not_null NOT NULL,
    race_entry_count integer CONSTRAINT constructors__dbt_tmp_race_entry_count_not_null NOT NULL,
    race_start_count integer CONSTRAINT constructors__dbt_tmp_race_start_count_not_null NOT NULL,
    refresh_id bigint CONSTRAINT constructors__dbt_tmp_refresh_id_not_null NOT NULL,
    secondary_color_hex text,
    sprint_entry_count integer CONSTRAINT constructors__dbt_tmp_sprint_entry_count_not_null NOT NULL,
    sprint_start_count integer CONSTRAINT constructors__dbt_tmp_sprint_start_count_not_null NOT NULL,
    start_count integer CONSTRAINT constructors__dbt_tmp_start_count_not_null NOT NULL,
    total_points numeric(8,2) CONSTRAINT constructors__dbt_tmp_total_points_not_null NOT NULL,
    total_points_x100 integer CONSTRAINT constructors__dbt_tmp_total_points_x100_not_null NOT NULL,
    win_count integer CONSTRAINT constructors__dbt_tmp_win_count_not_null NOT NULL
);


--
-- Name: driver_season_summaries; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.driver_season_summaries (
    average_qualifying_position numeric(6,2),
    championship_won boolean CONSTRAINT driver_season_summaries__dbt_tmp_championship_won_not_null1 NOT NULL,
    constructor_id text CONSTRAINT driver_season_summaries__dbt_tmp_constructor_id_not_null NOT NULL,
    driver_code text CONSTRAINT driver_season_summaries__dbt_tmp_driver_code_not_null1 NOT NULL,
    driver_id text CONSTRAINT driver_season_summaries__dbt_tmp_driver_id_not_null1 NOT NULL,
    driver_name text CONSTRAINT driver_season_summaries__dbt_tmp_driver_name_not_null1 NOT NULL,
    entry_count integer CONSTRAINT driver_season_summaries__dbt_tmp_entry_count_not_null1 NOT NULL,
    fastest_lap_count integer CONSTRAINT driver_season_summaries__dbt_tmp_fastest_lap_count_not_null1 NOT NULL,
    final_points numeric(8,2),
    final_points_x100 integer,
    final_position integer,
    final_position_text text,
    podium_count integer CONSTRAINT driver_season_summaries__dbt_tmp_podium_count_not_null1 NOT NULL,
    points_delta numeric(8,2) CONSTRAINT driver_season_summaries__dbt_tmp_points_delta_not_null1 NOT NULL,
    points_delta_x100 integer CONSTRAINT driver_season_summaries__dbt_tmp_points_delta_x100_not_null1 NOT NULL,
    qualifying_entry_count integer CONSTRAINT driver_season_summaries__dbt_t_qualifying_entry_count_not_null1 NOT NULL,
    qualifying_p1_count integer CONSTRAINT driver_season_summaries__dbt_tmp_qualifying_p1_count_not_null1 NOT NULL,
    qualifying_position_count integer CONSTRAINT driver_season_summaries__db_qualifying_position_count_not_null1 NOT NULL,
    race_entry_count integer CONSTRAINT driver_season_summaries__dbt_tmp_race_entry_count_not_null1 NOT NULL,
    race_points numeric(8,2) CONSTRAINT driver_season_summaries__dbt_tmp_race_points_not_null1 NOT NULL,
    race_points_x100 integer CONSTRAINT driver_season_summaries__dbt_tmp_race_points_x100_not_null1 NOT NULL,
    race_start_count integer CONSTRAINT driver_season_summaries__dbt_tmp_race_start_count_not_null1 NOT NULL,
    refresh_id bigint CONSTRAINT driver_season_summaries__dbt_tmp_refresh_id_not_null1 NOT NULL,
    season integer CONSTRAINT driver_season_summaries__dbt_tmp_season_not_null1 NOT NULL,
    sprint_entry_count integer CONSTRAINT driver_season_summaries__dbt_tmp_sprint_entry_count_not_null1 NOT NULL,
    sprint_points numeric(8,2) CONSTRAINT driver_season_summaries__dbt_tmp_sprint_points_not_null1 NOT NULL,
    sprint_points_x100 integer CONSTRAINT driver_season_summaries__dbt_tmp_sprint_points_x100_not_null1 NOT NULL,
    sprint_start_count integer CONSTRAINT driver_season_summaries__dbt_tmp_sprint_start_count_not_null1 NOT NULL,
    start_count integer CONSTRAINT driver_season_summaries__dbt_tmp_start_count_not_null1 NOT NULL,
    total_points numeric(8,2) CONSTRAINT driver_season_summaries__dbt_tmp_total_points_not_null1 NOT NULL,
    total_points_x100 integer CONSTRAINT driver_season_summaries__dbt_tmp_total_points_x100_not_null1 NOT NULL,
    win_count integer CONSTRAINT driver_season_summaries__dbt_tmp_win_count_not_null1 NOT NULL
);


--
-- Name: driver_standings_snapshots; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.driver_standings_snapshots (
    championship_won boolean CONSTRAINT driver_standings_snapshots__dbt_tmp_championship_won_not_null NOT NULL,
    driver_code text CONSTRAINT driver_standings_snapshots__dbt_tmp_driver_code_not_null NOT NULL,
    driver_id text CONSTRAINT driver_standings_snapshots__dbt_tmp_driver_id_not_null NOT NULL,
    driver_name text CONSTRAINT driver_standings_snapshots__dbt_tmp_driver_name_not_null NOT NULL,
    points numeric(8,2) CONSTRAINT driver_standings_snapshots__dbt_tmp_points_not_null NOT NULL,
    points_gained numeric(8,2),
    points_gained_x100 integer,
    points_x100 integer CONSTRAINT driver_standings_snapshots__dbt_tmp_points_x100_not_null NOT NULL,
    "position" integer,
    position_change integer,
    position_text text CONSTRAINT driver_standings_snapshots__dbt_tmp_position_text_not_null NOT NULL,
    previous_points numeric(8,2),
    previous_points_x100 integer,
    previous_position integer,
    race_id integer CONSTRAINT driver_standings_snapshots__dbt_tmp_race_id_not_null NOT NULL,
    race_round integer CONSTRAINT driver_standings_snapshots__dbt_tmp_race_round_not_null NOT NULL,
    refresh_id bigint CONSTRAINT driver_standings_snapshots__dbt_tmp_refresh_id_not_null NOT NULL,
    season integer CONSTRAINT driver_standings_snapshots__dbt_tmp_season_not_null NOT NULL
);


--
-- Name: drivers; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.drivers (
    championship_count integer CONSTRAINT drivers__dbt_tmp_championship_count_not_null1 NOT NULL,
    country_of_birth_id text CONSTRAINT drivers__dbt_tmp_country_of_birth_id_not_null1 NOT NULL,
    date_of_birth date CONSTRAINT drivers__dbt_tmp_date_of_birth_not_null1 NOT NULL,
    date_of_death date,
    driver_code text CONSTRAINT drivers__dbt_tmp_driver_code_not_null1 NOT NULL,
    driver_full_name text CONSTRAINT drivers__dbt_tmp_driver_full_name_not_null1 NOT NULL,
    driver_id text CONSTRAINT drivers__dbt_tmp_driver_id_not_null1 NOT NULL,
    driver_name text CONSTRAINT drivers__dbt_tmp_driver_name_not_null1 NOT NULL,
    driver_number integer,
    entry_count integer CONSTRAINT drivers__dbt_tmp_entry_count_not_null1 NOT NULL,
    fastest_lap_count integer CONSTRAINT drivers__dbt_tmp_fastest_lap_count_not_null1 NOT NULL,
    first_name text CONSTRAINT drivers__dbt_tmp_first_name_not_null1 NOT NULL,
    first_race_date date,
    first_race_id integer,
    first_race_name text,
    gender text CONSTRAINT drivers__dbt_tmp_gender_not_null1 NOT NULL,
    last_name text CONSTRAINT drivers__dbt_tmp_last_name_not_null1 NOT NULL,
    last_race_date date,
    last_race_id integer,
    last_race_name text,
    nationality text CONSTRAINT drivers__dbt_tmp_nationality_not_null1 NOT NULL,
    nationality_country_id text CONSTRAINT drivers__dbt_tmp_nationality_country_id_not_null1 NOT NULL,
    nationality_country_code text CONSTRAINT drivers__dbt_tmp_nationality_country_code_not_null1 NOT NULL,
    place_of_birth text CONSTRAINT drivers__dbt_tmp_place_of_birth_not_null1 NOT NULL,
    podium_count integer CONSTRAINT drivers__dbt_tmp_podium_count_not_null1 NOT NULL,
    qualifying_entry_count integer CONSTRAINT drivers__dbt_tmp_qualifying_entry_count_not_null1 NOT NULL,
    qualifying_p1_count integer CONSTRAINT drivers__dbt_tmp_qualifying_p1_count_not_null1 NOT NULL,
    race_entry_count integer CONSTRAINT drivers__dbt_tmp_race_entry_count_not_null1 NOT NULL,
    race_start_count integer CONSTRAINT drivers__dbt_tmp_race_start_count_not_null1 NOT NULL,
    refresh_id bigint CONSTRAINT drivers__dbt_tmp_refresh_id_not_null1 NOT NULL,
    second_nationality_country_id text,
    second_nationality_country_code text,
    sprint_entry_count integer CONSTRAINT drivers__dbt_tmp_sprint_entry_count_not_null1 NOT NULL,
    sprint_start_count integer CONSTRAINT drivers__dbt_tmp_sprint_start_count_not_null1 NOT NULL,
    start_count integer CONSTRAINT drivers__dbt_tmp_start_count_not_null1 NOT NULL,
    total_points numeric(8,2) CONSTRAINT drivers__dbt_tmp_total_points_not_null1 NOT NULL,
    total_points_x100 integer CONSTRAINT drivers__dbt_tmp_total_points_x100_not_null1 NOT NULL,
    win_count integer CONSTRAINT drivers__dbt_tmp_win_count_not_null1 NOT NULL
);


--
-- Name: fastest_laps; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.fastest_laps (
    car_number integer,
    circuit_id text CONSTRAINT fastest_laps__dbt_tmp_circuit_id_not_null NOT NULL,
    constructor_id text CONSTRAINT fastest_laps__dbt_tmp_constructor_id_not_null NOT NULL,
    constructor_name text CONSTRAINT fastest_laps__dbt_tmp_constructor_name_not_null NOT NULL,
    driver_code text CONSTRAINT fastest_laps__dbt_tmp_driver_code_not_null NOT NULL,
    driver_id text CONSTRAINT fastest_laps__dbt_tmp_driver_id_not_null NOT NULL,
    driver_name text CONSTRAINT fastest_laps__dbt_tmp_driver_name_not_null NOT NULL,
    engine_manufacturer_id text CONSTRAINT fastest_laps__dbt_tmp_engine_manufacturer_id_not_null NOT NULL,
    fastest_lap_order integer CONSTRAINT fastest_laps__dbt_tmp_fastest_lap_order_not_null NOT NULL,
    fastest_lap_position integer,
    gap text,
    gap_ms integer,
    "interval" text,
    interval_ms integer,
    lap_number integer,
    lap_time text,
    lap_time_ms integer,
    position_text text CONSTRAINT fastest_laps__dbt_tmp_position_text_not_null NOT NULL,
    race_date date CONSTRAINT fastest_laps__dbt_tmp_race_date_not_null NOT NULL,
    race_id integer CONSTRAINT fastest_laps__dbt_tmp_race_id_not_null NOT NULL,
    race_name text CONSTRAINT fastest_laps__dbt_tmp_race_name_not_null NOT NULL,
    race_round integer CONSTRAINT fastest_laps__dbt_tmp_race_round_not_null NOT NULL,
    refresh_id bigint CONSTRAINT fastest_laps__dbt_tmp_refresh_id_not_null NOT NULL,
    season integer CONSTRAINT fastest_laps__dbt_tmp_season_not_null NOT NULL,
    tyre_manufacturer_id text CONSTRAINT fastest_laps__dbt_tmp_tyre_manufacturer_id_not_null NOT NULL
);


--
-- Name: pit_stops; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.pit_stops (
    car_number integer,
    circuit_id text CONSTRAINT pit_stops__dbt_tmp_circuit_id_not_null NOT NULL,
    constructor_id text CONSTRAINT pit_stops__dbt_tmp_constructor_id_not_null NOT NULL,
    constructor_name text CONSTRAINT pit_stops__dbt_tmp_constructor_name_not_null NOT NULL,
    driver_code text CONSTRAINT pit_stops__dbt_tmp_driver_code_not_null NOT NULL,
    driver_id text CONSTRAINT pit_stops__dbt_tmp_driver_id_not_null NOT NULL,
    driver_name text CONSTRAINT pit_stops__dbt_tmp_driver_name_not_null NOT NULL,
    duration text,
    duration_ms integer,
    engine_manufacturer_id text CONSTRAINT pit_stops__dbt_tmp_engine_manufacturer_id_not_null NOT NULL,
    lap_number integer CONSTRAINT pit_stops__dbt_tmp_lap_number_not_null NOT NULL,
    position_text text CONSTRAINT pit_stops__dbt_tmp_position_text_not_null NOT NULL,
    race_date date CONSTRAINT pit_stops__dbt_tmp_race_date_not_null NOT NULL,
    race_id integer CONSTRAINT pit_stops__dbt_tmp_race_id_not_null NOT NULL,
    race_name text CONSTRAINT pit_stops__dbt_tmp_race_name_not_null NOT NULL,
    race_round integer CONSTRAINT pit_stops__dbt_tmp_race_round_not_null NOT NULL,
    refresh_id bigint CONSTRAINT pit_stops__dbt_tmp_refresh_id_not_null NOT NULL,
    season integer CONSTRAINT pit_stops__dbt_tmp_season_not_null NOT NULL,
    stop_number integer CONSTRAINT pit_stops__dbt_tmp_stop_number_not_null NOT NULL,
    stop_order integer CONSTRAINT pit_stops__dbt_tmp_stop_order_not_null NOT NULL,
    stop_position integer,
    tyre_manufacturer_id text CONSTRAINT pit_stops__dbt_tmp_tyre_manufacturer_id_not_null NOT NULL
);


--
-- Name: qualifying_results; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.qualifying_results (
    advanced_to_q2 boolean CONSTRAINT qualifying_results__dbt_tmp_advanced_to_q2_not_null NOT NULL,
    advanced_to_q3 boolean CONSTRAINT qualifying_results__dbt_tmp_advanced_to_q3_not_null NOT NULL,
    best_qualifying_ms integer,
    best_qualifying_time text,
    car_number integer,
    circuit_id text CONSTRAINT qualifying_results__dbt_tmp_circuit_id_not_null NOT NULL,
    constructor_id text CONSTRAINT qualifying_results__dbt_tmp_constructor_id_not_null NOT NULL,
    constructor_name text CONSTRAINT qualifying_results__dbt_tmp_constructor_name_not_null NOT NULL,
    driver_code text CONSTRAINT qualifying_results__dbt_tmp_driver_code_not_null NOT NULL,
    driver_id text CONSTRAINT qualifying_results__dbt_tmp_driver_id_not_null NOT NULL,
    driver_name text CONSTRAINT qualifying_results__dbt_tmp_driver_name_not_null NOT NULL,
    engine_manufacturer_id text CONSTRAINT qualifying_results__dbt_tmp_engine_manufacturer_id_not_null NOT NULL,
    gap text,
    gap_ms integer,
    "interval" text,
    interval_ms integer,
    is_entry boolean CONSTRAINT qualifying_results__dbt_tmp_is_entry_not_null NOT NULL,
    is_qualifying_p1 boolean CONSTRAINT qualifying_results__dbt_tmp_is_qualifying_p1_not_null NOT NULL,
    laps integer,
    position_text text CONSTRAINT qualifying_results__dbt_tmp_position_text_not_null NOT NULL,
    q1 text,
    q1_ms integer,
    q2 text,
    q2_ms integer,
    q3 text,
    q3_ms integer,
    qualifying_order integer,
    qualifying_position integer,
    race_date date CONSTRAINT qualifying_results__dbt_tmp_race_date_not_null NOT NULL,
    race_id integer CONSTRAINT qualifying_results__dbt_tmp_race_id_not_null NOT NULL,
    race_name text CONSTRAINT qualifying_results__dbt_tmp_race_name_not_null NOT NULL,
    race_round integer CONSTRAINT qualifying_results__dbt_tmp_race_round_not_null NOT NULL,
    refresh_id bigint CONSTRAINT qualifying_results__dbt_tmp_refresh_id_not_null NOT NULL,
    season integer CONSTRAINT qualifying_results__dbt_tmp_season_not_null NOT NULL,
    tyre_manufacturer_id text CONSTRAINT qualifying_results__dbt_tmp_tyre_manufacturer_id_not_null NOT NULL
);


--
-- Name: race_results; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.race_results (
    car_number integer,
    circuit_id text CONSTRAINT race_results__dbt_tmp_circuit_id_not_null1 NOT NULL,
    constructor_id text CONSTRAINT race_results__dbt_tmp_constructor_id_not_null1 NOT NULL,
    constructor_name text CONSTRAINT race_results__dbt_tmp_constructor_name_not_null1 NOT NULL,
    driver_code text CONSTRAINT race_results__dbt_tmp_driver_code_not_null1 NOT NULL,
    driver_id text CONSTRAINT race_results__dbt_tmp_driver_id_not_null1 NOT NULL,
    driver_name text CONSTRAINT race_results__dbt_tmp_driver_name_not_null1 NOT NULL,
    elapsed_time text,
    elapsed_time_ms integer,
    engine_manufacturer_id text CONSTRAINT race_results__dbt_tmp_engine_manufacturer_id_not_null1 NOT NULL,
    finish_order integer CONSTRAINT race_results__dbt_tmp_finish_order_not_null1 NOT NULL,
    finish_position integer,
    gap text,
    gap_laps integer,
    gap_ms integer,
    grid_position integer,
    "interval" text,
    interval_ms integer,
    is_classified_finish boolean CONSTRAINT race_results__dbt_tmp_is_classified_finish_not_null1 NOT NULL,
    is_dnf boolean CONSTRAINT race_results__dbt_tmp_is_dnf_not_null1 NOT NULL,
    is_driver_of_the_day boolean CONSTRAINT race_results__dbt_tmp_is_driver_of_the_day_not_null1 NOT NULL,
    is_entry boolean CONSTRAINT race_results__dbt_tmp_is_entry_not_null1 NOT NULL,
    is_fastest_lap boolean CONSTRAINT race_results__dbt_tmp_is_fastest_lap_not_null1 NOT NULL,
    is_grand_slam boolean CONSTRAINT race_results__dbt_tmp_is_grand_slam_not_null1 NOT NULL,
    is_grid_p1 boolean CONSTRAINT race_results__dbt_tmp_is_grid_p1_not_null1 NOT NULL,
    is_podium boolean CONSTRAINT race_results__dbt_tmp_is_podium_not_null1 NOT NULL,
    is_points_finish boolean CONSTRAINT race_results__dbt_tmp_is_points_finish_not_null1 NOT NULL,
    is_pole_position boolean CONSTRAINT race_results__dbt_tmp_is_pole_position_not_null1 NOT NULL,
    is_start boolean CONSTRAINT race_results__dbt_tmp_is_start_not_null1 NOT NULL,
    is_win boolean CONSTRAINT race_results__dbt_tmp_is_win_not_null1 NOT NULL,
    laps_completed integer,
    pit_stop_count integer,
    points numeric(8,2) CONSTRAINT race_results__dbt_tmp_points_not_null1 NOT NULL,
    points_x100 integer CONSTRAINT race_results__dbt_tmp_points_x100_not_null1 NOT NULL,
    positions_gained integer,
    position_text text CONSTRAINT race_results__dbt_tmp_position_text_not_null1 NOT NULL,
    qualifying_position integer,
    race_date date CONSTRAINT race_results__dbt_tmp_race_date_not_null1 NOT NULL,
    race_id integer CONSTRAINT race_results__dbt_tmp_race_id_not_null1 NOT NULL,
    race_name text CONSTRAINT race_results__dbt_tmp_race_name_not_null1 NOT NULL,
    race_round integer CONSTRAINT race_results__dbt_tmp_race_round_not_null1 NOT NULL,
    refresh_id bigint CONSTRAINT race_results__dbt_tmp_refresh_id_not_null1 NOT NULL,
    season integer CONSTRAINT race_results__dbt_tmp_season_not_null1 NOT NULL,
    status text,
    status_category text CONSTRAINT race_results__dbt_tmp_status_category_not_null1 NOT NULL,
    time_penalty text,
    time_penalty_ms integer,
    tyre_manufacturer_id text CONSTRAINT race_results__dbt_tmp_tyre_manufacturer_id_not_null1 NOT NULL
);


--
-- Name: races; Type: TABLE; Schema: effone; Owner: -
--

CREATE TABLE effone.races (
    circuit_id text CONSTRAINT races__dbt_tmp_circuit_id_not_null NOT NULL,
    circuit_layout_id text CONSTRAINT races__dbt_tmp_circuit_layout_id_not_null NOT NULL,
    circuit_type text CONSTRAINT races__dbt_tmp_circuit_type_not_null NOT NULL,
    course_length_km numeric(6,3) CONSTRAINT races__dbt_tmp_course_length_km_not_null NOT NULL,
    direction text CONSTRAINT races__dbt_tmp_direction_not_null NOT NULL,
    fp1_date date,
    fp1_time time without time zone,
    fp2_date date,
    fp2_time time without time zone,
    fp3_date date,
    fp3_time time without time zone,
    grand_prix_id text CONSTRAINT races__dbt_tmp_grand_prix_id_not_null NOT NULL,
    grand_prix_name text CONSTRAINT races__dbt_tmp_grand_prix_name_not_null NOT NULL,
    pole_driver_id text,
    pole_driver_name text,
    qualifying_date date,
    qualifying_format text CONSTRAINT races__dbt_tmp_qualifying_format_not_null NOT NULL,
    qualifying_time time without time zone,
    race_date date CONSTRAINT races__dbt_tmp_race_date_not_null NOT NULL,
    race_distance_km numeric(6,3) CONSTRAINT races__dbt_tmp_race_distance_km_not_null NOT NULL,
    race_id integer CONSTRAINT races__dbt_tmp_race_id_not_null NOT NULL,
    race_laps integer CONSTRAINT races__dbt_tmp_race_laps_not_null NOT NULL,
    race_name text CONSTRAINT races__dbt_tmp_race_name_not_null NOT NULL,
    race_official_name text CONSTRAINT races__dbt_tmp_race_official_name_not_null NOT NULL,
    race_round integer CONSTRAINT races__dbt_tmp_race_round_not_null NOT NULL,
    race_time time without time zone,
    refresh_id bigint CONSTRAINT races__dbt_tmp_refresh_id_not_null NOT NULL,
    scheduled_distance_km numeric(6,3),
    scheduled_laps integer,
    season integer CONSTRAINT races__dbt_tmp_season_not_null NOT NULL,
    sprint_date date,
    sprint_qualifying_date date,
    sprint_qualifying_format text,
    sprint_qualifying_time time without time zone,
    sprint_time time without time zone,
    sprint_winner_constructor_id text,
    sprint_winner_constructor_name text,
    sprint_winner_driver_id text,
    sprint_winner_driver_name text,
    turns integer CONSTRAINT races__dbt_tmp_turns_not_null NOT NULL,
    winner_constructor_id text,
    winner_constructor_name text,
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
    duration_ms integer,
    source_version text,
    status text NOT NULL,
    row_counts jsonb,
    error_message text,
    notes text,
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
    constructor_count integer CONSTRAINT seasons__dbt_tmp_constructor_count_not_null NOT NULL,
    driver_count integer CONSTRAINT seasons__dbt_tmp_driver_count_not_null NOT NULL,
    first_race_date date,
    last_race_date date,
    race_count integer CONSTRAINT seasons__dbt_tmp_race_count_not_null NOT NULL,
    refresh_id bigint CONSTRAINT seasons__dbt_tmp_refresh_id_not_null NOT NULL,
    season integer CONSTRAINT seasons__dbt_tmp_season_not_null NOT NULL,
    sprint_count integer CONSTRAINT seasons__dbt_tmp_sprint_count_not_null NOT NULL,
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
    circuit_id text CONSTRAINT sprint_results__dbt_tmp_circuit_id_not_null1 NOT NULL,
    constructor_id text CONSTRAINT sprint_results__dbt_tmp_constructor_id_not_null1 NOT NULL,
    constructor_name text CONSTRAINT sprint_results__dbt_tmp_constructor_name_not_null1 NOT NULL,
    driver_code text CONSTRAINT sprint_results__dbt_tmp_driver_code_not_null1 NOT NULL,
    driver_id text CONSTRAINT sprint_results__dbt_tmp_driver_id_not_null1 NOT NULL,
    driver_name text CONSTRAINT sprint_results__dbt_tmp_driver_name_not_null1 NOT NULL,
    elapsed_time text,
    elapsed_time_ms integer,
    engine_manufacturer_id text CONSTRAINT sprint_results__dbt_tmp_engine_manufacturer_id_not_null1 NOT NULL,
    finish_order integer CONSTRAINT sprint_results__dbt_tmp_finish_order_not_null1 NOT NULL,
    finish_position integer,
    gap text,
    gap_laps integer,
    gap_ms integer,
    grid_position integer,
    "interval" text,
    interval_ms integer,
    is_classified_finish boolean CONSTRAINT sprint_results__dbt_tmp_is_classified_finish_not_null1 NOT NULL,
    is_dnf boolean CONSTRAINT sprint_results__dbt_tmp_is_dnf_not_null1 NOT NULL,
    is_entry boolean CONSTRAINT sprint_results__dbt_tmp_is_entry_not_null1 NOT NULL,
    is_grid_p1 boolean CONSTRAINT sprint_results__dbt_tmp_is_grid_p1_not_null1 NOT NULL,
    is_podium boolean CONSTRAINT sprint_results__dbt_tmp_is_podium_not_null1 NOT NULL,
    is_points_finish boolean CONSTRAINT sprint_results__dbt_tmp_is_points_finish_not_null1 NOT NULL,
    is_start boolean CONSTRAINT sprint_results__dbt_tmp_is_start_not_null1 NOT NULL,
    is_win boolean CONSTRAINT sprint_results__dbt_tmp_is_win_not_null1 NOT NULL,
    laps_completed integer,
    points numeric(8,2) CONSTRAINT sprint_results__dbt_tmp_points_not_null1 NOT NULL,
    points_x100 integer CONSTRAINT sprint_results__dbt_tmp_points_x100_not_null1 NOT NULL,
    positions_gained integer,
    position_text text CONSTRAINT sprint_results__dbt_tmp_position_text_not_null1 NOT NULL,
    qualifying_position integer,
    race_date date CONSTRAINT sprint_results__dbt_tmp_race_date_not_null1 NOT NULL,
    race_id integer CONSTRAINT sprint_results__dbt_tmp_race_id_not_null1 NOT NULL,
    race_name text CONSTRAINT sprint_results__dbt_tmp_race_name_not_null1 NOT NULL,
    race_round integer CONSTRAINT sprint_results__dbt_tmp_race_round_not_null1 NOT NULL,
    refresh_id bigint CONSTRAINT sprint_results__dbt_tmp_refresh_id_not_null1 NOT NULL,
    season integer CONSTRAINT sprint_results__dbt_tmp_season_not_null1 NOT NULL,
    status text,
    status_category text CONSTRAINT sprint_results__dbt_tmp_status_category_not_null1 NOT NULL,
    time_penalty text,
    time_penalty_ms integer,
    tyre_manufacturer_id text CONSTRAINT sprint_results__dbt_tmp_tyre_manufacturer_id_not_null1 NOT NULL
);


--
-- Name: refresh_runs refresh_runs_pkey; Type: CONSTRAINT; Schema: effone; Owner: -
--

ALTER TABLE ONLY effone.refresh_runs
    ADD CONSTRAINT refresh_runs_pkey PRIMARY KEY (refresh_id);


--
-- Name: constructor_season_summaries_constructor_season_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX constructor_season_summaries_constructor_season_idx ON effone.constructor_season_summaries USING btree (constructor_id, season);


--
-- Name: constructor_season_summaries_season_final_order_uidx; Type: INDEX; Schema: effone; Owner: -
--

CREATE UNIQUE INDEX constructor_season_summaries_season_final_order_uidx ON effone.constructor_season_summaries USING btree (season, final_order);


--
-- Name: constructor_season_summaries_season_position_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX constructor_season_summaries_season_position_idx ON effone.constructor_season_summaries USING btree (season, final_position);


--
-- Name: constructors_constructor_id_uidx; Type: INDEX; Schema: effone; Owner: -
--

CREATE UNIQUE INDEX constructors_constructor_id_uidx ON effone.constructors USING btree (constructor_id);


--
-- Name: driver_season_summaries_driver_season_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX driver_season_summaries_driver_season_idx ON effone.driver_season_summaries USING btree (driver_id, season);


--
-- Name: driver_season_summaries_season_driver_uidx; Type: INDEX; Schema: effone; Owner: -
--

CREATE UNIQUE INDEX driver_season_summaries_season_driver_uidx ON effone.driver_season_summaries USING btree (season, driver_id);


--
-- Name: driver_season_summaries_season_position_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX driver_season_summaries_season_position_idx ON effone.driver_season_summaries USING btree (season, final_position);


--
-- Name: drivers_driver_code_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX drivers_driver_code_idx ON effone.drivers USING btree (driver_code);


--
-- Name: drivers_driver_id_uidx; Type: INDEX; Schema: effone; Owner: -
--

CREATE UNIQUE INDEX drivers_driver_id_uidx ON effone.drivers USING btree (driver_id);


--
-- Name: race_results_constructor_race_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX race_results_constructor_race_idx ON effone.race_results USING btree (constructor_id, race_id);


--
-- Name: race_results_driver_race_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX race_results_driver_race_idx ON effone.race_results USING btree (driver_id, race_id);


--
-- Name: race_results_race_finish_order_uidx; Type: INDEX; Schema: effone; Owner: -
--

CREATE UNIQUE INDEX race_results_race_finish_order_uidx ON effone.race_results USING btree (race_id, finish_order);


--
-- Name: race_results_season_constructor_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX race_results_season_constructor_idx ON effone.race_results USING btree (season, constructor_id);


--
-- Name: race_results_season_driver_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX race_results_season_driver_idx ON effone.race_results USING btree (season, driver_id);


--
-- Name: sprint_results_race_driver_uidx; Type: INDEX; Schema: effone; Owner: -
--

CREATE UNIQUE INDEX sprint_results_race_driver_uidx ON effone.sprint_results USING btree (race_id, driver_id);


--
-- Name: sprint_results_race_finish_order_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX sprint_results_race_finish_order_idx ON effone.sprint_results USING btree (race_id, finish_order);


--
-- Name: sprint_results_season_constructor_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX sprint_results_season_constructor_idx ON effone.sprint_results USING btree (season, constructor_id);


--
-- Name: sprint_results_season_driver_idx; Type: INDEX; Schema: effone; Owner: -
--

CREATE INDEX sprint_results_season_driver_idx ON effone.sprint_results USING btree (season, driver_id);


--
-- PostgreSQL database dump complete
--


