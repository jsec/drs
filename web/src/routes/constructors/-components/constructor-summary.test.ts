import { describe, expect, it } from 'vitest';

import { countSeasons } from './constructor-summary';

describe('countSeasons', () => {
    it('counts a multi-engine year once', () => {
        expect(countSeasons([{ season: 1967 }, { season: 1967 }, { season: 1968 }])).toBe(2);
    });
});
