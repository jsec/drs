import { z } from 'zod';

export const ConstructorSchema = z.object({
    championships: z.number(),
    color: z.string(),
    firstRaceDate: z.string().nullable(),
    id: z.string(),
    lastRaceDate: z.string().nullable(),
    name: z.string(),
    podiums: z.number(),
    wins: z.number(),
});

export const ConstructorListSchema = z.array(ConstructorSchema);

export type ListConstructorsResponse = z.infer<typeof ConstructorListSchema>;

const LineageEntrySchema = z.object({
    id: z.string(),
    name: z.string(),
    order: z.number(),
    yearFrom: z.number(),
    yearTo: z.number().nullable(),
});

const SeasonDriverSchema = z.object({
    id: z.string(),
    name: z.string(),
});

const ConstructorSeasonSchema = z.object({
    drivers: z.array(SeasonDriverSchema),
    engine: z.string(),
    isChampion: z.boolean(),
    podiums: z.number(),
    points: z.number().nullable(),
    poles: z.number(),
    position: z.string(),
    season: z.number(),
    starts: z.number(),
    wins: z.number(),
});

export const ConstructorSummarySchema = z.object({
    championships: z.number(),
    color: z.string(),
    country: z.string(),
    countryCode: z.string(),
    firstYear: z.number().nullable(),
    fullName: z.string(),
    id: z.string(),
    isActive: z.boolean(),
    lastYear: z.number().nullable(),
    lineage: z.array(LineageEntrySchema),
    name: z.string(),
    podiums: z.number(),
    poles: z.number(),
    seasons: z.array(ConstructorSeasonSchema),
    starts: z.number(),
    wins: z.number(),
});

export type ConstructorSummary = z.infer<typeof ConstructorSummarySchema>;

export const SprintResultSchema = z.object({
    points: z.number(),
    positionLabel: z.string(),
});

const SeasonDriverSummarySchema = z.object({
    code: z.string(),
    id: z.string(),
    name: z.string(),
    podiums: z.number(),
    points: z.number(),
    starts: z.number(),
    wins: z.number(),
});

const SeasonEntrySchema = z.object({
    engine: z.string(),
    position: z.string(),
});

export const ProgressionPointSchema = z.object({
    points: z.number(),
    round: z.number(),
});

const ConstructorSeasonResultSchema = z.object({
    driverCode: z.string(),
    driverId: z.string(),
    finishOrder: z.number(),
    points: z.number(),
    positionLabel: z.string(),
    raceName: z.string(),
    round: z.number(),
    sprint: SprintResultSchema.nullable(),
    statusCategory: z.string(),
});

export const ConstructorSeasonDetailSchema = z.object({
    color: z.string(),
    countryCode: z.string(),
    dnfs: z.number(),
    drivers: z.array(SeasonDriverSummarySchema),
    entries: z.array(SeasonEntrySchema),
    id: z.string(),
    isChampion: z.boolean(),
    name: z.string(),
    podiums: z.number(),
    points: z.number().nullable(),
    poles: z.number(),
    position: z.string(),
    progression: z.array(ProgressionPointSchema),
    results: z.array(ConstructorSeasonResultSchema),
    wins: z.number(),
});

export type ConstructorSeasonResult = z.infer<typeof ConstructorSeasonResultSchema>;
