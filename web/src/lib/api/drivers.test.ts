import { safeParse } from 'valibot';
import { describe, expect, it } from 'vitest';

import { DriverShortSummaryListSchema, DriverSummarySchema } from './drivers';

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

describe('DriverSummarySchema', () => {
    it('keeps the hero fields from a driver detail response', () => {
        const response = {
            championships: 4,
            code: 'VET',
            constructorColor: '#3671C6',
            country: 'Germany',
            countryCode: 'de',
            firstYear: 2007,
            isActive: false,
            lastYear: 2022,
            name: 'Sebastian Vettel',
            podiums: 122,
            poles: 57,
            seasons: [],
            starts: 299,
            wins: 53,
        };

        const result = safeParse(DriverSummarySchema, response);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.output).toMatchObject({
                constructorColor: '#3671C6',
                firstYear: 2007,
                isActive: false,
                lastYear: 2022,
            });
        }
    });
});
