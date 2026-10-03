import { isNumericPosition } from '#/lib/format';

const FORMER_CHAMPION_COLOR = '#c79100';
const INACTIVE_DRIVER_COLOR = 'var(--neutral-500)';

type DriverHero = {
    championships: number;
    constructorColor: string;
    isActive: boolean;
};

export const driverSummaryColor = ({ championships, constructorColor, isActive }: DriverHero) => {
    if (isActive) {
        return constructorColor;
    }

    if (championships > 0) {
        return FORMER_CHAMPION_COLOR;
    }

    return INACTIVE_DRIVER_COLOR;
};

export const isChampionshipWinner = (position: string) => position === '1';

export const championshipPositionColor = (position: string): string => {
    if (isChampionshipWinner(position)) {
        return 'var(--gold-500)';
    }

    if (isNumericPosition(position) && Number(position) <= 3) {
        return 'var(--mantine-color-text)';
    }

    return 'var(--mantine-color-dimmed)';
};
