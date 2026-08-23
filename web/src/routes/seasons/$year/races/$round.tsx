import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { DriverAvatar, GridHeader, SectionCard, TeamBar } from '#/components/f1-ui';
import { LineChart, toChartData, toChartSeries } from '#/components/line-chart';
import { raceDetailQuery } from '#/data/queries';
import { parseRound, parseYear } from '#/lib/route-params';

const MEDALS = ['#f59f00', '#adb5bd', '#e8590c'];
const RESULT_COLS = '36px 1fr 72px 90px 48px';

const HERO_STYLE: React.CSSProperties = {
    background: 'linear-gradient(110deg, var(--neutral-950), var(--neutral-800))',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
};

const RESULT_ROW_STYLE: React.CSSProperties = {
    alignItems: 'center',
    borderTop: '1px solid var(--mantine-color-default-border)',
    color: 'inherit',
    display: 'grid',
    gridTemplateColumns: RESULT_COLS,
    padding: '8px 18px',
    textDecoration: 'none',
};

const getDeltaColor = (delta: number): string => {
    if (delta > 0) return 'var(--green-500)';
    if (delta < 0) return 'var(--mantine-primary-color-filled)';
    return 'var(--neutral-300)';
};

const RaceDetail = () => {
    const { round, year } = Route.useParams();
    const { data } = useSuspenseQuery(raceDetailQuery(Number(year), Number(round)));

    const positionSeries = toChartSeries(data.positionLines);
    const positionData = toChartData(data.positionLines, i => `L${i * 5 + 1}`);
    const paceSeries = toChartSeries(data.paceLines);
    const paceData = toChartData(data.paceLines, i => `L${i + 1}`);

    const headStats = [
        { label: 'POLE', value: data.pole.short },
        { label: 'FASTEST LAP', value: data.fastestLap.short },
        { label: 'WINNER', value: data.winner.short },
    ];

    return (
        <Stack gap={16}>
            {/* Hero */}
            <Group gap={0} justify="space-between" px={26} py={22} style={HERO_STYLE} wrap="nowrap">
                <div>
                    <Box c="var(--color-sidebar-muted)" fw={700} fz={12} lts="1px">
                        {`ROUND ${data.round} · ${data.year}`}
                    </Box>
                    <Box className="f1-display" ff="var(--font-display)" fw={700} fz={28} lts="-0.02em" my={6}>
                        {data.name}
                    </Box>
                    <Box c="var(--neutral-300)" fz={13}>
                        {`${data.circuit} · ${data.date} · ${data.laps} laps`}
                    </Box>
                </div>
                <Group gap={26} wrap="nowrap">
                    {headStats.map(s => (
                        <Box key={s.label} ta="center">
                            <Box c="var(--color-sidebar-muted)" fw={600} fz={11}>{s.label}</Box>
                            <Box className="f1-display" ff="var(--font-display)" fw={700} fz={16} mt={3}>
                                {s.value}
                            </Box>
                        </Box>
                    ))}
                </Group>
            </Group>

            {/* Podium cards */}
            <SimpleGrid cols={3} spacing={16}>
                {data.results.slice(0, 3).map((r, i) => (
                    <Link
                        key={r.code}
                        params={{ driverId: r.code, year }}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        to="/seasons/$year/drivers/$driverId"
                    >
                        <Box
                            className="f1-card f1-lift"
                            p={16}
                            style={{ borderTop: `4px solid ${r.driver.color}`, cursor: 'pointer' }}
                        >
                            <Group gap={14} wrap="nowrap">
                                <Text c={MEDALS[i]} className="f1-display" ff="var(--font-display)" fw={700} fz={30} inherit span>{i + 1}</Text>
                                <DriverAvatar code={r.code} color={r.driver.color} size="lg" />
                                <div>
                                    <Box fw={700} fz={15}>{r.driver.name}</Box>
                                    <Box c="dimmed" fz={12}>{r.driver.teamName}</Box>
                                    <Box className="f1-num" fw={600} fz={12} mt={2}>
                                        {i === 0 ? '1:32:14.882' : r.gap}
                                    </Box>
                                </div>
                            </Group>
                        </Box>
                    </Link>
                ))}
            </SimpleGrid>

            {/* Charts */}
            <SimpleGrid cols={2} spacing={16}>
                <Box className="f1-card" p={16}>
                    <Box fw={700} fz={15}>Position Changes</Box>
                    <Box c="dimmed" fz={12} mb={8}>
                        Track position lap-by-lap · top 5
                    </Box>
                    <LineChart
                        data={positionData}
                        dataKey="x"
                        h={240}
                        series={positionSeries}
                        xAxisProps={{ interval: 3 }}
                        yAxisProps={{ domain: [1, 10], reversed: true, tickCount: 5 }}
                    />
                </Box>
                <Box className="f1-card" p={16}>
                    <Box fw={700} fz={15}>Race Pace</Box>
                    <Box c="dimmed" fz={12} mb={8}>
                        Lap time (s) · lower is faster
                    </Box>
                    <LineChart
                        data={paceData}
                        dataKey="x"
                        h={240}
                        series={paceSeries}
                        valueFormatter={v => v.toFixed(1)}
                        xAxisProps={{ interval: 5 }}
                        yAxisProps={{ domain: [77.5, 82], tickCount: 5 }}
                    />
                </Box>
            </SimpleGrid>

            {/* Results + Qual vs Race */}
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '7.2fr 4.8fr' }}>
                <SectionCard padded={false} title="Race Results">
                    <GridHeader columns={RESULT_COLS}>
                        <span>POS</span>
                        <span>DRIVER</span>
                        <span style={{ textAlign: 'center' }}>GRID</span>
                        <span style={{ textAlign: 'right' }}>GAP</span>
                        <span style={{ textAlign: 'right' }}>PTS</span>
                    </GridHeader>
                    <Box className="f1-scroll" mah={430} style={{ overflowY: 'auto' }}>
                        {data.results.map(r => (
                            <Link
                                className="f1-row"
                                key={r.code}
                                params={{ driverId: r.code, year }}
                                style={RESULT_ROW_STYLE}
                                to="/seasons/$year/drivers/$driverId"
                            >
                                <Text c="dimmed" className="f1-num" fw={700} inherit span>{r.pos}</Text>
                                <Group gap={9} wrap="nowrap">
                                    <TeamBar color={r.driver.color} size="sm" />
                                    <Text fw={600} fz={13} inherit span>{r.driver.short}</Text>
                                </Group>
                                <Text c="dimmed" className="f1-num" fz={12.5} inherit span ta="center">{r.grid}</Text>
                                <Text className="f1-num" fz={12.5} inherit span ta="right">{r.gap}</Text>
                                <Text c={r.pts > 0 ? 'inherit' : 'var(--neutral-300)'} className="f1-num" fw={700} inherit span ta="right">
                                    {r.pts > 0 ? r.pts : '–'}
                                </Text>
                            </Link>
                        ))}
                    </Box>
                </SectionCard>

                <Box className="f1-card" p={16}>
                    <Box fw={700} fz={15}>Qualifying vs Race</Box>
                    <Box c="dimmed" fz={12} mb={14}>
                        Positions gained or lost on Sunday
                    </Box>
                    {data.results.slice(0, 10).map((r) => {
                        const delta = r.grid - r.pos;
                        const mag = (Math.min(Math.abs(delta), 8) / 8) * 45;
                        const color = getDeltaColor(delta);
                        return (
                            <Group gap={10} key={r.code} mb={11} wrap="nowrap">
                                <Text fw={700} fz={12} inherit span w={40}>{r.code}</Text>
                                <Text c="dimmed" className="f1-num" fz={11} inherit span w={62}>
                                    P
                                    {r.grid}
                                    →P
                                    {r.pos}
                                </Text>
                                <Box flex={1} h={14} pos="relative">
                                    <Box
                                        bg="var(--mantine-color-default-border)"
                                        bottom={0}
                                        left="50%"
                                        pos="absolute"
                                        top={0}
                                        w={1}
                                    />
                                    <Box
                                        bg={color}
                                        h={8}
                                        left={delta >= 0 ? '50%' : `${50 - mag}%`}
                                        pos="absolute"
                                        style={{ borderRadius: 3 }}
                                        top={3}
                                        w={`${Math.max(mag, 1)}%`}
                                    />
                                </Box>
                                <Text c={color} className="f1-num" fw={700} fz={12} inherit span ta="right" w={34}>
                                    {delta > 0 ? `+${delta}` : delta}
                                </Text>
                            </Group>
                        );
                    })}
                </Box>
            </div>
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/races/$round')({
    component: RaceDetail,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        const race = await context.queryClient.ensureQueryData(
            raceDetailQuery(year, parseRound(params.round)),
        );
        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: 'Calendar', params: { year: params.year }, to: '/seasons/$year/calendar' },
                { label: race.name },
            ],
        };
    },
});
