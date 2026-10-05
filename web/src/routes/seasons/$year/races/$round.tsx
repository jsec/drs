import { LineChart } from '@mantine/charts';
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense } from 'react';

import type { DriverRef, RaceResult, Session } from '#/lib/api/races';

import { DriverAvatar, GridHeader, SectionCard, TeamBar } from '#/components/f1-ui';
import { raceDetailQuery, raceLapsQuery } from '#/data/queries';
import { paceChart, positionChart } from '#/lib/race-charts';
import { parseRound, parseYear } from '#/lib/route-params';

const CHART_DRIVER_COUNT = 5;
const POSITION_LAP_STEP = 5;
const MEDALS = ['#f59f00', '#adb5bd', '#e8590c'];
const RESULT_COLS = '36px 1fr 72px 90px 48px';
const QUALIFYING_SESSION_COLS = '36px 1fr 90px 90px 90px 80px';
const QUALIFYING_TIME_COLS = '36px 1fr 90px 80px';

const HERO_STYLE: React.CSSProperties = {
    background: 'linear-gradient(110deg, var(--neutral-950), var(--neutral-800))',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
};

const getDeltaColor = (delta: number): string => {
    if (delta > 0) {
        return 'var(--green-500)';
    }

    if (delta < 0) {
        return 'var(--mantine-primary-color-filled)';
    }

    return 'var(--neutral-300)';
};

const resultGap = (result: RaceResult) => result.gap ?? result.time ?? result.positionLabel;

const shortNameFor = (results: RaceResult[], ref: DriverRef | null) => {
    if (!ref) {
        return '—';
    }
    return results.find(result => result.driver.id === ref.id)?.driver.shortName ?? ref.code;
};

const ResultRows = ({ results, round, session, year }: { results: RaceResult[]; round: string; session?: Session; year: string }) => (
    <>
        {results.map(r => (
            <Link
                className="f1-row f1-grid-row"
                key={r.driver.id}
                params={{ driverId: r.driver.id, round, year }}
                search={{ session }}
                style={{ '--cols': RESULT_COLS, 'padding': '8px 18px' }}
                to="/seasons/$year/drivers/$driverId/races/$round"
            >
                <Text c="dimmed" className="f1-num" fw={700} inherit span>{r.positionLabel}</Text>
                <Group gap={9} wrap="nowrap">
                    <TeamBar color={r.constructor.color} size="sm" />
                    <Text fw={600} fz={13} inherit span>{r.driver.shortName}</Text>
                </Group>
                <Text c="dimmed" className="f1-num" fz={12.5} inherit span ta="center">{r.grid ?? 'PL'}</Text>
                <Text className="f1-num" fz={12.5} inherit span ta="right">{resultGap(r)}</Text>
                <Text c={r.points > 0 ? 'inherit' : 'var(--neutral-300)'} className="f1-num" fw={700} inherit span ta="right">
                    {r.points > 0 ? r.points : '–'}
                </Text>
            </Link>
        ))}
    </>
);

const ResultsHeader = () => (
    <GridHeader columns={RESULT_COLS}>
        <span>POS</span>
        <span>DRIVER</span>
        <span style={{ textAlign: 'center' }}>GRID</span>
        <span style={{ textAlign: 'right' }}>GAP</span>
        <span style={{ textAlign: 'right' }}>PTS</span>
    </GridHeader>
);

const ChartCard = ({ children, subtitle, title }: { children: React.ReactNode; subtitle: string; title: string }) => (
    <Box className="f1-card" p={16}>
        <Box fw={700} fz={15}>{title}</Box>
        <Box c="dimmed" fz={12} mb={8}>
            {subtitle}
        </Box>
        {children}
    </Box>
);

const ChartPlaceholder = ({ text }: { text: string }) => (
    <Box c="dimmed" fz={13} h={240} style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        {text}
    </Box>
);

const POSITION_TITLE = 'Position Changes';
const POSITION_SUBTITLE = `Track position every ${POSITION_LAP_STEP} laps · top ${CHART_DRIVER_COUNT} finishers`;
const PACE_TITLE = 'Race Pace';
const PACE_SUBTITLE = 'Lap time (s) · lower is faster · pit and safety car laps hidden';

const ChartPlaceholders = ({ text }: { text: string }) => (
    <>
        <ChartCard subtitle={POSITION_SUBTITLE} title={POSITION_TITLE}>
            <ChartPlaceholder text={text} />
        </ChartCard>
        <ChartCard subtitle={PACE_SUBTITLE} title={PACE_TITLE}>
            <ChartPlaceholder text={text} />
        </ChartCard>
    </>
);

