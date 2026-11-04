export const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

type CareerYears = {
    firstYear: null | number;
    isActive: boolean;
    lastYear: null | number;
};

export function formatCareerYears(career: CareerYears): string {
    if (!career.firstYear) {
        return '-';
    }

    if (career.isActive || !career.lastYear) {
        return `${career.firstYear}–`;
    }

    return `${career.firstYear}–${career.lastYear}`;
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
    const seconds = ((ms % MS_PER_MINUTE) / MS_PER_SECOND).toFixed(3).padStart(6, '0');

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
