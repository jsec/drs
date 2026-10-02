import { describe, expect, it } from 'vitest';

import { formatLapTime, formatPosition } from './format';

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
});
