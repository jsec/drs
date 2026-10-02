import { queryOptions } from '@tanstack/react-query';

import { DriverRaceSchema, DriverSeasonSchema } from '#/lib/api/drivers';
import { RaceDetailSchema, RaceLapsSchema } from '#/lib/api/races';
import { SeasonCalendarSchema, SeasonOverviewSchema, SeasonStandingsSchema } from '#/lib/api/seasons';
import { api } from '#/lib/query/api';

export const seasonOverviewQuery = (year: number) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}`).json(SeasonOverviewSchema),
        queryKey: ['season-overview', year],
    });

export const seasonStandingsQuery = (year: number) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/standings`).json(SeasonStandingsSchema),
        queryKey: ['season-standings', year],
    });

export const raceDetailQuery = (year: number, round: number) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/races/${round}`).json(RaceDetailSchema),
        queryKey: ['race-detail', year, round],
    });

export const raceLapsQuery = (year: number, round: number) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/races/${round}/laps`).json(RaceLapsSchema),
        queryKey: ['race-laps', year, round],
    });

export const seasonCalendarQuery = (year: number) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/calendar`).json(SeasonCalendarSchema),
        queryKey: ['calendar', year],
    });

export const driverSeasonQuery = (year: number, driverId: string) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/drivers/${driverId}`).json(DriverSeasonSchema),
        queryKey: ['driver-season', year, driverId],
    });

export const driverRaceQuery = (year: number, round: number, driverId: string) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/drivers/${driverId}/races/${round}`).json(DriverRaceSchema),
        queryKey: ['driver-race', year, round, driverId],
    });
