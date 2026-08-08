import json
import os
from argparse import ArgumentParser, Namespace
from typing import Any, TypeVar

from dbt.cli.main import dbtRunner
from psycopg import Connection, sql
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb
from rich.console import Console

from scripts.task import run_task

DatabaseRow = dict[str, Any]
T = TypeVar("T")
console = Console()

TABLE_NAMES = [
    "seasons",
    "races",
    "drivers",
    "constructors",
    "circuits",
    "race_results",
    "sprint_results",
    "qualifying_results",
    "pit_stops",
    "driver_standings_snapshots",
    "constructor_standings_snapshots",
    "driver_season_summaries",
    "constructor_season_summaries",
]


class Args(Namespace):
    schema: str
    target: str


def main() -> None:
    args = parse_args()
    connection: Connection[DatabaseRow] | None = None
    refresh_id: int | None = None

    try:
        connection = run_task("Getting DB connection", get_db_connection)

        refresh_id = run_task("Creating refresh record", lambda: create_refresh_record(connection))

        run_task("Rebuilding effone database", lambda: build(refresh_id, args.schema, args.target))

        row_counts = run_task("Getting row counts", lambda: get_row_counts(connection))

        run_task(
            "Finalizing refresh record", lambda: update_refresh_record(connection, refresh_id, "succeeded", row_counts)
        )
    except Exception:
        if connection is not None and refresh_id is not None:
            run_task(
                "Marking refresh record as failed", lambda: update_refresh_record(connection, refresh_id, "failed", {})
            )
        raise
    finally:
        if connection is not None:
            run_task("Closing connection", connection.close)


def parse_args() -> Args:
    parser = ArgumentParser()
    parser.add_argument("--schema", type=str, default="f1db")
    parser.add_argument("--target", type=str, default="dev")

    return parser.parse_args(namespace=Args())


def get_db_connection() -> Connection[DatabaseRow]:
    database_url = os.environ["DATABASE_URL"]
    return Connection[DatabaseRow].connect(database_url, row_factory=dict_row, autocommit=True)


def create_refresh_record(conn: Connection[DatabaseRow]) -> int:
    with conn.cursor() as cursor:
        cursor.execute(
            """
                insert into effone.refresh_runs (status, source_version)
                values (%s, %s)
                returning refresh_id
            """,
            ("running", "f1db"),
        )

        row = cursor.fetchone()

    if row is None:
        raise RuntimeError("Could not create refresh record")

    return int(row["refresh_id"])


def build(refresh_id: int, schema: str, target: str) -> None:
    dbt = dbtRunner()

    args = [
        "build",
        "--project-dir",
        "./dbt",
        "--profiles-dir",
        "./dbt",
        "--target",
        target,
        "--vars",
        json.dumps({"refresh_id": refresh_id, "f1db_schema": schema}),
    ]

    result = dbt.invoke(args)

    if result.exception is not None:
        raise result.exception

    if not result.success:
        raise RuntimeError("dbt build failed")


def get_row_counts(conn: Connection[DatabaseRow]) -> dict[str, int]:
    row_counts: dict[str, int] = {}

    with conn.cursor() as cursor:
        for table_name in TABLE_NAMES:
            cursor.execute(
                sql.SQL("select count(*) as row_count from {}.{}").format(
                    sql.Identifier("effone"), sql.Identifier(table_name)
                )
            )

            row = cursor.fetchone()

            if row is None:
                raise RuntimeError(f"Failed to count rows for table {table_name}")

            row_counts[table_name] = int(row["row_count"])

    return row_counts


def update_refresh_record(
    conn: Connection[DatabaseRow], refresh_id: int, status: str, row_counts: dict[str, int]
) -> None:
    with conn.cursor() as cursor:
        cursor.execute(
            """
                update effone.refresh_runs
                set
                    status = %s,
                    finished_at = now(),
                    duration_ms = extract(epoch from (now() - started_at)) * 1000,
                    row_counts = %s::jsonb
                where refresh_id = %s
            """,
            (status, Jsonb(row_counts), refresh_id),
        )


if __name__ == "__main__":
    main()
