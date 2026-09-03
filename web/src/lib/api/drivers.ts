import * as v from 'valibot';

export const DriverShortSummarySchema = v.object({
    championships: v.number(),
    code: v.string(),
    constructorColor: v.string(),
    firstYear: v.nullable(v.number()),
    id: v.string(),
    isActive: v.boolean(),
    lastYear: v.nullable(v.number()),
    name: v.string(),
    podiums: v.number(),
    poles: v.number(),
    starts: v.number(),
    wins: v.number(),
});

const DriverSeasonSummary = v.object({
    constructor: v.object({
        color: v.string(),
        name: v.string(),
    }),
    podiums: v.number(),
    points: v.number(),
    poles: v.number(),
    position: v.string(),
    season: v.number(),
    starts: v.number(),
    wins: v.number(),
});

export const DriverSummarySchema = v.object(({
    championships: v.number(),
    code: v.string(),
    constructorColor: v.string(),
    country: v.string(),
    countryCode: v.string(),
    firstYear: v.nullable(v.number()),
    isActive: v.boolean(),
    lastYear: v.nullable(v.number()),
    name: v.string(),
    podiums: v.number(),
    poles: v.number(),
    seasons: v.array(DriverSeasonSummary),
    starts: v.number(),
    wins: v.number(),
}));

export const DriverShortSummaryListSchema = v.array(DriverShortSummarySchema);

export type DriverShortSummary = v.InferOutput<typeof DriverShortSummarySchema>;
export type DriverSummary = v.InferOutput<typeof DriverSummarySchema>;
