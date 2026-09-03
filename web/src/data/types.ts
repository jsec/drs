export type AllTimeConstructor = {
    active: boolean;
    color: string;
    name: string;
    podiums: number;
    poles: number;
    titles: number;
    wins: number;
    years: string;
};

export type AllTimeDriver = {
    active: boolean;
    code: string;
    color: string;
    countryCode?: string;
    id: string;
    name: string;
    nat: string;
    podiums: number;
    poles: number;
    starts: number;
    titles: number;
    wins: number;
    years: string;
};

export type CalendarRound = {
    circuit: string;
    code: string;
    date: string;
    name: string;
    round: number;
    winner: null | string;
};

export type CareerTotals = {
    debut: number;
    podiums: number;
    poles: number;
    races: number;
    titles: number;
    wins: number;
};

export type DriverRaceRow = {
    finish: 'DNF' | number;
    gp: string;
    grid: number;
    pts: number;
    round: number;
    status: string;
    statusColor: string;
};

export type DriverSeasonDetail = {
    driver: SeasonDriver;
    finishes: FinishBar[];
    pointsMax: number;
    pos: number;
    progression: number[];
    races: DriverRaceRow[];
};

export type FinishBar = {
    color: string;
    pos: number;
    round: string;
};

export type RaceDetail = {
    circuit: string;
    date: string;
    fastestLap: SeasonDriver;
    laps: number;
    name: string;
    paceLines: { code: string; color: string; values: number[] }[];
    pole: SeasonDriver;
    positionLines: { code: string; color: string; values: number[] }[];
    results: (RaceResult & { driver: SeasonDriver })[];
    round: number;
    winner: SeasonDriver;
    year: number;
};

export type RaceResult = {
    code: string;
    gap: string;
    grid: number;
    pos: number;
    pts: number;
};

export type SeasonConstructor = {
    color: string;
    flag: string;
    key: TeamKey;
    name: string;
    podiums: number;
    points: number;
    poles: number;
    pos: number;
    wins: number;
};

export type SeasonDriver = {
    car: CareerTotals;
    code: string;
    color: string;
    colorDark: string;
    country: string;
    flag: string;
    name: string;
    number: number;
    podiums: number;
    points: number;
    poles: number;
    short: string;
    team: TeamKey;
    teamName: string;
    wins: number;
};

export type SeasonOverview = {
    calendar: CalendarRound[];
    completed: number;
    constructors: SeasonConstructor[];
    drivers: SeasonDriver[];
    lastRaceName: string;
    leader: SeasonDriver;
    nextRace: CalendarRound;
    progression: { code: string; color: string; values: number[] }[];
    runnerUp: SeasonDriver;
    totalRounds: number;
    year: number;
};

export type Standings = {
    completed: number;
    constructors: SeasonConstructor[];
    drivers: SeasonDriver[];
    leaderPoints: number;
    maxConstructor: number;
};

export type Team = {
    color: string;
    dark: string;
    key: TeamKey;
    name: string;
};

export type TeamKey
    = | 'alp'
        | 'ast'
        | 'fer'
        | 'haa'
        | 'mcl'
        | 'mer'
        | 'rb'
        | 'rbr'
        | 'sau'
        | 'wil';
