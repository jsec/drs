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
