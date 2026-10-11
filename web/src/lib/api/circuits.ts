import { z } from 'zod';

const CircuitListItemSchema = z.object({
    circuitId: z.string(),
    country: z.string(),
    firstRaceYear: z.number().nullable(),
    lastRaceYear: z.number().nullable(),
    location: z.string(),
    name: z.string(),
    raceCount: z.number(),
});

export const CircuitListSchema = z.array(CircuitListItemSchema);

const CircuitRaceSummarySchema = z.object({
    date: z.string().nullable(),
    name: z.string(),
});

const CircuitRaceSchema = z.object({
    date: z.string().nullable(),
    layoutId: z.string(),
    name: z.string(),
    raceId: z.number(),
    winnerName: z.string(),
});

export const CircuitSummarySchema = z.object({
    circuitId: z.string(),
    country: z.string(),
    countryCode: z.string(),
    firstRace: CircuitRaceSummarySchema,
    lastRace: CircuitRaceSummarySchema,
    layoutId: z.string(),
    name: z.string(),
    raceCount: z.number(),
    races: z.array(CircuitRaceSchema),
    turns: z.number(),
});

export type CircuitListItem = z.infer<typeof CircuitListItemSchema>;
