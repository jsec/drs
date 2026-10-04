import { describe, expect, it } from 'vitest';

import { formatCareerYears, formatLapTime, formatPosition, isNumericPosition } from './format';

describe('formatLapTime', () => {
    it('pads seconds and keeps milliseconds', () => {
        expect(formatLapTime(89_205)).toBe('1:29.205');
        expect(formatLapTime(65_004)).toBe('1:05.004');
    });
});

describe('formatPosition', () => {
    it('prefixes numeric positions only', () => {
        expect(formatPosition('3')).toBe('P3');
        expect(formatPosition('DNF')).toBe('DNF');
    });

    it('shows a dash for a missing position', () => {
        expect(formatPosition('')).toBe('—');
    });
});

describe('isNumericPosition', () => {
    it('rejects an empty label', () => {
        expect(isNumericPosition('')).toBe(false);
        expect(isNumericPosition('12')).toBe(true);
    });
});

describe('formatCareerYears', () => {
    it('keeps an active career open', () => {
        expect(formatCareerYears({ firstYear: 2007, isActive: true, lastYear: 2026 })).toBe('2007–');
    });

    it('shows both years for a finished career', () => {
        expect(formatCareerYears({ firstYear: 1991, isActive: false, lastYear: 2012 })).toBe('1991–2012');
    });
});
