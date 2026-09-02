import { safeParse } from 'valibot';
import { describe, expect, it } from 'vitest';

import { CircuitListSchema, CircuitSummarySchema } from './circuits';
import { ConstructorListSchema } from './constructors';
import { SeasonListSchema } from './seasons';

describe('API response schemas', () => {
    it('accepts a season without a constructors champion', () => {
        const response = [{
            constructorCount: 10,
            raceCount: 22,
            season: 2026,
            wcc: null,
            wdc: { countryCode: 'NL', id: 'max-verstappen', name: 'Max Verstappen' },
        }];

        expect(safeParse(SeasonListSchema, response).success).toBe(true);
    });

    it('accepts nullable constructor race dates', () => {
        const response = [{
            championships: 16,
            color: '#E8002D',
            firstRaceDate: null,
            id: 'ferrari',
            lastRaceDate: null,
            name: 'Ferrari',
            podiums: 820,
            wins: 248,
        }];

        expect(safeParse(ConstructorListSchema, response).success).toBe(true);
    });

    it('accepts a circuit list response without optional race years', () => {
        const response = [{
            circuitId: 'monza',
            country: 'Italy',
            location: 'Monza',
            name: 'Autodromo Nazionale Monza',
            raceCount: 75,
        }];

        expect(safeParse(CircuitListSchema, response).success).toBe(true);
    });

    it('accepts nullable dates in a circuit summary', () => {
        const response = {
            circuitId: 'monza',
            circuitType: 'permanent',
            country: 'Italy',
            countryCode: 'IT',
            countryId: 'italy',
            firstRace: { date: null, name: 'Italian Grand Prix', raceId: null },
            lastRace: { date: '2026-09-06', name: 'Italian Grand Prix', raceId: 123 },
            layoutId: 'monza',
            name: 'Autodromo Nazionale Monza',
            previousNames: [],
            raceCount: 75,
            races: [{ date: null, layoutId: 'monza', name: 'Italian Grand Prix', raceId: 123, winnerId: '', winnerName: '' }],
            turns: 11,
        };

        expect(safeParse(CircuitSummarySchema, response).success).toBe(true);
    });
});
