import { notFound } from '@tanstack/react-router';

import { CURRENT_YEAR, TOTAL_ROUNDS } from '#/data/fixtures';

const FIRST_SEASON = 1950;

export function parseRound(raw: string): number {
    const round = Number(raw);
    if (!Number.isSafeInteger(round) || round < 1 || round > TOTAL_ROUNDS) {
        throw notFound();
    }
    return round;
}

/**
 * Bounds the year to F1's actual history rather than the current season: the
 * seasons list is API-backed and links to every historical year, so an equality
 * check against CURRENT_YEAR would 404 most of that table.
 */
export function parseYear(raw: string): number {
    const year = Number(raw);
    if (!Number.isSafeInteger(year) || year < FIRST_SEASON || year > CURRENT_YEAR) {
        throw notFound();
    }
    return year;
}
