import os
import subprocess
from pathlib import Path
from zipfile import ZipFile

import httpx2
from github import Auth, Github

from scripts.task import run_task

RELEASE_ASSET_NAME = "f1db-sql-postgresql.zip"
DUMP_FILE_NAME = "f1db-sql-postgresql.sql"


def main() -> None:
    source_version, download_url = run_task("Getting latest F1DB release", get_latest_release)

    run_task("Downloading dump file", lambda: download_dump_file(download_url))
    run_task("Loading dump file", load_dump_file)


def get_latest_release() -> tuple[str, str]:
    auth = Auth.Token(os.environ["GITHUB_TOKEN"])
    hub = Github(auth=auth)

    release = hub.get_repo("f1db/f1db").get_latest_release()
    source_version = release.tag_name

    for asset in release.get_assets():
        if asset.name == RELEASE_ASSET_NAME:
            return source_version, asset.browser_download_url

    raise RuntimeError(f"Could not find {RELEASE_ASSET_NAME} in release assets.")


def download_dump_file(url: str) -> None:
    file_path = Path(RELEASE_ASSET_NAME)

    try:
        with httpx2.stream("GET", url, follow_redirects=True, timeout=60) as response:
            response.raise_for_status()

            with file_path.open("wb") as file:
                for chunk in response.iter_bytes():
                    file.write(chunk)

        with ZipFile(file_path, "r") as zip:
            zip.extractall()
    except Exception as e:
        print("Error downloading dump file:", e)
        raise
    finally:
        file_path.unlink(missing_ok=True)


def load_dump_file() -> None:
    database_url = os.environ["DATABASE_URL"]
    dump_path = Path(DUMP_FILE_NAME)

    try:
        subprocess.run(
            [
                "psql",
                database_url,
                "-q",
                "-v",
                "ON_ERROR_STOP=1",
                "-c",
                "drop schema if exists f1db cascade",
                "-c",
                "create schema f1db",
                "-c",
                "set search_path to f1db",
                "-f",
                str(dump_path),
            ],
            check=True,
        )
    except Exception as e:
        print("Error restoring from dump file:", e)
        raise
    finally:
        dump_path.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
