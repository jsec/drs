import type {
    AllTimeConstructor,
    AllTimeDriver,
    CalendarRound,
    DriverRaceRow,
    DriverSeasonDetail,
    FinishBar,
    RaceDetail,
    SeasonConstructor,
    SeasonDriver,
    SeasonOverview,
    Standings,
    Team,
    TeamKey,
} from './types';

export const TOTAL_ROUNDS = 24;
export const COMPLETED = 10;
export const CURRENT_YEAR = 2026;
export const GRAY_FALLBACK = 'var(--neutral-500)';

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

const driverByCode: Record<string, SeasonDriver> = {};

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
    driverByCode[driver.code] = driver;
    return driver;
});

export function getSeasonDriver(code: string): SeasonDriver | undefined {
    return driverByCode[code];
}

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

export const PROGRESSION: Record<string, number[]> = {
    HAM: [0, 8, 16, 26, 36, 48, 62, 78, 93, 107, 121],
    LEC: [0, 12, 24, 39, 51, 66, 84, 100, 118, 138, 158],
    NOR: [0, 25, 43, 61, 86, 104, 129, 154, 179, 216, 241],
    PIA: [0, 18, 43, 61, 79, 104, 122, 140, 165, 190, 224],
    RUS: [0, 10, 20, 33, 45, 60, 75, 90, 108, 127, 146],
    VER: [0, 15, 40, 55, 73, 88, 106, 131, 149, 175, 201],
};
const PROGRESSION_ORDER = ['NOR', 'PIA', 'VER', 'LEC', 'RUS', 'HAM'];

const CALENDAR_RAW: [
    round: number,
    name: string,
    circuit: string,
    code: string,
    date: string,
    winner: null | string,
][] = [
    [1, 'Australian GP', 'Albert Park', 'MEL', 'Mar 8', 'NOR'],
    [2, 'Chinese GP', 'Shanghai Intl', 'SHA', 'Mar 22', 'VER'],
    [3, 'Japanese GP', 'Suzuka', 'SUZ', 'Apr 5', 'PIA'],
    [4, 'Bahrain GP', 'Sakhir', 'BHR', 'Apr 12', 'NOR'],
    [5, 'Saudi Arabian GP', 'Jeddah Corniche', 'JED', 'Apr 26', 'LEC'],
    [6, 'Miami GP', 'Miami Intl', 'MIA', 'May 10', 'PIA'],
    [7, 'Emilia-Romagna GP', 'Imola', 'IMO', 'May 24', 'VER'],
    [8, 'Monaco GP', 'Circuit de Monaco', 'MON', 'Jun 7', 'NOR'],
    [9, 'Spanish GP', 'Barcelona-Catalunya', 'BCN', 'Jun 14', 'PIA'],
    [10, 'Canadian GP', 'Gilles Villeneuve', 'MTL', 'Jun 21', 'NOR'],
    [11, 'Austrian GP', 'Red Bull Ring', 'RBR', 'Jun 28', null],
    [12, 'British GP', 'Silverstone', 'SIL', 'Jul 5', null],
    [13, 'Hungarian GP', 'Hungaroring', 'HUN', 'Jul 19', null],
    [14, 'Belgian GP', 'Spa-Francorchamps', 'SPA', 'Jul 26', null],
    [15, 'Dutch GP', 'Zandvoort', 'ZAN', 'Aug 23', null],
    [16, 'Italian GP', 'Monza', 'MNZ', 'Sep 6', null],
    [17, 'Azerbaijan GP', 'Baku City', 'BAK', 'Sep 20', null],
    [18, 'Singapore GP', 'Marina Bay', 'SIN', 'Oct 4', null],
    [19, 'United States GP', 'COTA', 'COTA', 'Oct 18', null],
    [20, 'Mexico City GP', 'Hermanos Rodriguez', 'MEX', 'Oct 25', null],
    [21, 'Sao Paulo GP', 'Interlagos', 'INT', 'Nov 8', null],
    [22, 'Las Vegas GP', 'Las Vegas Strip', 'LAS', 'Nov 21', null],
    [23, 'Qatar GP', 'Lusail', 'LOS', 'Nov 29', null],
    [24, 'Abu Dhabi GP', 'Yas Marina', 'YAS', 'Dec 6', null],
];

