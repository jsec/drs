import * as v from 'valibot';

export const ConstructorSchema = v.object({
    championships: v.number(),
    color: v.string(),
    firstRaceDate: v.nullable(v.string()),
    id: v.string(),
    lastRaceDate: v.nullable(v.string()),
    name: v.string(),
    podiums: v.number(),
    wins: v.number(),
});

export const ConstructorListSchema = v.array(ConstructorSchema);

export type ConstructorResponse = v.InferOutput<typeof ConstructorSchema>;
export type ListConstructorsResponse = v.InferOutput<typeof ConstructorListSchema>;
