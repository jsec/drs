import type {
    SeasonConstructor,
    SeasonDriver,
    Standings,
    Team,
    TeamKey,
} from './types';

export const TOTAL_ROUNDS = 24;
export const COMPLETED = 10;
export const CURRENT_YEAR = 2026;

export const TEAMS: Record<TeamKey, Team> = {
    alp: { color: '#0093CC', dark: '#006a94', key: 'alp', name: 'Alpine' },
    ast: { color: '#229971', dark: '#176b4f', key: 'ast', name: 'Aston Martin' },
    fer: { color: '#E8002D', dark: '#a8001f', key: 'fer', name: 'Ferrari' },
    haa: { color: '#8B8D90', dark: '#62646a', key: 'haa', name: 'Haas' },
    mcl: { color: '#FF8000', dark: '#cc6600', key: 'mcl', name: 'McLaren' },
    mer: { color: '#00B39B', dark: '#00806f', key: 'mer', name: 'Mercedes' },
    rb: { color: '#6692FF', dark: '#476bcc', key: 'rb', name: 'Racing Bulls' },
    rbr: { color: '#3671C6', dark: '#26528f', key: 'rbr', name: 'Red Bull' },
    sau: { color: '#00A859', dark: '#007a41', key: 'sau', name: 'Audi' },
    wil: { color: '#3B9BD8', dark: '#2a6f9c', key: 'wil', name: 'Williams' },
};

const GRID_2026: [
    code: string,
    name: string,
    short: string,
    team: TeamKey,
    carNumber: number,
    points: number,
    wins: number,
    podiums: number,
    poles: number,
    country: string,
][] = [
    ['NOR', 'Lando Norris', 'L. Norris', 'mcl', 4, 241, 4, 8, 3, 'United Kingdom'],
    ['PIA', 'Oscar Piastri', 'O. Piastri', 'mcl', 81, 224, 3, 7, 2, 'Australia'],
    ['VER', 'Max Verstappen', 'M. Verstappen', 'rbr', 1, 201, 2, 6, 3, 'Netherlands'],
    ['LEC', 'Charles Leclerc', 'C. Leclerc', 'fer', 16, 158, 1, 4, 1, 'Monaco'],
    ['RUS', 'George Russell', 'G. Russell', 'mer', 63, 146, 0, 3, 1, 'United Kingdom'],
    ['HAM', 'Lewis Hamilton', 'L. Hamilton', 'fer', 44, 121, 0, 2, 0, 'United Kingdom'],
    ['ANT', 'Kimi Antonelli', 'K. Antonelli', 'mer', 12, 89, 0, 1, 0, 'Italy'],
    ['ALB', 'Alex Albon', 'A. Albon', 'wil', 23, 54, 0, 0, 0, 'Thailand'],
    ['ALO', 'Fernando Alonso', 'F. Alonso', 'ast', 14, 42, 0, 0, 0, 'Spain'],
    ['GAS', 'Pierre Gasly', 'P. Gasly', 'alp', 10, 38, 0, 1, 0, 'France'],
    ['SAI', 'Carlos Sainz', 'C. Sainz', 'wil', 55, 34, 0, 0, 0, 'Spain'],
    ['HAD', 'Isack Hadjar', 'I. Hadjar', 'rb', 6, 31, 0, 0, 0, 'France'],
    ['TSU', 'Yuki Tsunoda', 'Y. Tsunoda', 'rb', 22, 22, 0, 0, 0, 'Japan'],
    ['HUL', 'Nico Hulkenberg', 'N. Hulkenberg', 'sau', 27, 19, 0, 1, 0, 'Germany'],
    ['BOR', 'Gabriel Bortoleto', 'G. Bortoleto', 'sau', 5, 12, 0, 0, 0, 'Brazil'],
    ['OCO', 'Esteban Ocon', 'E. Ocon', 'haa', 31, 10, 0, 0, 0, 'France'],
    ['BEA', 'Oliver Bearman', 'O. Bearman', 'haa', 87, 8, 0, 0, 0, 'United Kingdom'],
    ['STR', 'Lance Stroll', 'L. Stroll', 'ast', 18, 6, 0, 0, 0, 'Canada'],
    ['LAW', 'Liam Lawson', 'L. Lawson', 'rbr', 30, 4, 0, 0, 0, 'New Zealand'],
    ['COL', 'Franco Colapinto', 'F. Colapinto', 'alp', 43, 2, 0, 0, 0, 'Argentina'],
];

const CAREER_TOTALS: Record<
    string,
    [races: number, wins: number, poles: number, podiums: number, titles: number, debut: number]
