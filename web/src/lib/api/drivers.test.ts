import { safeParse } from 'valibot';
import { describe, expect, it } from 'vitest';

import { DriverShortSummaryListSchema } from './drivers';

const driver = {
    championships: 0,
    code: 'VER',
    constructorColor: '#3671C6',
    firstYear: 2015,
    id: 'max-verstappen',
    isActive: true,
    lastYear: null,
    name: 'Max Verstappen',
    podiums: 118,
    poles: 44,
    starts: 221,
    wins: 65,
};

describe('DriverShortSummaryListSchema', () => {
    it('accepts a driver response with nullable career years', () => {
        expect(safeParse(DriverShortSummaryListSchema, [driver]).success).toBe(true);
    });

    it('rejects a driver response with a non-numeric starts value', () => {
        expect(safeParse(DriverShortSummaryListSchema, [{ ...driver, starts: '221' }]).success).toBe(false);
    });
});
