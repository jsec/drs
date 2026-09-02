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

export const DriverShortSummaryListSchema = v.array(DriverShortSummarySchema);

export type DriverShortSummary = v.InferOutput<typeof DriverShortSummarySchema>;
