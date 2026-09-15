import { z } from 'zod';

export const CircuitListItemSchema = z.object({
    circuitId: z.string(),
    country: z.string(),
    firstRaceYear: z.number().optional(),
    lastRaceYear: z.number().optional(),
    location: z.string(),
    name: z.string(),
    raceCount: z.number(),
});

export const CircuitListSchema = z.array(CircuitListItemSchema);

const CircuitRaceSummarySchema = z.object({
    date: z.string().nullable(),
    name: z.string(),
    raceId: z.number().nullable(),
});

const CircuitRaceSchema = z.object({
    date: z.string().nullable(),
    layoutId: z.string(),
    name: z.string(),
    raceId: z.number(),
    winnerId: z.string(),
    winnerName: z.string(),
});

export const CircuitSummarySchema = z.object({
    circuitId: z.string(),
    circuitType: z.string(),
    country: z.string(),
    countryCode: z.string(),
    countryId: z.string(),
    firstRace: CircuitRaceSummarySchema,
    lastRace: CircuitRaceSummarySchema,
    layoutId: z.string(),
    name: z.string(),
    previousNames: z.array(z.string()),
    raceCount: z.number(),
    races: z.array(CircuitRaceSchema),
    turns: z.number(),
});

export type CircuitSummaryResponse = z.infer<typeof CircuitSummarySchema>;
export type ListCircuitsResponse = z.infer<typeof CircuitListItemSchema>;
