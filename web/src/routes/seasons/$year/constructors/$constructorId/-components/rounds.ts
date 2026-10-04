import type { ConstructorSeasonResult } from '#/lib/api/constructors';

type Round = {
    points: number;
    raceName: string;
    results: ConstructorSeasonResult[];
    round: number;
};

export function groupRounds(results: ConstructorSeasonResult[]): Round[] {
    const rounds: Round[] = [];

    for (const result of results) {
        let current = rounds.at(-1);
        if (current?.round !== result.round) {
            current = { points: 0, raceName: result.raceName, results: [], round: result.round };
            rounds.push(current);
        }

        current.points += result.points + (result.sprint?.points ?? 0);
        current.results.push(result);
    }

    return rounds;
}
