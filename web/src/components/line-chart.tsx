import type { LineChartProps } from '@mantine/charts';

import { LineChart as MantineLineChart } from '@mantine/charts';

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
