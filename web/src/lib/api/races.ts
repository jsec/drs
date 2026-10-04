import { z } from 'zod';

import { ConstructorSchema } from './seasons';

export const SessionSchema = z.enum(['race', 'sprint']);

export const DriverRefSchema = z.object({
    code: z.string(),
    id: z.string(),
});

export const RaceResultSchema = z.object({
    constructor: ConstructorSchema,
    driver: DriverRefSchema.extend({
        name: z.string(),
        shortName: z.string(),
    }),
    gap: z.string().nullable(),
    grid: z.number().int().nullable(),
    points: z.number(),
    position: z.number().int(),
    positionLabel: z.string(),
    status: z.string().nullable(),
    time: z.string().nullable(),
});

export const RaceDetailSchema = z.object({
    circuit: z.string(),
    date: z.string().nullable(),
    fastestLap: z.object({
        driver: DriverRefSchema,
        time: z.string(),
    }).nullable(),
    laps: z.number().int(),
    name: z.string(),
    pole: DriverRefSchema.nullable(),
    raceId: z.number().int(),
    results: z.array(RaceResultSchema),
    round: z.number().int(),
    season: z.number().int(),
    winner: DriverRefSchema,
});

export const RaceLapSchema = z.object({
    lap: z.number().int(),
    position: z.number().int().nullable(),
    timeMs: z.number().int(),
});

export const DriverLapsSchema = z.object({
    color: z.string(),
    driver: DriverRefSchema,
    laps: z.array(RaceLapSchema),
});

export const RaceLapsSchema = z.object({
    drivers: z.array(DriverLapsSchema),
});

export type DriverLaps = z.infer<typeof DriverLapsSchema>;
export type DriverRef = z.infer<typeof DriverRefSchema>;
export type RaceDetail = z.infer<typeof RaceDetailSchema>;
export type RaceLaps = z.infer<typeof RaceLapsSchema>;
export type RaceResult = z.infer<typeof RaceResultSchema>;
export type Session = z.infer<typeof SessionSchema>;
