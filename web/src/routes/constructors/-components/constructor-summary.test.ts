import { describe, expect, it } from 'vitest';

import { countSeasons, splitDrivers } from './constructor-summary';

describe('countSeasons', () => {
    it('counts a multi-engine year once', () => {
        expect(countSeasons([{ season: 1967 }, { season: 1967 }, { season: 1968 }])).toBe(2);
    });
});

describe('splitDrivers', () => {
    it('shows three drivers and counts the rest', () => {
        expect(splitDrivers(['a', 'b', 'c', 'd', 'e'])).toEqual({ more: 2, shown: ['a', 'b', 'c'] });
    });

    it('shows every driver when there are three or fewer', () => {
        expect(splitDrivers(['a', 'b'])).toEqual({ more: 0, shown: ['a', 'b'] });
    });
});
