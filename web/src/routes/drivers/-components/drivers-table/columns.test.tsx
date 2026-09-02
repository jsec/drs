import { describe, expect, it } from 'vitest';

import { driverBadgeColor, formatYears } from './columns';

describe('formatYears', () => {
    it('renders an open range for an active driver', () => {
        expect(formatYears({ firstYear: 2007, isActive: true, lastYear: 2026 })).toBe('2007–');
    });

    it('renders a closed range for an inactive driver', () => {
        expect(formatYears({ firstYear: 1991, isActive: false, lastYear: 2012 })).toBe('1991–2012');
    });
});

describe('driverBadgeColor', () => {
    it('uses the active driver constructor color', () => {
        expect(driverBadgeColor({ championships: 0, constructorColor: '#E8002D', isActive: true }))
            .toBe('#E8002D');
    });

    it('uses gold for an inactive former world champion', () => {
        expect(driverBadgeColor({ championships: 7, constructorColor: '', isActive: false }))
            .toBe('#c79100');
    });

    it('uses grey for an inactive driver without a championship', () => {
        expect(driverBadgeColor({ championships: 0, constructorColor: '', isActive: false }))
            .toBe('var(--neutral-500)');
    });
});
