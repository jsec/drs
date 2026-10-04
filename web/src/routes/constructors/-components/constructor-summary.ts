export const countSeasons = (seasons: { season: number }[]) =>
    new Set(seasons.map(s => s.season)).size;
