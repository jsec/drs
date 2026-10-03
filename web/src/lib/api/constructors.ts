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

export type ConstructorResponse = z.infer<typeof ConstructorSchema>;
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
