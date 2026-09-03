import { queryOptions } from '@tanstack/react-query';

import {
    getAllTimeDrivers,
    getCalendar,
    getDriverSeason,
    getRaceDetail,
    getSeasonOverview,
    getStandings,
} from './fixtures';

export const seasonOverviewQuery = (year: number) =>
    queryOptions({
        queryFn: () => getSeasonOverview(),
        queryKey: ['season-overview', year],
    });

export const allTimeDriversQuery = () =>
    queryOptions({
        queryFn: () => getAllTimeDrivers(),
        queryKey: ['all-time-drivers'],
    });

export const raceDetailQuery = (year: number, round: number) =>
    queryOptions({
        queryFn: () => {
            const race = getRaceDetail(round);
            if (!race) throw new Error(`Unknown round ${round}`);
            return race;
        },
        queryKey: ['race-detail', year, round],
    });

export const standingsQuery = (year: number) =>
    queryOptions({
        queryFn: () => getStandings(),
        queryKey: ['standings', year],
    });

export const calendarQuery = (year: number) =>
    queryOptions({
        queryFn: () => getCalendar(),
        queryKey: ['calendar', year],
    });

export const driverSeasonQuery = (year: number, code: string) =>
    queryOptions({
        queryFn: () => {
            const detail = getDriverSeason(code);
            if (!detail) throw new Error(`Unknown driver ${code}`);
            return detail;
        },
        queryKey: ['driver-season', year, code],
    });
