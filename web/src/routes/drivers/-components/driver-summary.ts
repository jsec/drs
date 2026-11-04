import { isNumericPosition } from '#/lib/format';

const FORMER_CHAMPION_COLOR = '#c79100';
const INACTIVE_DRIVER_COLOR = 'var(--neutral-500)';
const PODIUM_SIZE = 3;

type DriverHero = {
    championships: number;
    constructorColor: string;
    isActive: boolean;
};

export const driverSummaryColor = (driver: DriverHero) => {
    if (driver.isActive) {
        return driver.constructorColor;
    }

    if (driver.championships > 0) {
        return FORMER_CHAMPION_COLOR;
    }

    return INACTIVE_DRIVER_COLOR;
};

export const championshipPositionColor = (position: string): string => {
    if (position === '1') {
        return 'var(--gold-500)';
    }

    if (isNumericPosition(position) && Number(position) <= PODIUM_SIZE) {
        return 'var(--mantine-color-text)';
    }

    return 'var(--mantine-color-dimmed)';
};
