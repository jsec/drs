import { LineChart } from '@mantine/charts';
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense } from 'react';

import type { DriverRef, RaceResult, Session } from '#/lib/api/races';

import { DriverAvatar, GridHeader, SectionCard, TeamBar } from '#/components/f1-ui';
import { raceDetailQuery, raceLapsQuery } from '#/data/queries';
import { formatGrid } from '#/lib/format';
import { paceChart, positionChart } from '#/lib/race-charts';
import { parseRound, parseYear } from '#/lib/route-params';

const CHART_DRIVER_COUNT = 5;
const POSITION_LAP_STEP = 5;
const MEDALS = ['#f59f00', '#adb5bd', '#e8590c'];
const DELTA_DRIVER_COUNT = 10;
const MAX_CHARTED_DELTA = 8;
const MAX_DELTA_BAR_WIDTH = 45;
const RESULT_COLUMNS = '36px 1fr 72px 90px 48px';
const QUALIFYING_SESSION_COLUMNS = '36px 1fr 90px 90px 90px 80px';
const QUALIFYING_TIME_COLUMNS = '36px 1fr 90px 80px';

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

const ResultRows = ({ results, round, session, year }: { results: RaceResult[]; round: string; session?: Session; year: string }) => (
    <>
        {results.map(result => (
            <Link
                className="f1-row f1-grid-row"
                key={result.driver.id}
                params={{
                    driverId: result.driver.id,
                    round,
                    year,
                }}
                search={{ session }}
                style={{ '--cols': RESULT_COLUMNS, 'padding': '8px 18px' }}
                to="/seasons/$year/drivers/$driverId/races/$round"
            >
                <Text c="dimmed" className="f1-num" fw={700} inherit span>{result.positionLabel}</Text>
                <Group gap={9} wrap="nowrap">
                    <TeamBar color={result.constructor.color} size="sm" />
                    <Text fw={600} fz={13} inherit span>{result.driver.shortName}</Text>
                </Group>
                <Text c="dimmed" className="f1-num" fz={12.5} inherit span ta="center">{result.grid ?? 'PL'}</Text>
                <Text className="f1-num" fz={12.5} inherit span ta="right">{resultGap(result)}</Text>
                <Text c={result.points > 0 ? 'inherit' : 'var(--neutral-300)'} className="f1-num" fw={700} inherit span ta="right">
                    {result.points > 0 ? result.points : '–'}
                </Text>
            </Link>
        ))}
    </>
);

const ResultsHeader = () => (
    <GridHeader columns={RESULT_COLUMNS}>
        <span>POS</span>
        <span>DRIVER</span>
        <span style={{ textAlign: 'center' }}>GRID</span>
        <span style={{ textAlign: 'right' }}>GAP</span>
        <span style={{ textAlign: 'right' }}>PTS</span>
    </GridHeader>
);

const ChartPlaceholder = ({ text }: { text: string }) => (
    <Box
        c="dimmed"
        fz={13}
        h={240}
        style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
        }}
    >
        {text}
    </Box>
);

const POSITION_TITLE = 'Position Changes';
const POSITION_SUBTITLE = `Track position every ${POSITION_LAP_STEP} laps · top ${CHART_DRIVER_COUNT} finishers`;
const PACE_TITLE = 'Race Pace';
const PACE_SUBTITLE = 'Lap time (s) · lower is faster · pit laps hidden';

const ChartPlaceholders = ({ text }: { text: string }) => (
    <>
        <SectionCard subtitle={POSITION_SUBTITLE} title={POSITION_TITLE}>
            <ChartPlaceholder text={text} />
        </SectionCard>
        <SectionCard subtitle={PACE_SUBTITLE} title={PACE_TITLE}>
            <ChartPlaceholder text={text} />
        </SectionCard>
    </>
);

