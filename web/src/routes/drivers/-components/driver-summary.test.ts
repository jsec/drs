import { describe, expect, it } from 'vitest';

import { driverSummaryColor, formatChampionshipPosition, formatDriverYears } from './driver-summary';

describe('formatDriverYears', () => {
    it('keeps an active driver career open', () => {
        expect(formatDriverYears({ firstYear: 2007, isActive: true, lastYear: 2026 })).toBe('2007–');
    });

    it('shows both years for a retired driver', () => {
        expect(formatDriverYears({ firstYear: 1991, isActive: false, lastYear: 2012 })).toBe('1991–2012');
    });
});

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

describe('formatChampionshipPosition', () => {
    it('prefixes numeric standings with P', () => {
        expect(formatChampionshipPosition('2')).toBe('P2');
    });

    it('preserves a textual standing', () => {
        expect(formatChampionshipPosition('DSQ')).toBe('DSQ');
    });
});
