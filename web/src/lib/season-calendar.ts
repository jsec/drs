import type { SeasonCalendarEntry } from '#/lib/api/seasons';

export const calendarRaceState = (races: SeasonCalendarEntry[]) => ({
    lastCompletedRace: races.findLast(race => race.completed) ?? null,
    nextRace: races.find(race => !race.completed) ?? null,
});