const RaceCharts = ({ round, year }: { round: number; year: number }) => {
    const { data: laps } = useSuspenseQuery(raceLapsQuery(year, round));

    if (laps.drivers.every(driver => driver.laps.length === 0)) {
        return <ChartPlaceholders text="No lap data for this race" />;
    }

    const topDrivers = laps.drivers.slice(0, CHART_DRIVER_COUNT);
    const position = positionChart(topDrivers, POSITION_LAP_STEP);
    const driversWithoutPitLaps = topDrivers.map(driver => ({ ...driver, laps: driver.laps.filter(lap => !lap.isPitLap) }));
    const pace = paceChart(driversWithoutPitLaps);

    return (
        <>
            <SectionCard subtitle={POSITION_SUBTITLE} title={POSITION_TITLE}>
                <LineChart
                    data={position.data}
                    dataKey="lap"
                    h={240}
                    series={position.series}
                    xAxisProps={{ interval: 'preserveStartEnd' }}
                    yAxisProps={{
                        allowDecimals: false,
                        domain: [1, 'dataMax'],
                        reversed: true,
                    }}
                />
            </SectionCard>
            <SectionCard subtitle={PACE_SUBTITLE} title={PACE_TITLE}>
                <LineChart
                    data={pace.data}
                    dataKey="lap"
                    h={240}
                    series={pace.series}
                    valueFormatter={value => value.toFixed(1)}
                    xAxisProps={{ interval: 'preserveStartEnd' }}
                    yAxisProps={{
                        allowDataOverflow: true,
                        domain: ['auto', (dataMax: number) => Math.min(dataMax, pace.ceiling)],
                        tickCount: 5,
                    }}
                />
            </SectionCard>
        </>
    );
};

