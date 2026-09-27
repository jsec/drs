import { describe, expect, it } from 'vitest';

import type { SeasonCalendarEntry } from '#/lib/api/seasons';

import { calendarRaceState } from './season-calendar';

const race = (round: number, isCompleted: boolean): SeasonCalendarEntry => ({
    circuit: { id: `circuit-${round}`, name: `Circuit ${round}` },
    code: `R${round}`,
    completed: isCompleted,
    date: `2026-0${round}-01`,
    name: `Race ${round}`,
    raceId: round,
    round,
    winner: null,
});

describe('calendarRaceState', () => {
    it('selects the last completed and first upcoming race', () => {
        const state = calendarRaceState([
            race(1, true),
            race(2, true),
            race(3, false),
            race(4, false),
        ]);

        expect(state.lastCompletedRace?.round).toBe(2);
        expect(state.nextRace?.round).toBe(3);
    });

    it('returns null for a completed season without an upcoming race', () => {
        const state = calendarRaceState([race(1, true)]);

        expect(state.nextRace).toBeNull();
    });
});