> = {
    ALB: [111, 0, 0, 2, 0, 2019],
    ALO: [416, 32, 22, 106, 2, 2001],
    ANT: [28, 0, 0, 2, 0, 2025],
    BEA: [33, 0, 0, 0, 0, 2024],
    BOR: [28, 0, 0, 0, 0, 2025],
    COL: [31, 0, 0, 0, 0, 2024],
    GAS: [166, 1, 0, 5, 0, 2017],
    HAD: [28, 0, 0, 0, 0, 2025],
    HAM: [372, 105, 104, 202, 7, 2007],
    HUL: [230, 0, 1, 1, 0, 2010],
    LAW: [39, 0, 0, 0, 0, 2023],
    LEC: [166, 8, 26, 48, 0, 2018],
    NOR: [150, 9, 12, 40, 0, 2019],
    OCO: [166, 1, 0, 4, 0, 2016],
    PIA: [71, 5, 4, 22, 0, 2023],
    RUS: [145, 3, 5, 20, 0, 2019],
    SAI: [221, 4, 6, 27, 0, 2015],
    STR: [185, 0, 1, 3, 0, 2017],
    TSU: [105, 0, 0, 0, 0, 2021],
    VER: [221, 65, 44, 116, 4, 2015],
};

const COUNTRY_FLAG: Record<string, string> = {
    'Argentina': '🇦🇷',
    'Australia': '🇦🇺',
    'Brazil': '🇧🇷',
    'Canada': '🇨🇦',
    'France': '🇫🇷',
    'Germany': '🇩🇪',
    'Italy': '🇮🇹',
    'Japan': '🇯🇵',
    'Monaco': '🇲🇨',
    'Netherlands': '🇳🇱',
    'New Zealand': '🇳🇿',
    'Spain': '🇪🇸',
    'Thailand': '🇹🇭',
    'United Kingdom': '🇬🇧',
};

const TEAM_FLAG: Record<TeamKey, string> = {
    alp: '🇫🇷',
    ast: '🇬🇧',
    fer: '🇮🇹',
    haa: '🇺🇸',
    mcl: '🇬🇧',
    mer: '🇩🇪',
    rb: '🇮🇹',
    rbr: '🇦🇹',
    sau: '🇩🇪',
    wil: '🇬🇧',
};

export const SEASON_DRIVERS: SeasonDriver[] = GRID_2026.map((row) => {
    const [code, name, short, teamKey, carNumber, points, wins, podiums, poles, country] = row;
    const team = TEAMS[teamKey];
    const [careerRaces, careerWins, careerPoles, careerPodiums, careerTitles, debut]
        = CAREER_TOTALS[code] ?? [0, 0, 0, 0, 0, CURRENT_YEAR];

    const driver: SeasonDriver = {
        car: {
            debut,
            podiums: careerPodiums,
            poles: careerPoles,
            races: careerRaces,
            titles: careerTitles,
            wins: careerWins,
        },
        code,
        color: team.color,
        colorDark: team.dark,
        country,
        flag: COUNTRY_FLAG[country] ?? '🏁',
        name,
        number: carNumber,
        podiums,
        points,
        poles,
        short,
        team: teamKey,
        teamName: team.name,
        wins,
    };
    return driver;
});

const CONSTRUCTOR_STATS: Record<TeamKey, [number, number, number]> = {
    alp: [0, 1, 0],
    ast: [0, 0, 0],
    fer: [1, 6, 1],
    haa: [0, 0, 0],
    mcl: [7, 15, 5],
    mer: [0, 4, 1],
    rb: [0, 0, 0],
    rbr: [2, 6, 3],
    sau: [0, 1, 0],
    wil: [0, 0, 0],
};

export const SEASON_CONSTRUCTORS: SeasonConstructor[] = (() => {
    const points: Record<string, number> = {};
    for (const d of SEASON_DRIVERS) {
        points[d.team] = (points[d.team] ?? 0) + d.points;
    }
    return (Object.keys(TEAMS) as TeamKey[])
        .map(k => ({
            color: TEAMS[k].color,
            flag: TEAM_FLAG[k],
            key: k,
            name: TEAMS[k].name,
            podiums: CONSTRUCTOR_STATS[k][1],
            points: points[k] ?? 0,
            poles: CONSTRUCTOR_STATS[k][2],
            pos: 0,
            wins: CONSTRUCTOR_STATS[k][0],
        }))
        .toSorted((a, b) => b.points - a.points)
        .map((c, i) => ({ ...c, pos: i + 1 }));
})();

export function getStandings(): Standings {
    return {
        completed: COMPLETED,
        constructors: SEASON_CONSTRUCTORS,
        drivers: SEASON_DRIVERS,
        leaderPoints: SEASON_DRIVERS[0].points,
        maxConstructor: SEASON_CONSTRUCTORS[0]?.points || 1,
    };
}
