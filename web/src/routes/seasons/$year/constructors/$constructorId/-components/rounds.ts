import { groupBy, sumBy } from 'es-toolkit';

import type { ConstructorSeasonResult } from '#/lib/api/constructors';

type Round = {
    points: number;
    raceName: string;
    results: ConstructorSeasonResult[];
    round: number;
};

export function groupRounds(results: ConstructorSeasonResult[]): Round[] {
    const resultsByRound = groupBy(results, result => result.round);

    return Object.values(resultsByRound).map(roundResults => ({
        points: sumBy(roundResults, result => result.points + (result.sprint?.points ?? 0)),
        raceName: roundResults[0].raceName,
        results: roundResults,
        round: roundResults[0].round,
    }));
}
