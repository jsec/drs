import * as v from 'valibot';

export const WDCSchema = v.object({
    countryCode: v.string(),
    id: v.string(),
    name: v.string(),
});

export const WCCSchema = v.object({
    color: v.string(),
    id: v.string(),
    name: v.string(),
});

export const SeasonSchema = v.object({
    constructorCount: v.number(),
    raceCount: v.number(),
    season: v.number(),
    wcc: v.nullable(WCCSchema),
    wdc: WDCSchema,
});

export const SeasonListSchema = v.array(SeasonSchema);

export type ListSeasonsResponse = v.InferOutput<typeof SeasonListSchema>;
export type SeasonResponse = v.InferOutput<typeof SeasonSchema>;
export type WCC = v.InferOutput<typeof WCCSchema>;
export type WDC = v.InferOutput<typeof WDCSchema>;