const RaceCharts = ({ round, year }: { round: number; year: number }) => {
    const { data: laps } = useSuspenseQuery(raceLapsQuery(year, round));

    if (laps.drivers.every(driver => driver.laps.length === 0)) {
        return <ChartPlaceholders text="No lap data for this race" />;
    }

    const topDrivers = laps.drivers.slice(0, CHART_DRIVER_COUNT);
    const position = positionChart(topDrivers, POSITION_LAP_STEP);
    const pace = paceChart(topDrivers, true);

    return (
        <>
            <ChartCard subtitle={POSITION_SUBTITLE} title={POSITION_TITLE}>
                <LineChart
                    data={position.data}
                    dataKey="lap"
                    h={240}
                    series={position.series}
                    xAxisProps={{ interval: 'preserveStartEnd' }}
                    yAxisProps={{ allowDecimals: false, domain: [1, 'dataMax'], reversed: true }}
                />
            </ChartCard>
            <ChartCard subtitle={PACE_SUBTITLE} title={PACE_TITLE}>
                <LineChart
                    data={pace.data}
                    dataKey="lap"
                    h={240}
                    series={pace.series}
                    valueFormatter={v => v.toFixed(1)}
                    xAxisProps={{ interval: 'preserveStartEnd' }}
                    yAxisProps={{ domain: ['auto', 'auto'], tickCount: 5 }}
                />
            </ChartCard>
        </>
    );
};

