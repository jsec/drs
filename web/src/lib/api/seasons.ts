import { z } from 'zod';

export const WDCSchema = z.object({
    countryCode: z.string(),
    id: z.string(),
    name: z.string(),
});

export const ConstructorSchema = z.object({
    color: z.string(),
    id: z.string(),
    name: z.string(),
});

export const SeasonSchema = z.object({
    constructorCount: z.number(),
    raceCount: z.number(),
    season: z.number(),
    wcc: ConstructorSchema.nullable(),
    wdc: WDCSchema,
});

export const SeasonListSchema = z.array(SeasonSchema);

export const DriverStandingSchema = z.object({
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

export const ConstructorStandingSchema = ConstructorSchema.extend({
    points: z.number(),
    position: z.number().nullable(),
    positionLabel: z.string(),
});

export const SeasonStandingsSchema = z.object({
    constructors: z.array(ConstructorStandingSchema),
    drivers: z.array(DriverStandingSchema),
    maxConstructorPoints: z.number(),
});

export const ProgressionSeriesSchema = z.object({
    color: z.string(),
    name: z.string(),
});

export const ProgressionDataRowSchema = z.object({
    round: z.number(),
}).catchall(z.number());

export const ProgressionSchema = z.object({
    data: z.array(ProgressionDataRowSchema),
    series: z.array(ProgressionSeriesSchema),
});

export const SeasonOverviewSchema = SeasonStandingsSchema.extend({
    leader: DriverStandingSchema.nullable(),
    progression: ProgressionSchema,
    runnerUp: DriverStandingSchema.nullable(),
});

export type Constructor = z.infer<typeof ConstructorSchema>;
export type ConstructorStanding = z.infer<typeof ConstructorStandingSchema>;
export type DriverStanding = z.infer<typeof DriverStandingSchema>;
export type ListSeasonsResponse = z.infer<typeof SeasonListSchema>;
export type Progression = z.infer<typeof ProgressionSchema>;
export type ProgressionDataRow = z.infer<typeof ProgressionDataRowSchema>;
export type ProgressionSeries = z.infer<typeof ProgressionSeriesSchema>;
export type SeasonOverview = z.infer<typeof SeasonOverviewSchema>;
export type SeasonResponse = z.infer<typeof SeasonSchema>;
export type SeasonStandings = z.infer<typeof SeasonStandingsSchema>;
export type WDC = z.infer<typeof WDCSchema>;