const RaceDetail = () => {
    const { round, year } = Route.useParams();
    const { data: race } = useSuspenseQuery(raceDetailQuery(Number(year), Number(round)));

    const hasSessions = race.qualifying.some(entry => entry.q1 !== null);
    const qualifyingColumns = hasSessions ? QUALIFYING_SESSION_COLUMNS : QUALIFYING_TIME_COLUMNS;

    const headStats: { driver: DriverRef | null | undefined; label: string; session?: Session }[] = [
        { driver: race.pole, label: 'POLE' },
        { driver: race.fastestLap?.driver, label: 'FASTEST LAP' },
    ];
    const sprintWinner = race.sprint.at(0);
    if (sprintWinner) {
        headStats.push({
            driver: sprintWinner.driver,
            label: 'SPRINT WINNER',
            session: 'sprint',
        });
    }

    headStats.push({ driver: race.winner, label: 'WINNER' });

    return (
        <Stack gap={16}>
            <Group gap={0} justify="space-between" px={26} py={22} style={HERO_STYLE} wrap="nowrap">
                <div>
                    <Box c="var(--color-sidebar-muted)" fw={700} fz={12} lts="1px">
                        {`ROUND ${race.round} · ${race.season}`}
                    </Box>
                    <Box className="f1-display" ff="var(--font-display)" fw={700} fz={28} lts="-0.02em" my={6}>
                        {race.name}
                    </Box>
                    <Box c="var(--neutral-300)" fz={13}>
                        {`${race.circuit} · ${race.date ?? 'Date TBD'} · ${race.laps} laps`}
                    </Box>
                </div>
                <Group gap={26} wrap="nowrap">
                    {headStats.map(stat => (
                        <Box key={stat.label} ta="center">
                            <Box c="var(--color-sidebar-muted)" fw={600} fz={11}>{stat.label}</Box>
                            <Box className="f1-display" ff="var(--font-display)" fw={700} fz={16} mt={3}>
                                {stat.driver
                                    ? (
                                            <Link
                                                className="f1-plain-link"
                                                params={{
                                                    driverId: stat.driver.id,
                                                    round,
                                                    year,
                                                }}
                                                search={{ session: stat.session }}
                                                to="/seasons/$year/drivers/$driverId/races/$round"
                                            >
                                                {race.results.find(result => result.driver.id === stat.driver?.id)?.driver.shortName ?? stat.driver.code}
                                            </Link>
                                        )
                                    : '—'}
                            </Box>
                        </Box>
                    ))}
                </Group>
            </Group>

            <SimpleGrid cols={3} spacing={16}>
                {race.results.slice(0, MEDALS.length).map((result, index) => (
                    <Link
                        className="f1-plain-link"
                        key={result.driver.id}
                        params={{
                            driverId: result.driver.id,
                            round,
                            year,
                        }}
                        to="/seasons/$year/drivers/$driverId/races/$round"
                    >
                        <Box
                            className="f1-card f1-lift"
                            p={16}
                            style={{ borderTop: `4px solid ${result.constructor.color}`, cursor: 'pointer' }}
                        >
                            <Group gap={14} wrap="nowrap">
                                <Text c={MEDALS[index]} className="f1-display" ff="var(--font-display)" fw={700} fz={30} inherit span>{index + 1}</Text>
                                <DriverAvatar code={result.driver.code} color={result.constructor.color} size="lg" />
                                <div>
                                    <Box fw={700} fz={15}>{result.driver.name}</Box>
                                    <Box c="dimmed" fz={12}>{result.constructor.name}</Box>
                                    <Box className="f1-num" fw={600} fz={12} mt={2}>
                                        {resultGap(result)}
                                    </Box>
                                </div>
                            </Group>
                        </Box>
                    </Link>
                ))}
            </SimpleGrid>

            <SimpleGrid cols={2} spacing={16}>
                <Suspense fallback={<ChartPlaceholders text="Loading laps…" />}>
                    <RaceCharts round={Number(round)} year={Number(year)} />
                </Suspense>
            </SimpleGrid>

            <div style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: '7.2fr 4.8fr',
            }}
            >
                <SectionCard isPadded={false} title="Race Results">
                    <ResultsHeader />
                    <Box className="f1-scroll" mah={430} style={{ overflowY: 'auto' }}>
                        <ResultRows results={race.results} round={round} year={year} />
                    </Box>
                </SectionCard>

                <SectionCard subtitle="Positions gained or lost on Sunday" title="Qualifying vs Race">
                    {race.results.slice(0, DELTA_DRIVER_COUNT).map((result) => {
                        const delta = (result.grid ?? race.results.length) - result.position;
                        const magnitude = (Math.min(Math.abs(delta), MAX_CHARTED_DELTA) / MAX_CHARTED_DELTA) * MAX_DELTA_BAR_WIDTH;
                        const color = getDeltaColor(delta);

                        return (
                            <Group gap={10} key={result.driver.id} mb={11} wrap="nowrap">
                                <Text fw={700} fz={12} inherit span w={40}>{result.driver.code}</Text>
                                <Text c="dimmed" className="f1-num" fz={11} inherit span w={62}>
                                    {formatGrid(result.grid)}
                                    →P
                                    {result.position}
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
                                        left={delta >= 0 ? '50%' : `${50 - magnitude}%`}
                                        pos="absolute"
                                        style={{ borderRadius: 3 }}
                                        top={3}
                                        w={`${Math.max(magnitude, 1)}%`}
                                    />
                                </Box>
                                <Text c={color} className="f1-num" fw={700} fz={12} inherit span ta="right" w={34}>
                                    {delta > 0 ? `+${delta}` : delta}
                                </Text>
                            </Group>
                        );
                    })}
                </SectionCard>
            </div>

            {race.qualifying.length > 0 && (
                <SectionCard isPadded={false} title="Qualifying">
                    <GridHeader columns={qualifyingColumns}>
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
                    {race.qualifying.map(entry => (
                        <Link
                            className="f1-row f1-grid-row"
                            key={entry.driver.id}
                            params={{
                                driverId: entry.driver.id,
                                round,
                                year,
                            }}
                            style={{ '--cols': qualifyingColumns, 'padding': '8px 18px' }}
                            to="/seasons/$year/drivers/$driverId/races/$round"
                        >
                            <Text c="dimmed" className="f1-num" fw={700} inherit span>{entry.positionLabel}</Text>
                            <Group gap={9} wrap="nowrap">
                                <TeamBar color={entry.constructor.color} size="sm" />
                                <Text fw={600} fz={13} inherit span>{entry.driver.shortName}</Text>
                            </Group>
                            {hasSessions
                                ? (
                                        <>
                                            <Text className="f1-num" fz={12.5} inherit span ta="right">{entry.q1}</Text>
                                            <Text className="f1-num" fz={12.5} inherit span ta="right">{entry.q2}</Text>
                                            <Text className="f1-num" fz={12.5} inherit span ta="right">{entry.q3}</Text>
                                        </>
                                    )
                                : <Text className="f1-num" fz={12.5} inherit span ta="right">{entry.time}</Text>}
                            <Text c="dimmed" className="f1-num" fz={12.5} inherit span ta="right">{entry.gap}</Text>
                        </Link>
                    ))}
                </SectionCard>
            )}

            {race.sprint.length > 0 && (
                <SectionCard isPadded={false} title="Sprint">
                    <ResultsHeader />
                    <ResultRows results={race.sprint} round={round} session="sprint" year={year} />
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
