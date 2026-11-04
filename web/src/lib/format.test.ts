import { describe, expect, it } from 'vitest';

import { formatCareerYears, formatLapTime, formatPosition, isNumericPosition } from './format';

describe('formatLapTime', () => {
    it('should pad seconds and keeps milliseconds', () => {
        expect(formatLapTime(89_205)).toBe('1:29.205');
        expect(formatLapTime(65_004)).toBe('1:05.004');
    });

    it('should add hours for a lap that includes a red flag stoppage', () => {
        expect(formatLapTime(7_503_775)).toBe('2:05:03.775');
    });
});

describe('formatPosition', () => {
    it('should prefix numeric positions only', () => {
        expect(formatPosition('3')).toBe('P3');
        expect(formatPosition('DNF')).toBe('DNF');
    });

    it('should show a dash for a missing position', () => {
        expect(formatPosition('')).toBe('—');
    });
});

describe('isNumericPosition', () => {
    it('should reject an empty label', () => {
        expect(isNumericPosition('')).toBe(false);
        expect(isNumericPosition('12')).toBe(true);
    });
});

describe('formatCareerYears', () => {
    it('should keep an active career open', () => {
        const career = {
            firstYear: 2007,
            isActive: true,
            lastYear: 2026,
        };

        expect(formatCareerYears(career)).toBe('2007–');
    });

    it('should show both years for a finished career', () => {
        const career = {
            firstYear: 1991,
            isActive: false,
            lastYear: 2012,
        };

        expect(formatCareerYears(career)).toBe('1991–2012');
    });
});
