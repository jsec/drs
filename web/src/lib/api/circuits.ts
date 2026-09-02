import * as v from 'valibot';

export const CircuitListItemSchema = v.object({
    circuitId: v.string(),
    country: v.string(),
    firstRaceYear: v.optional(v.number()),
    lastRaceYear: v.optional(v.number()),
    location: v.string(),
    name: v.string(),
    raceCount: v.number(),
});

export const CircuitListSchema = v.array(CircuitListItemSchema);

const CircuitRaceSummarySchema = v.object({
    date: v.nullable(v.string()),
    name: v.string(),
    raceId: v.nullable(v.number()),
});

const CircuitRaceSchema = v.object({
    date: v.nullable(v.string()),
    layoutId: v.string(),
    name: v.string(),
    raceId: v.number(),
    winnerId: v.string(),
    winnerName: v.string(),
});

export const CircuitSummarySchema = v.object({
    circuitId: v.string(),
    circuitType: v.string(),
    country: v.string(),
    countryCode: v.string(),
    countryId: v.string(),
    firstRace: CircuitRaceSummarySchema,
    lastRace: CircuitRaceSummarySchema,
    layoutId: v.string(),
    name: v.string(),
    previousNames: v.array(v.string()),
    raceCount: v.number(),
    races: v.array(CircuitRaceSchema),
    turns: v.number(),
});

export type CircuitSummaryResponse = v.InferOutput<typeof CircuitSummarySchema>;
export type ListCircuitsResponse = v.InferOutput<typeof CircuitListItemSchema>;
