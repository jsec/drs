import { z } from 'zod';

export const WDCSchema = z.object({
    countryCode: z.string(),
    id: z.string(),
    name: z.string(),
});

export const WCCSchema = z.object({
    color: z.string(),
    id: z.string(),
    name: z.string(),
});

export const SeasonSchema = z.object({
    constructorCount: z.number(),
    raceCount: z.number(),
    season: z.number(),
    wcc: WCCSchema.nullable(),
    wdc: WDCSchema,
});

export const SeasonListSchema = z.array(SeasonSchema);

export type ListSeasonsResponse = z.infer<typeof SeasonListSchema>;
export type SeasonResponse = z.infer<typeof SeasonSchema>;
export type WCC = z.infer<typeof WCCSchema>;
export type WDC = z.infer<typeof WDCSchema>;
