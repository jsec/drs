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

export const DriverShortSummaryListSchema = z.array(DriverShortSummarySchema);

export type DriverShortSummary = z.infer<typeof DriverShortSummarySchema>;
export type DriverSummary = z.infer<typeof DriverSummarySchema>;
