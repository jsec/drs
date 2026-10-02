import { z } from 'zod';

export const DriverShortSummarySchema = z.object({
    championships: z.number(),
    code: z.string(),
    constructorColor: z.string(),
    firstYear: z.number().nullable(),
    id: z.string(),
    isActive: z.boolean(),
    lastYear: z.number().nullable(),
    name: z.string(),
    podiums: z.number(),
    poles: z.number(),
    starts: z.number(),
    wins: z.number(),
});

const DriverSeasonSummary = z.object({
    constructor: z.object({
        color: z.string(),
        name: z.string(),
    }),
    podiums: z.number(),
    points: z.number(),
    poles: z.number(),
    position: z.string(),
    season: z.number(),
    starts: z.number(),
    wins: z.number(),
});

export const DriverSummarySchema = z.object({
    championships: z.number(),
    code: z.string(),
    constructorColor: z.string(),
    country: z.string(),
    countryCode: z.string(),
    firstYear: z.number().nullable(),
    isActive: z.boolean(),
    lastYear: z.number().nullable(),
    name: z.string(),
    podiums: z.number(),
    poles: z.number(),
    seasons: z.array(DriverSeasonSummary),
    starts: z.number(),
    wins: z.number(),
});

const DriverSeasonRaceSchema = z.object({
    grid: z.number().nullable(),
    name: z.string(),
    points: z.number(),
    position: z.number().nullable(),
    positionLabel: z.string(),
    round: z.number(),
    sprint: z.object({
        points: z.number(),
        positionLabel: z.string(),
    }).nullable(),
    statusCategory: z.string(),
});

const ProgressionPointSchema = z.object({
    points: z.number(),
    round: z.number(),
});

export const DriverSeasonSchema = z.object({
    carNumber: z.number().nullable(),
    code: z.string(),
    constructor: z.object({
        color: z.string(),
        name: z.string(),
    }),
    country: z.string(),
    countryCode: z.string(),
    name: z.string(),
    podiums: z.number(),
    points: z.number(),
    poles: z.number(),
    position: z.string(),
    progression: z.array(ProgressionPointSchema),
    races: z.array(DriverSeasonRaceSchema),
    wins: z.number(),
});

const PitStopSchema = z.object({
    duration: z.string(),
    durationMs: z.number().nullable(),
    lap: z.number(),
    stop: z.number(),
});

export const DriverRaceSchema = z.object({
    bestQualifyingTime: z.string(),
    carNumber: z.number().nullable(),
    code: z.string(),
    constructor: z.object({
        color: z.string(),
        name: z.string(),
    }),
    fastestLapRank: z.number().nullable(),
    gap: z.string(),
    grid: z.number().nullable(),
    hasSprint: z.boolean(),
    isDriverOfTheDay: z.boolean(),
    isFastestLap: z.boolean(),
    isGrandSlam: z.boolean(),
    isPole: z.boolean(),
    isWin: z.boolean(),
    lapsCompleted: z.number().nullable(),
    name: z.string(),
    pitStopCount: z.number().nullable(),
    pitStops: z.array(PitStopSchema),
    points: z.number(),
    position: z.number().nullable(),
    positionLabel: z.string(),
    positionsGained: z.number().nullable(),
    qualifyingPositionLabel: z.string(),
    raceName: z.string(),
    statusCategory: z.string(),
    time: z.string(),
    timePenalty: z.string(),
});

export const DriverShortSummaryListSchema = z.array(DriverShortSummarySchema);

export type DriverRace = z.infer<typeof DriverRaceSchema>;
export type DriverSeason = z.infer<typeof DriverSeasonSchema>;
export type DriverSeasonRace = z.infer<typeof DriverSeasonRaceSchema>;
export type DriverShortSummary = z.infer<typeof DriverShortSummarySchema>;
export type DriverSummary = z.infer<typeof DriverSummarySchema>;
