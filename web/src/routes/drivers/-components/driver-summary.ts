const FORMER_CHAMPION_COLOR = '#c79100';
const INACTIVE_DRIVER_COLOR = 'var(--neutral-500)';

type DriverCareerYears = {
    firstYear: null | number;
    isActive: boolean;
    lastYear: null | number;
};

type DriverHero = {
    championships: number;
    constructorColor: string;
    isActive: boolean;
};

const numericPosition = (position: string) => /^\d+$/.test(position) ? Number(position) : null;

export const formatDriverYears = ({ firstYear, isActive, lastYear }: DriverCareerYears) => {
    if (!firstYear) {
        return '-';
    }

    if (isActive || !lastYear) {
        return `${firstYear}–`;
    }

    return `${firstYear}–${lastYear}`;
};

export const driverSummaryColor = ({ championships, constructorColor, isActive }: DriverHero) => {
    if (isActive) {
        return constructorColor;
    }

    return championships > 0 ? FORMER_CHAMPION_COLOR : INACTIVE_DRIVER_COLOR;
};

export const formatChampionshipPosition = (position: string) => {
    const numeric = numericPosition(position);
    return numeric === null ? position : `P${numeric}`;
};

export const isChampionshipWinner = (position: string) => numericPosition(position) === 1;

export const championshipPositionColor = (position: string): string => {
    const numeric = numericPosition(position);

    if (numeric === 1) {
        return 'var(--gold-500)';
    }

    if (numeric !== null && numeric <= 3) {
        return 'var(--mantine-color-text)';
    }

    return 'var(--mantine-color-dimmed)';
};