export const CALENDAR: CalendarRound[] = CALENDAR_RAW.map(
    ([round, name, circuit, code, date, winner]) => ({
        circuit,
        code,
        date,
        name,
        round,
        winner,
    }),
);

const RACE_ORDER = [
    'NOR', 'PIA', 'VER', 'LEC', 'RUS', 'HAM', 'ANT', 'ALB', 'ALO', 'GAS',
    'SAI', 'HAD', 'TSU', 'HUL', 'BOR', 'OCO', 'BEA', 'STR', 'LAW', 'COL',
];
const RACE_GRIDS = [1, 3, 2, 4, 6, 5, 8, 7, 11, 9, 10, 12, 14, 13, 16, 15, 18, 17, 19, 20];
const RACE_GAPS = [
    'WINNER', '+4.821', '+12.044', '+24.115', '+38.902', '+45.330', '+61.882',
    '+72.450', '+1 LAP', '+1 LAP', '+1 LAP', '+1 LAP', '+1 LAP', '+1 LAP',
    '+1 LAP', '+1 LAP', '+1 LAP', '+1 LAP', '+2 LAPS', 'DNF',
];
const RACE_PTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const POSITION_LINES: Record<string, number[]> = {
    LEC: [4, 4, 4, 4, 5, 5, 4, 4, 3, 4, 4, 4, 4, 4, 4],
    NOR: [1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    PIA: [3, 3, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    RUS: [6, 5, 5, 5, 4, 4, 5, 5, 5, 5, 5, 5, 6, 5, 5],
    VER: [2, 2, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3],
};

const PACE_LINES: Record<string, number[]> = (() => {
    const base: Record<string, number> = { LEC: 79, NOR: 78.2, PIA: 78.4, VER: 78.6 };
    const out: Record<string, number[]> = {};
    for (const [ki, k] of Object.keys(base).entries()) {
        const arr: number[] = [];
        for (let l = 0; l < 24; l++) {
            const t
                = base[k]
                    + Math.sin(l * 0.6 + ki) * 0.22
                    + (l < 2 ? 0.6 : 0)
                    + (l > 21 ? 0.35 : 0);
            arr.push(+t.toFixed(2));
        }
        out[k] = arr;
    }
    return out;
})();

const ALL_TIME_RAW: [
    name: string,
    nat: string,
    years: string,
    starts: number,
    wins: number,
    poles: number,
    podiums: number,
    titles: number,
][] = [
    ['Lewis Hamilton', 'GBR', '2007–', 356, 105, 104, 202, 7],
    ['Michael Schumacher', 'GER', '1991–2012', 308, 91, 68, 155, 7],
    ['Juan Manuel Fangio', 'ARG', '1950–1958', 51, 24, 29, 35, 5],
    ['Sebastian Vettel', 'GER', '2007–2022', 300, 53, 57, 122, 4],
    ['Alain Prost', 'FRA', '1980–1993', 199, 51, 33, 106, 4],
    ['Max Verstappen', 'NED', '2015–', 221, 65, 44, 116, 4],
    ['Niki Lauda', 'AUT', '1971–1985', 171, 25, 24, 54, 3],
    ['Nelson Piquet', 'BRA', '1978–1991', 204, 23, 24, 60, 3],
    ['Ayrton Senna', 'BRA', '1984–1994', 161, 41, 65, 80, 3],
    ['Jackie Stewart', 'GBR', '1965–1973', 99, 27, 17, 43, 3],
    ['Jack Brabham', 'AUS', '1955–1970', 126, 14, 13, 31, 3],
    ['Alberto Ascari', 'ITA', '1950–1955', 32, 13, 14, 17, 2],
    ['Jim Clark', 'GBR', '1960–1968', 72, 25, 33, 32, 2],
    ['Graham Hill', 'GBR', '1958–1975', 176, 14, 13, 36, 2],
    ['Emerson Fittipaldi', 'BRA', '1970–1980', 144, 14, 6, 35, 2],
    ['Mika Häkkinen', 'FIN', '1991–2001', 161, 20, 26, 51, 2],
    ['Fernando Alonso', 'ESP', '2001–', 416, 32, 22, 106, 2],
    ['Giuseppe Farina', 'ITA', '1950–1955', 33, 5, 5, 20, 1],
    ['Mike Hawthorn', 'GBR', '1952–1958', 45, 3, 4, 18, 1],
    ['Phil Hill', 'USA', '1958–1966', 48, 3, 6, 16, 1],
    ['John Surtees', 'GBR', '1960–1972', 111, 6, 8, 24, 1],
    ['Denny Hulme', 'NZL', '1965–1974', 112, 8, 1, 33, 1],
    ['Jochen Rindt', 'AUT', '1965–1970', 60, 6, 10, 13, 1],
    ['Mario Andretti', 'USA', '1968–1982', 128, 12, 18, 19, 1],
    ['Jody Scheckter', 'RSA', '1972–1980', 112, 10, 3, 33, 1],
    ['Alan Jones', 'AUS', '1975–1986', 116, 12, 6, 24, 1],
    ['Keke Rosberg', 'FIN', '1978–1986', 114, 5, 5, 17, 1],
    ['Nigel Mansell', 'GBR', '1980–1995', 187, 31, 32, 59, 1],
    ['Damon Hill', 'GBR', '1992–1999', 115, 22, 20, 42, 1],
    ['Jacques Villeneuve', 'CAN', '1996–2006', 163, 11, 13, 23, 1],
    ['Kimi Räikkönen', 'FIN', '2001–2021', 349, 21, 18, 103, 1],
    ['Jenson Button', 'GBR', '2000–2017', 306, 15, 8, 50, 1],
    ['Nico Rosberg', 'GER', '2006–2016', 206, 23, 30, 57, 1],
    ['Stirling Moss', 'GBR', '1951–1961', 66, 16, 16, 24, 0],
    ['Gilles Villeneuve', 'CAN', '1977–1982', 67, 6, 2, 13, 0],
    ['Carlos Reutemann', 'ARG', '1972–1982', 146, 12, 6, 45, 0],
    ['Ronnie Peterson', 'SWE', '1970–1978', 123, 10, 14, 26, 0],
    ['Rubens Barrichello', 'BRA', '1993–2011', 322, 11, 14, 68, 0],
    ['David Coulthard', 'GBR', '1994–2008', 246, 13, 12, 62, 0],
    ['Felipe Massa', 'BRA', '2002–2017', 269, 11, 16, 41, 0],
    ['Mark Webber', 'AUS', '2002–2013', 215, 9, 13, 42, 0],
    ['Valtteri Bottas', 'FIN', '2013–', 243, 10, 20, 67, 0],
    ['Sergio Pérez', 'MEX', '2011–2024', 281, 6, 3, 39, 0],
    ['Daniel Ricciardo', 'AUS', '2011–2024', 257, 8, 3, 32, 0],
    ['Juan Pablo Montoya', 'COL', '2001–2006', 94, 7, 13, 30, 0],
    ['Ralf Schumacher', 'GER', '1997–2007', 180, 6, 6, 27, 0],
    ['Gerhard Berger', 'AUT', '1984–1997', 210, 10, 12, 48, 0],
    ['Riccardo Patrese', 'ITA', '1977–1993', 256, 6, 8, 37, 0],
    ['Jean Alesi', 'FRA', '1989–2001', 201, 1, 2, 32, 0],
    ['Heinz-Harald Frentzen', 'GER', '1994–2003', 156, 3, 2, 18, 0],
    ['Eddie Irvine', 'GBR', '1993–2002', 146, 4, 0, 26, 0],
    ['Clay Regazzoni', 'SUI', '1970–1980', 132, 5, 5, 28, 0],
    ['Jacky Ickx', 'BEL', '1966–1979', 116, 8, 13, 25, 0],
    ['Bruce McLaren', 'NZL', '1958–1970', 100, 4, 0, 27, 0],
    ['Dan Gurney', 'USA', '1959–1970', 86, 4, 3, 19, 0],
    ['Tony Brooks', 'GBR', '1956–1961', 38, 6, 3, 10, 0],
    ['Carlos Pace', 'BRA', '1972–1977', 72, 1, 1, 6, 0],
    ['Patrick Depailler', 'FRA', '1972–1980', 95, 2, 1, 19, 0],
    ['Michele Alboreto', 'ITA', '1981–1994', 194, 5, 2, 23, 0],
    ['Elio de Angelis', 'ITA', '1979–1986', 108, 2, 3, 9, 0],
    ['Thierry Boutsen', 'BEL', '1983–1993', 163, 3, 1, 15, 0],
    ['René Arnoux', 'FRA', '1978–1989', 149, 7, 18, 22, 0],
    ['Jacques Laffite', 'FRA', '1974–1986', 176, 6, 7, 32, 0],
    ['Didier Pironi', 'FRA', '1978–1982', 70, 3, 4, 13, 0],
    ['John Watson', 'GBR', '1973–1985', 152, 5, 2, 20, 0],
    ['Romain Grosjean', 'FRA', '2009–2020', 179, 0, 0, 10, 0],
    ['Nico Hülkenberg', 'GER', '2010–', 230, 0, 1, 1, 0],
    ['Charles Leclerc', 'MON', '2018–', 166, 8, 26, 48, 0],
    ['Lando Norris', 'GBR', '2019–', 150, 9, 12, 40, 0],
    ['Oscar Piastri', 'AUS', '2023–', 71, 5, 4, 22, 0],
    ['George Russell', 'GBR', '2019–', 145, 4, 5, 21, 0],
    ['Carlos Sainz', 'ESP', '2015–', 221, 4, 6, 27, 0],
    ['Pierre Gasly', 'FRA', '2017–', 166, 1, 0, 5, 0],
    ['Esteban Ocon', 'FRA', '2016–', 166, 1, 0, 4, 0],
    ['Alex Albon', 'THA', '2019–', 111, 0, 0, 2, 0],
    ['Lance Stroll', 'CAN', '2017–', 185, 0, 1, 3, 0],
    ['Yuki Tsunoda', 'JPN', '2021–', 105, 0, 0, 0, 0],
    ['Kimi Antonelli', 'ITA', '2025–', 28, 0, 0, 2, 0],
    ['Isack Hadjar', 'FRA', '2025–', 28, 0, 0, 0, 0],
    ['Gabriel Bortoleto', 'BRA', '2025–', 28, 0, 0, 0, 0],
    ['Oliver Bearman', 'GBR', '2024–', 33, 0, 0, 0, 0],
    ['Liam Lawson', 'NZL', '2023–', 39, 0, 0, 0, 0],
    ['Franco Colapinto', 'ARG', '2024–', 31, 0, 0, 0, 0],
];

function initials(name: string): string {
    const ascii = name.replaceAll(/[äöüéíáàë]/gi, (c) => {
        const map: Record<string, string> = {
            á: 'a', à: 'a', ä: 'a', é: 'e', ë: 'e', í: 'i', ö: 'o', ü: 'u',
        };
        return map[c.toLowerCase()] ?? c;
    });
    const last = ascii.split(' ').pop() ?? ascii;
    return last.slice(0, 3).toUpperCase();
}

/** Driver names are unique in ALL_TIME_RAW, so the slug is a stable id. */
function slugify(name: string): string {
    return name
        .normalize('NFD')
        .replaceAll(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/^-|-$/g, '');
}

const activeByName: Partial<Record<string, { code: string; color: string }>> = {};
for (const d of SEASON_DRIVERS) {
    activeByName[d.name] = { code: d.code, color: d.color };
}

const nationalityToCountryCode: Record<string, string> = {
    ARG: 'AR',
    AUS: 'AU',
    AUT: 'AT',
    BEL: 'BE',
    BRA: 'BR',
    CAN: 'CA',
    COL: 'CO',
    ESP: 'ES',
    FIN: 'FI',
    FRA: 'FR',
    GBR: 'GB',
    GER: 'DE',
    ITA: 'IT',
    JPN: 'JP',
    MEX: 'MX',
    MON: 'MC',
    NED: 'NL',
    NZL: 'NZ',
    RSA: 'ZA',
    SUI: 'CH',
    SWE: 'SE',
    THA: 'TH',
    USA: 'US',
};

export const ALL_TIME_DRIVERS: AllTimeDriver[] = ALL_TIME_RAW.map((row) => {
    const [name, nat, years, starts, wins, poles, podiums, titles] = row;
    const active = activeByName[name];

    return {
        active: !!active,
        code: active ? active.code : initials(name),
        color: active ? active.color : (titles > 0 ? '#c79100' : GRAY_FALLBACK),
        countryCode: nationalityToCountryCode[nat],
        id: slugify(name),
        name,
        nat,
        podiums,
        poles,
        starts,
        titles,
        wins,
        years,
    };
});

const driverBySlug: Partial<Record<string, AllTimeDriver>> = {};
for (const driver of ALL_TIME_DRIVERS) {
    driverBySlug[driver.id] = driver;
}

const ALL_TIME_CONSTRUCTORS_RAW: [
    name: string,
    color: string,
    years: string,
    titles: number,
    wins: number,
    poles: number,
    podiums: number,
    active: boolean,
][] = [
    ['Ferrari', '#E8002D', '1950–', 16, 248, 253, 812, true],
    ['McLaren', '#FF8000', '1966–', 8, 200, 165, 524, true],
    ['Williams', '#3B9BD8', '1977–', 9, 114, 128, 313, true],
    ['Mercedes', '#00B39B', '1954–', 8, 125, 140, 293, true],
    ['Red Bull', '#3671C6', '2005–', 6, 122, 103, 290, true],
    ['Team Lotus', '#177E3E', '1958–1994', 7, 79, 107, 172, false],
    ['Renault / Alpine', '#0093CC', '1977–', 2, 36, 51, 110, true],
    ['Brabham', '#5C5F66', '1962–1992', 2, 35, 39, 124, false],
    ['Benetton', '#00A859', '1986–2001', 1, 27, 15, 102, false],
    ['Tyrrell', '#5C5F66', '1970–1998', 1, 23, 14, 77, false],
    ['Cooper', '#5C5F66', '1950–1969', 2, 16, 11, 45, false],
    ['BRM', '#5C5F66', '1951–1977', 1, 17, 11, 62, false],
    ['Matra', '#5C5F66', '1967–1972', 1, 9, 4, 22, false],
    ['Vanwall', '#5C5F66', '1954–1960', 1, 9, 7, 18, false],
    ['Brawn GP', '#9FD300', '2009', 1, 8, 5, 15, false],
    ['Aston Martin', '#229971', '2021–', 0, 0, 1, 9, true],
    ['Racing Bulls', '#6692FF', '2006–', 0, 2, 1, 5, true],
    ['Sauber / Audi', '#52E252', '1993–', 0, 1, 1, 27, true],
    ['Haas', '#8B8D90', '2016–', 0, 0, 1, 2, true],
    ['Jordan', '#5C5F66', '1991–2005', 0, 4, 2, 19, false],
];

export const ALL_TIME_CONSTRUCTORS: AllTimeConstructor[] = ALL_TIME_CONSTRUCTORS_RAW.map(
    ([name, color, years, titles, wins, poles, podiums, active]) => ({
        active,
        color,
        name,
        podiums,
        poles,
        titles,
        wins,
        years,
    }),
);

/** Cheap existence check for route guards; does not build the career series. */
export function getAllTimeDriver(id: string): AllTimeDriver | undefined {
    return driverBySlug[id];
}

export function getAllTimeDrivers(): AllTimeDriver[] {
    return ALL_TIME_DRIVERS;
}

export function getCalendar(): { calendar: CalendarRound[]; completed: number } {
    return { calendar: CALENDAR, completed: COMPLETED };
}

export function getDriverSeason(code: string): DriverSeasonDetail | undefined {
    const driver = driverByCode[code];
    if (!driver) return undefined;
    const pos = SEASON_DRIVERS.findIndex(d => d.code === code) + 1;

    let progression = PROGRESSION[code];
    if (!progression) {
        progression = [0];
        for (let i = 1; i <= COMPLETED; i++) {
            progression.push(Math.round((driver.points * i) / COMPLETED));
        }
    }
    const pointsMax = Math.max(50, Math.ceil(driver.points / 50) * 50);

    const baseP = Math.min(pos, 15);
    const ptsTable = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

    const finishes: FinishBar[] = [];
    for (let i = 0; i < COMPLETED; i++) {
        const p = Math.max(1, Math.round(baseP + Math.sin(i * 1.3) * 2));
        finishes.push({
            color: p <= 3 ? '#f59f00' : (p <= 10 ? driver.color : 'var(--neutral-300)'),
            pos: p,
            round: 'R' + (i + 1),
        });
    }

    const races: DriverRaceRow[] = CALENDAR.slice(0, COMPLETED).map((rc, i) => {
        const fin = Math.max(1, Math.round(baseP + Math.sin(i * 1.3) * 2));
        const isDnf = code === 'COL' && i === 4;
        const pp = fin <= 10 && !isDnf ? ptsTable[fin - 1] : 0;
        return {
            finish: isDnf ? 'DNF' : fin,
            gp: rc.name,
            grid: Math.max(1, fin + ((i % 3) - 1)),
            pts: pp,
            round: rc.round,
            status: raceStatus(isDnf, fin),
            statusColor: raceStatusColor(isDnf, fin),
        };
    });

    return { driver, finishes, pointsMax, pos, progression, races };
}

export function getRaceDetail(round: number): RaceDetail | undefined {
    const cal = CALENDAR[round - 1];
    if (!cal) return undefined;
    return {
        circuit: cal.circuit,
        date: cal.date,
        fastestLap: driverByCode.VER,
        laps: 70,
        name: cal.name,
        paceLines: Object.entries(PACE_LINES).map(([code, value]) => ({
            code,
            color: driverByCode[code].color,
            values: value,
        })),
        pole: driverByCode.NOR,
        positionLines: Object.entries(POSITION_LINES).map(([code, value]) => ({
            code,
            color: driverByCode[code].color,
            values: value,
        })),
        results: RACE_ORDER.map((code, i) => ({
            code,
            driver: driverByCode[code],
            gap: RACE_GAPS[i],
            grid: RACE_GRIDS[i],
            pos: i + 1,
            pts: RACE_PTS[i],
        })),
        round: cal.round,
        winner: driverByCode.NOR,
        year: CURRENT_YEAR,
    };
}

export function getSeasonOverview(): SeasonOverview {
    return {
        calendar: CALENDAR,
        completed: COMPLETED,
        constructors: SEASON_CONSTRUCTORS,
        drivers: SEASON_DRIVERS,
        lastRaceName: CALENDAR[COMPLETED - 1].name,
        leader: SEASON_DRIVERS[0],
        nextRace: CALENDAR[COMPLETED],
        progression: PROGRESSION_ORDER.map(code => ({
            code,
            color: driverByCode[code].color,
            values: PROGRESSION[code],
        })),
        runnerUp: SEASON_DRIVERS[1],
        totalRounds: TOTAL_ROUNDS,
        year: CURRENT_YEAR,
    };
}

export function getStandings(): Standings {
    return {
        completed: COMPLETED,
        constructors: SEASON_CONSTRUCTORS,
        drivers: SEASON_DRIVERS,
        leaderPoints: SEASON_DRIVERS[0].points,
        maxConstructor: SEASON_CONSTRUCTORS[0]?.points || 1,
    };
}

function raceStatus(isDnf: boolean, fin: number): string {
    if (isDnf) return 'DNF';
    if (fin <= 3) return 'PODIUM';
    if (fin <= 10) return 'POINTS';
    return '—';
}

function raceStatusColor(isDnf: boolean, fin: number): string {
    if (isDnf) return 'var(--mantine-primary-color-filled)';
    if (fin <= 3) return 'var(--gold-500)';
    if (fin <= 10) return 'var(--green-500)';
    return 'var(--neutral-400)';
}