const RaceDetail = () => {
    const { round, year } = Route.useParams();
    const { data } = useSuspenseQuery(raceDetailQuery(Number(year), Number(round)));

    const hasSessions = data.qualifying.some(q => q.q1 !== null);
    const qualifyingCols = hasSessions ? QUALIFYING_SESSION_COLS : QUALIFYING_TIME_COLS;

    const headStats: { driver: DriverRef | null; label: string; session?: Session }[] = [
        { driver: data.pole, label: 'POLE' },
        { driver: data.fastestLap?.driver ?? null, label: 'FASTEST LAP' },
    ];
    const sprintWinner = data.sprint.at(0);
    if (sprintWinner) {
        headStats.push({ driver: sprintWinner.driver, label: 'SPRINT WINNER', session: 'sprint' });
    }
    headStats.push({ driver: data.winner, label: 'WINNER' });

    return (
        <Stack gap={16}>
            {/* Hero */}
            <Group gap={0} justify="space-between" px={26} py={22} style={HERO_STYLE} wrap="nowrap">
                <div>
                    <Box c="var(--color-sidebar-muted)" fw={700} fz={12} lts="1px">
                        {`ROUND ${data.round} · ${data.season}`}
                    </Box>
                    <Box className="f1-display" ff="var(--font-display)" fw={700} fz={28} lts="-0.02em" my={6}>
                        {data.name}
                    </Box>
                    <Box c="var(--neutral-300)" fz={13}>
                        {`${data.circuit} · ${data.date ?? 'Date TBD'} · ${data.laps} laps`}
                    </Box>
                </div>
                <Group gap={26} wrap="nowrap">
                    {headStats.map(s => (
                        <Box key={s.label} ta="center">
                            <Box c="var(--color-sidebar-muted)" fw={600} fz={11}>{s.label}</Box>
                            <Box className="f1-display" ff="var(--font-display)" fw={700} fz={16} mt={3}>
                                {s.driver
                                    ? (
                                            <Link
                                                params={{ driverId: s.driver.id, round, year }}
                                                search={{ session: s.session }}
                                                style={{ color: 'inherit', textDecoration: 'none' }}
                                                to="/seasons/$year/drivers/$driverId/races/$round"
                                            >
                                                {shortNameFor(data.results, s.driver)}
                                            </Link>
                                        )
                                    : '—'}
                            </Box>
                        </Box>
                    ))}
                </Group>
            </Group>

            {/* Podium cards */}
            <SimpleGrid cols={3} spacing={16}>
                {data.results.slice(0, 3).map((r, i) => (
                    <Link
                        key={r.driver.id}
                        params={{ driverId: r.driver.id, round, year }}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        to="/seasons/$year/drivers/$driverId/races/$round"
                    >
                        <Box
                            className="f1-card f1-lift"
                            p={16}
                            style={{ borderTop: `4px solid ${r.constructor.color}`, cursor: 'pointer' }}
                        >
                            <Group gap={14} wrap="nowrap">
                                <Text c={MEDALS[i]} className="f1-display" ff="var(--font-display)" fw={700} fz={30} inherit span>{i + 1}</Text>
                                <DriverAvatar code={r.driver.code} color={r.constructor.color} size="lg" />
                                <div>
                                    <Box fw={700} fz={15}>{r.driver.name}</Box>
                                    <Box c="dimmed" fz={12}>{r.constructor.name}</Box>
                                    <Box className="f1-num" fw={600} fz={12} mt={2}>
                                        {resultGap(r)}
                                    </Box>
                                </div>
                            </Group>
                        </Box>
                    </Link>
                ))}
            </SimpleGrid>

            {/* Charts */}
            <SimpleGrid cols={2} spacing={16}>
                <Suspense fallback={<ChartPlaceholders text="Loading laps…" />}>
                    <RaceCharts round={Number(round)} year={Number(year)} />
                </Suspense>
            </SimpleGrid>

            {/* Results + Qual vs Race */}
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '7.2fr 4.8fr' }}>
                <SectionCard padded={false} title="Race Results">
                    <ResultsHeader />
                    <Box className="f1-scroll" mah={430} style={{ overflowY: 'auto' }}>
                        <ResultRows results={data.results} round={round} year={year} />
                    </Box>
                </SectionCard>

                <Box className="f1-card" p={16}>
                    <Box fw={700} fz={15}>Qualifying vs Race</Box>
                    <Box c="dimmed" fz={12} mb={14}>
                        Positions gained or lost on Sunday
                    </Box>
                    {data.results.slice(0, 10).map((r) => {
                        const delta = (r.grid ?? data.results.length) - r.position;
                        const mag = (Math.min(Math.abs(delta), 8) / 8) * 45;
                        const color = getDeltaColor(delta);
                        return (
                            <Group gap={10} key={r.driver.id} mb={11} wrap="nowrap">
                                <Text fw={700} fz={12} inherit span w={40}>{r.driver.code}</Text>
                                <Text c="dimmed" className="f1-num" fz={11} inherit span w={62}>
                                    {r.grid === null ? 'PL' : `P${r.grid}`}
                                    →P
                                    {r.position}
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

            {data.qualifying.length > 0 && (
                <SectionCard padded={false} title="Qualifying">
                    <GridHeader columns={qualifyingCols}>
                        <span>POS</span>
                        <span>DRIVER</span>
                        {hasSessions
                            ? (
                                    <>
                                        <span style={{ textAlign: 'right' }}>Q1</span>
                                        <span style={{ textAlign: 'right' }}>Q2</span>
                                        <span style={{ textAlign: 'right' }}>Q3</span>
                                    </>
                                )
                            : <span style={{ textAlign: 'right' }}>TIME</span>}
                        <span style={{ textAlign: 'right' }}>GAP</span>
                    </GridHeader>
                    {data.qualifying.map(q => (
                        <Link
                            className="f1-row f1-grid-row"
                            key={q.driver.id}
                            params={{ driverId: q.driver.id, round, year }}
                            style={{ '--cols': qualifyingCols, 'padding': '8px 18px' }}
                            to="/seasons/$year/drivers/$driverId/races/$round"
                        >
                            <Text c="dimmed" className="f1-num" fw={700} inherit span>{q.positionLabel}</Text>
                            <Group gap={9} wrap="nowrap">
                                <TeamBar color={q.constructor.color} size="sm" />
                                <Text fw={600} fz={13} inherit span>{q.driver.shortName}</Text>
                            </Group>
                            {hasSessions
                                ? (
                                        <>
                                            <Text className="f1-num" fz={12.5} inherit span ta="right">{q.q1}</Text>
                                            <Text className="f1-num" fz={12.5} inherit span ta="right">{q.q2}</Text>
                                            <Text className="f1-num" fz={12.5} inherit span ta="right">{q.q3}</Text>
                                        </>
                                    )
                                : <Text className="f1-num" fz={12.5} inherit span ta="right">{q.time}</Text>}
                            <Text c="dimmed" className="f1-num" fz={12.5} inherit span ta="right">{q.gap}</Text>
                        </Link>
                    ))}
                </SectionCard>
            )}

            {data.sprint.length > 0 && (
                <SectionCard padded={false} title="Sprint">
                    <ResultsHeader />
                    <ResultRows results={data.sprint} round={round} session="sprint" year={year} />
                </SectionCard>
            )}
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/races/$round')({
    component: RaceDetail,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        const round = parseRound(params.round);

        void context.queryClient.prefetchQuery(raceLapsQuery(year, round));

        const race = await context.queryClient.ensureQueryData(raceDetailQuery(year, round));

        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: race.name },
            ],
        };
    },
});
