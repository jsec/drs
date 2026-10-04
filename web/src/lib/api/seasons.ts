import { z } from 'zod';

const WDCSchema = z.object({
    countryCode: z.string(),
    id: z.string(),
    name: z.string(),
});

export const ConstructorSchema = z.object({
    color: z.string(),
    id: z.string(),
    name: z.string(),
});

const SeasonSchema = z.object({
    constructorCount: z.number(),
    raceCount: z.number(),
    season: z.number(),
    wcc: ConstructorSchema.nullable(),
    wdc: WDCSchema,
});

export const SeasonListSchema = z.array(SeasonSchema);

const DriverStandingSchema = z.object({
    carNumber: z.number().nullable(),
    code: z.string(),
    constructor: ConstructorSchema.nullable(),
    country: z.string(),
    countryCode: z.string(),
    id: z.string(),
    name: z.string(),
    podiums: z.number(),
    points: z.number(),
    poles: z.number(),
    position: z.number().nullable(),
    positionLabel: z.string(),
    wins: z.number(),
});

const ConstructorStandingSchema = ConstructorSchema.extend({
    countryCode: z.string(),
    engineId: z.string(),
    points: z.number(),
    position: z.number().nullable(),
    positionLabel: z.string(),
});

const ProgressionSeriesSchema = z.object({
    color: z.string().default('var(--neutral-500)'),
    name: z.string(),
});

const ProgressionDataRowSchema = z.object({
    round: z.number(),
}).catchall(z.number());

const ProgressionSchema = z.object({
    data: z.array(ProgressionDataRowSchema),
    series: z.array(ProgressionSeriesSchema),
});

export const SeasonOverviewSchema = z.object({
    constructors: z.array(ConstructorStandingSchema),
    drivers: z.array(DriverStandingSchema),
    leader: DriverStandingSchema.nullable(),
    maxConstructorPoints: z.number(),
    progression: ProgressionSchema,
    runnerUp: DriverStandingSchema.nullable(),
});

const SeasonCalendarEntrySchema = z.object({
    circuit: z.object({
        id: z.string(),
        name: z.string(),
    }),
    code: z.string().nullable(),
    completed: z.boolean(),
    date: z.string().nullable(),
    name: z.string(),
    raceId: z.number().int(),
    round: z.number().int(),
    winner: z.object({
        code: z.string(),
        constructor: ConstructorSchema.nullable(),
        id: z.string(),
        name: z.string(),
    }).nullable(),
});

export const SeasonCalendarSchema = z.object({
    races: z.array(SeasonCalendarEntrySchema),
    roundsCompleted: z.number().int(),
    totalRounds: z.number().int(),
});

export type ConstructorStanding = z.infer<typeof ConstructorStandingSchema>;
export type DriverStanding = z.infer<typeof DriverStandingSchema>;
export type ListSeasonsResponse = z.infer<typeof SeasonListSchema>;
export type SeasonCalendarEntry = z.infer<typeof SeasonCalendarEntrySchema>;
