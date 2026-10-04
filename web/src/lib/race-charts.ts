import type { DriverLaps } from '#/lib/api/races';

const PACE_OUTLIER_RATIO = 1.07;

type LapRow = Record<string, number | string>;

const sortedRows = (rows: Map<number, LapRow>) =>
    [...rows].toSorted(([a], [b]) => a - b).map(([, row]) => row);

const chartSeries = (drivers: DriverLaps[]) =>
    drivers.map(({ color, driver }) => ({
        color,
        name: driver.code,
    }));

export const lapLabel = (lap: number) => `L${lap}`;

export const positionChart = (drivers: DriverLaps[], lapStep: number) => {
    const rows = new Map<number, LapRow>();

    for (const { driver, laps } of drivers) {
        for (const { lap, position } of laps) {
            if (position !== null && (lap - 1) % lapStep === 0) {
                rows.set(lap, {
                    ...rows.get(lap),
                    [driver.code]: position,
                    lap: lapLabel(lap),
                });
            }
        }
    }

    return { data: sortedRows(rows), series: chartSeries(drivers) };
};

export const paceChart = (drivers: DriverLaps[], shouldHideOutliers: boolean) => {
    const fastestMs = Math.min(...drivers.flatMap(({ laps }) => laps.map(lap => lap.timeMs)));
    const rows = new Map<number, LapRow>();

    for (const { driver, laps } of drivers) {
        for (const { lap, timeMs } of laps) {
            const row: LapRow = { ...rows.get(lap), lap: lapLabel(lap) };
            const isOutlier = lap === 1 || timeMs > fastestMs * PACE_OUTLIER_RATIO;

            if (!shouldHideOutliers || !isOutlier) {
                row[driver.code] = timeMs / 1000;
            }

            rows.set(lap, row);
        }
    }

    return { data: sortedRows(rows), series: chartSeries(drivers) };
};
