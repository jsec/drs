import { queryOptions } from '@tanstack/react-query';

import type { Session } from '#/lib/api/races';

import { ConstructorSeasonDetailSchema } from '#/lib/api/constructors';
import { DriverRaceSchema, DriverSeasonSchema } from '#/lib/api/drivers';
import { RaceDetailSchema, RaceLapsSchema } from '#/lib/api/races';
import { SeasonCalendarSchema, SeasonOverviewSchema } from '#/lib/api/seasons';
import { api } from '#/lib/query/api';

export const seasonOverviewQuery = (year: number) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}`).json(SeasonOverviewSchema),
        queryKey: ['season-overview', year],
    });

export const raceDetailQuery = (year: number, round: number) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/races/${round}`).json(RaceDetailSchema),
        queryKey: ['race-detail', year, round],
    });

export const raceLapsQuery = (year: number, round: number, session: Session = 'race') =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/races/${round}/laps`, { searchParams: { session } }).json(RaceLapsSchema),
        queryKey: ['race-laps', year, round, session],
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

export const driverRaceQuery = (year: number, round: number, driverId: string, session: Session) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/drivers/${driverId}/races/${round}`, { searchParams: { session } }).json(DriverRaceSchema),
        queryKey: ['driver-race', year, round, driverId, session],
    });

export const constructorSeasonQuery = (year: number, constructorId: string) =>
    queryOptions({
        queryFn: () => api.get(`seasons/${year}/constructors/${constructorId}`).json(ConstructorSeasonDetailSchema),
        queryKey: ['constructor-season', year, constructorId],
    });
