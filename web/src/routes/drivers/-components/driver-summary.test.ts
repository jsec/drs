import { describe, expect, it } from 'vitest';

import { driverSummaryColor } from './driver-summary';

describe('driverSummaryColor', () => {
    it('uses the active driver constructor color', () => {
        expect(driverSummaryColor({ championships: 0, constructorColor: '#3671C6', isActive: true })).toBe('#3671C6');
    });

    it('uses gold for a retired world champion', () => {
        expect(driverSummaryColor({ championships: 7, constructorColor: '', isActive: false })).toBe('#c79100');
    });

    it('uses grey for another retired driver', () => {
        expect(driverSummaryColor({ championships: 0, constructorColor: '', isActive: false })).toBe('var(--neutral-500)');
    });
});
