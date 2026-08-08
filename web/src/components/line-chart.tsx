import type { ChartSeries } from '#/data/types';

type LineChartProps = {
    ariaLabel?: string;
    height?: number;
    invertY?: boolean;
    series: ChartSeries[];
    ticks?: number;
    viewHeight?: number;
    viewWidth?: number;
    xLabels?: (null | string)[];
    yFormat?: (v: number) => string;
    yMax: number;
    yMin: number;
};

const GRID = '#e9ecef';
const AXIS = '#868e96';

export const LineChart = ({
    ariaLabel = 'Line chart',
    height = 220,
    invertY = false,
    series,
    ticks = 5,
    viewHeight = 240,
    viewWidth = 600,
    xLabels,
    yFormat,
    yMax,
    yMin,
}: LineChartProps) => {
    const padLeft = 38;
    const padRight = 14;
    const padTop = 14;
    const padBottom = 26;
    const plotW = viewWidth - padLeft - padRight;
    const plotH = viewHeight - padTop - padBottom;

    const n = series[0]?.values.length ?? 0;
    const x = (i: number) => padLeft + (n <= 1 ? 0 : (i / (n - 1)) * plotW);
    const y = (v: number) => {
        let f = (v - yMin) / (yMax - yMin);
        if (invertY) f = 1 - f;
        return padTop + (1 - f) * plotH;
    };

    const gridLines = Array.from({ length: ticks }, (_, g) => {
        const value = yMin + ((yMax - yMin) * g) / (ticks - 1);
        const yy = y(value);
        return (
            <g key={`grid-${g}`}>
                <line stroke={GRID} strokeWidth={1} x1={padLeft} x2={viewWidth - padRight} y1={yy} y2={yy} />
                <text fill={AXIS} fontSize={10} textAnchor="end" x={padLeft - 6} y={yy + 3}>
                    {yFormat ? yFormat(value) : Math.round(value)}
                </text>
            </g>
        );
    });

    return (
        <svg
            aria-label={ariaLabel}
            role="img"
            style={{ display: 'block', height, width: '100%' }}
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        >
            {gridLines}
            {xLabels?.map((label, i) =>
                label == null
                    ? null
                    : (
                            // eslint-disable-next-line @eslint-react/no-array-index-key -- positional axis label, never reordered
                            <text fill={AXIS} fontSize={10} key={`x-${i}`} textAnchor="middle" x={x(i)} y={viewHeight - 7}>
                                {label}
                            </text>
                        ),
            )}
            {series.map((s, si) => {
                const points = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
                const last = s.values.length - 1;
                return (
                    // eslint-disable-next-line @eslint-react/no-array-index-key -- positional series, never reordered
                    <g key={`series-${si}`}>
                        <polyline
                            fill="none"
                            points={points}
                            stroke={s.color}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.4}
                        />
                        <circle cx={x(last)} cy={y(s.values[last])} fill={s.color} r={3.2} />
                    </g>
                );
            })}
        </svg>
    );
};

export const roundLabels = (count: number, every: number, prefix = 'R'): (null | string)[] => {
    return Array.from({ length: count }, (_, i) =>
        i % every === 0 ? `${prefix}${i}` : null,
    );
};
