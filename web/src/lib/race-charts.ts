import type { DriverLaps, RaceLaps } from '#/lib/api/races';

export const CHART_DRIVER_COUNT = 5;
export const POSITION_LAP_STEP = 5;

const PACE_OUTLIER_RATIO = 1.07;

type LapRow = Record<string, number | string>;

const sortedRows = (rows: Map<number, LapRow>) =>
    [...rows].toSorted(([a], [b]) => a - b).map(([, row]) => row);

const chartSeries = (drivers: DriverLaps[]) =>
    drivers.map(({ color, driver }) => ({
        color,
        name: driver.code,
    }));

export const hasLaps = (raceLaps: RaceLaps) =>
    raceLaps.drivers.some(driver => driver.laps.length > 0);

export const positionChart = (raceLaps: RaceLaps) => {
    const drivers = raceLaps.drivers.slice(0, CHART_DRIVER_COUNT);
    const rows = new Map<number, LapRow>();

    for (const { driver, laps } of drivers) {
        for (const { lap, position } of laps) {
            if (position !== null && lap % POSITION_LAP_STEP === 1) {
                rows.set(lap, {
                    ...rows.get(lap),
                    [driver.code]: position,
                    lap: `L${lap}`,
                });
            }
        }
    }

    return { data: sortedRows(rows), series: chartSeries(drivers) };
};

export const paceChart = (raceLaps: RaceLaps) => {
    const drivers = raceLaps.drivers.slice(0, CHART_DRIVER_COUNT);
    const fastestMs = Math.min(...drivers.flatMap(({ laps }) => laps.map(lap => lap.timeMs)));
    const rows = new Map<number, LapRow>();

    for (const { driver, laps } of drivers) {
        for (const { lap, timeMs } of laps) {
            if (lap > 1 && timeMs <= fastestMs * PACE_OUTLIER_RATIO) {
                rows.set(lap, {
                    ...rows.get(lap),
                    [driver.code]: timeMs / 1000,
                    lap: `L${lap}`,
                });
            }
        }
    }

    return { data: sortedRows(rows), series: chartSeries(drivers) };
};
