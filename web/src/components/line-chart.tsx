import type { LineChartProps } from '@mantine/charts';

import { LineChart as MantineLineChart } from '@mantine/charts';

export type NamedSeries = {
    code: string;
    color: string;
    values: number[];
};

export const LineChart = (props: LineChartProps) => (
    <MantineLineChart
        curveType="linear"
        gridAxis="x"
        gridColor="var(--mantine-color-default-border)"
        strokeWidth={2.4}
        tickLine="none"
        withDots={false}
        {...props}
    />
);

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
