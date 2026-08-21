import type { MantineColorsTuple } from '@mantine/core';

import { LineChart } from '@mantine/charts';
import { Card, createTheme, Table } from '@mantine/core';

// F1 red
const f1: MantineColorsTuple = [
    '#fff1f0',
    '#ffdedc',
    '#ffc2be',
    '#ff958d',
    '#fb5b50',
    '#e10600',
    '#c10500',
    '#a00400',
    '#840a06',
    '#6e0f0c',
];

const gray: MantineColorsTuple = [
    '#ffffff',
    '#fafafa',
    '#f4f4f5',
    '#e4e4e7',
    '#d4d4d8',
    '#a1a1aa',
    '#71717a',
    '#52525b',
    '#3f3f46',
    '#27272a',
];

const dark: MantineColorsTuple = [
    '#fafafa',
    '#d4d4d8',
    '#a1a1aa',
    '#71717a',
    '#3f3f46',
    '#2a2a36',
    '#1d1d27',
    '#15151e',
    '#0b0b10',
    '#060609',
];

export const theme = createTheme({
    black: '#15151e',
    colors: { dark, f1, gray },
    components: {
        Card: Card.extend({
            defaultProps: {
                bg: 'var(--mantine-color-default)',
                padding: 0,
                radius: 'xl',
                shadow: 'sm',
                withBorder: true,
            },
        }),
        LineChart: LineChart.extend({
            defaultProps: {
                curveType: 'linear',
                gridAxis: 'y',
                gridColor: 'var(--mantine-color-default-border)',
                strokeWidth: 2.4,
                tickLine: 'none',
                withDots: false,
            },
        }),
        Table: Table.extend({
            defaultProps: {
                layout: 'fixed',
                withRowBorders: false,
            },
        }),
    },
    defaultRadius: 'md',
    fontFamily: '"Titillium Web", system-ui, -apple-system, sans-serif',
    fontFamilyMonospace: '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
    fontSizes: {
        lg: '18px',
        md: '15px',
        sm: '14px',
        xl: '20px',
        xs: '12px',
    },
    headings: {
        fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
    },
    primaryColor: 'f1',
    primaryShade: 5,
    radius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
        xl: '14px',
        xs: '2px',
    },
    shadows: {
        lg: '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',
        md: '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
        sm: '0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)',
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
    },
    spacing: {
        lg: '20px',
        md: '16px',
        sm: '12px',
        xl: '24px',
        xs: '8px',
    },
    white: '#ffffff',
});
