import { describe, expect, it } from 'vitest';

import { SeasonOverviewSchema, SeasonStandingsSchema } from './seasons';

describe('SeasonStandingsSchema', () => {
    it('accepts nullable driver event state', () => {
        const response = {
            constructors: [{
                color: '#3671C6',
                id: 'red-bull',
                name: 'Red Bull Racing',
                points: 463.5,
                position: 1,
                positionLabel: '1',
            }],
            drivers: [{
                carNumber: null,
                code: 'VER',
                constructor: null,
                country: 'Netherlands',
                countryCode: 'NL',
                id: 'max-verstappen',
                name: 'Max Verstappen',
                podiums: 10,
                points: 251.5,
                poles: 6,
                position: null,
                positionLabel: 'DSQ',
                wins: 8,
            }],
            maxConstructorPoints: 463.5,
        };

        expect(SeasonStandingsSchema.safeParse(response).success).toBe(true);
    });
});

describe('SeasonOverviewSchema', () => {
    it('accepts round-keyed progression data and an absent runner-up', () => {
        const response = {
            constructors: [],
            drivers: [],
            leader: null,
            maxConstructorPoints: 0,
            progression: {
                data: [{ PER: 18, round: 1, VER: 25 }, { PER: 33, round: 2 }],
                series: [{ color: '#3671C6', name: 'VER' }, { color: '#3671C6', name: 'PER' }],
            },
            runnerUp: null,
        };

        expect(SeasonOverviewSchema.safeParse(response).success).toBe(true);
    });
});
