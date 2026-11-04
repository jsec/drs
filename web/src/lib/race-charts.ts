import { median, sortBy } from 'es-toolkit';

import type { DriverLaps } from '#/lib/api/races';

const PACE_CEILING_RATIO = 1.5;

type LapRow = Record<string, number | string>;

const sortedRows = (rows: Map<number, LapRow>) =>
    sortBy([...rows], [([lapNumber]) => lapNumber]).map(([, row]) => row);

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

export const paceChart = (drivers: DriverLaps[]) => {
    const rows = new Map<number, LapRow>();

    for (const { driver, laps } of drivers) {
        for (const { lap, timeMs } of laps) {
            rows.set(lap, {
                ...rows.get(lap),
                [driver.code]: timeMs / 1000,
                lap: lapLabel(lap),
            });
        }
    }

    const lapSeconds = drivers.flatMap(driver => driver.laps.map(lap => lap.timeMs / 1000));
    const medianLapSeconds = median(lapSeconds);

    return {
        ceiling: medianLapSeconds * PACE_CEILING_RATIO,
        data: sortedRows(rows),
        series: chartSeries(drivers),
    };
};
