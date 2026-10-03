export const countSeasons = (seasons: { season: number }[]) =>
    new Set(seasons.map(s => s.season)).size;

export const splitDrivers = <T>(drivers: T[], max = 3) => ({
    more: Math.max(drivers.length - max, 0),
    shown: drivers.slice(0, max),
});
