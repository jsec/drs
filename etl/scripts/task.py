from collections.abc import Callable
from typing import TypeVar

from rich.console import Console

T = TypeVar("T")
console = Console()


def run_task[T](name: str, fn: Callable[[], T]) -> T:
    with console.status(name):
        result = fn()

    console.print(f"[green]Done[/green] {name}")
    return result
