export function formatLapTime(ms: number): string {
    const minutes = Math.floor(ms / 60_000);
    const seconds = ((ms % 60_000) / 1000).toFixed(3).padStart(6, '0');
    return `${minutes}:${seconds}`;
}

export function formatPosition(label: string): string {
    if (isNumericPosition(label)) {
        return `P${label}`;
    }

    return label;
}

export function isNumericPosition(label: string): boolean {
    return !Number.isNaN(Number(label));
}
