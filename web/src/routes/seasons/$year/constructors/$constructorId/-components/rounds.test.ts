import { describe, expect, it } from 'vitest';

import type { ConstructorSeasonResult } from '#/lib/api/constructors';

import { groupRounds } from './rounds';

const result = (overrides: Partial<ConstructorSeasonResult>): ConstructorSeasonResult => ({
    driverCode: 'VER',
    driverId: 'max-verstappen',
    points: 0,
    positionLabel: '1',
    raceName: 'Bahrain Grand Prix',
    round: 1,
    sprint: null,
    statusCategory: 'finished',
    ...overrides,
});

describe('groupRounds', () => {
    it('groups each round with race and sprint points summed', () => {
        const rounds = groupRounds([
            result({ points: 25 }),
            result({ driverCode: 'PER', driverId: 'sergio-perez', points: 0, positionLabel: 'DNF' }),
            result({ points: 18, raceName: 'Chinese Grand Prix', round: 2, sprint: { points: 8, positionLabel: '1' } }),
            result({ driverCode: 'PER', driverId: 'sergio-perez', points: 4, round: 2, sprint: { points: 3, positionLabel: '6' } }),
        ]);

        expect(rounds.map(r => [r.round, r.raceName, r.points, r.results.length])).toEqual([
            [1, 'Bahrain Grand Prix', 25, 2],
            [2, 'Chinese Grand Prix', 33, 2],
        ]);
    });

    it('returns no rounds for no results', () => {
        expect(groupRounds([])).toEqual([]);
    });
});
