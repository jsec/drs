export type NamedSeries = {
    code: string;
    color: string;
    values: number[];
};

export const toChartData = (series: NamedSeries[], label: (index: number) => string) =>
    (series[0]?.values ?? []).map((_, index) => {
        const row: Record<string, number | string> = { x: label(index) };
        for (const line of series) {
            row[line.code] = line.values[index];
        }
        return row;
    });

export const toChartSeries = (series: NamedSeries[]) =>
    series.map(line => ({ color: line.color, name: line.code }));
