const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

type CareerYears = {
    firstYear: null | number;
    isActive: boolean;
    lastYear: null | number;
};

export function formatCareerYears({ firstYear, isActive, lastYear }: CareerYears): string {
    if (!firstYear) {
        return '-';
    }

    if (isActive || !lastYear) {
        return `${firstYear}–`;
    }

    return `${firstYear}–${lastYear}`;
}

export function formatGrid(grid: null | number): string {
    if (grid === null) {
        return 'PL';
    }

    return `P${grid}`;
}

export function formatLapTime(ms: number): string {
    const hours = Math.floor(ms / MS_PER_HOUR);
    const minutes = Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE);
    const seconds = ((ms % MS_PER_MINUTE) / 1000).toFixed(3).padStart(6, '0');

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

export function formatPosition(label: string): string {
    if (label === '') {
        return '—';
    }

    if (isNumericPosition(label)) {
        return `P${label}`;
    }

    return label;
}

export function isNumericPosition(label: string): boolean {
    return label !== '' && !Number.isNaN(Number(label));
}
