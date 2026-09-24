import { queryOptions } from '@tanstack/react-query';

import { SeasonOverviewSchema, SeasonStandingsSchema } from '#/lib/api/seasons';
import { api } from '#/lib/query/api';

import {
    getAllTimeDrivers,
    getCalendar,
    getDriverSeason,
    getRaceDetail,
    getStandings,
} from './fixtures';

const getSeasonStandings = (year: number) =>
    api.get(`seasons/${year}/standings`).json(SeasonStandingsSchema);

export const seasonOverviewQuery = (year: number) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}`).json(SeasonOverviewSchema),
        queryKey: ['season-overview', year],
    });

export const seasonStandingsQuery = (year: number) =>
    queryOptions({
        queryFn: () => getSeasonStandings(year),
        queryKey: ['season-standings', year],
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
