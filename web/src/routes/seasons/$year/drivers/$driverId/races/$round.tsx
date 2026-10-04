import type { ChartReferenceLineProps, LineChartSeries } from '@mantine/charts';

import { LineChart } from '@mantine/charts';
import { Badge, Box, Group, SegmentedControl, Select, SimpleGrid, Stack, Switch, Text } from '@mantine/core';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';

import type { DriverRace } from '#/lib/api/drivers';
import type { DriverLaps, Session } from '#/lib/api/races';

import { GridHeader, MiniStat, SectionCard } from '#/components/f1-ui';
import { driverRaceQuery, raceDetailQuery, raceLapsQuery } from '#/data/queries';
import { SessionSchema } from '#/lib/api/races';
import { formatLapTime, formatPosition } from '#/lib/format';
import { lapLabel, paceChart, positionChart } from '#/lib/race-charts';
import { parseRound, parseYear } from '#/lib/route-params';

const LAP_COLS = '70px 1fr 60px';
const RIVAL_LAP_COLS = `${LAP_COLS} 90px`;
const PIT_COLS = '60px 60px 1fr';
const RIVAL_DASH = '6 4';
const SESSION_OPTIONS = [
    { label: 'Grand Prix', value: 'race' },
    { label: 'Sprint', value: 'sprint' },
];

const SearchSchema = z.object({
    session: SessionSchema.optional().catch(undefined),
    vs: z.string().optional().catch(undefined),
});

function crumbLabel(race: DriverRace, session: Session): string {
    if (session === 'sprint') {
        return `${race.raceName} Sprint`;
    }

    return race.raceName;
}

function dashRival(series: LineChartSeries[], isDashed: boolean): LineChartSeries[] {
    if (!isDashed || series.length < 2) {
        return series;
    }

    return [series[0], { ...series[1], strokeDasharray: RIVAL_DASH }];
}

function deltaColor(ms: number): string {
    if (ms < 0) {
        return 'var(--green-500)';
    }

    if (ms > 0) {
        return 'var(--mantine-primary-color-filled)';
    }

    return 'var(--neutral-400)';
}

function formatDelta(ms: number): string {
    const seconds = (ms / 1000).toFixed(3);
    if (ms > 0) {
        return `+${seconds}`;
    }

    return seconds;
}

function gapText(race: DriverRace): string {
    if (race.gap) {
        return race.gap;
    }

    if (race.time) {
        return race.time;
    }

    return '—';
}

function gridText(grid: null | number): string {
    if (grid === null) {
        return 'PL';
    }

    return `P${grid}`;
}

function lapTimeColor(timeMs: number, personalBestMs: number, raceFastestMs: number): string | undefined {
    if (timeMs !== personalBestMs) {
        return undefined;
    }

    if (timeMs === raceFastestMs) {
        return 'var(--purple-500)';
    }

    return 'var(--green-500)';
}

function pitLines(race: DriverRace, color: string, isDashed: boolean): ChartReferenceLineProps[] {
    return race.pitStops.map(stop => ({
        color,
        label: 'PIT',
        strokeDasharray: isDashed ? RIVAL_DASH : undefined,
        x: lapLabel(stop.lap),
    }));
}

const Hero = ({ race, round, year }: { race: DriverRace; round: string; year: string }) => {
    const color = race.constructor.color;
    const carNumber = race.carNumber === null ? '' : ` · #${race.carNumber}`;
    const details = [race.raceName];
    if (race.qualifyingPositionLabel) {
        details.push(`Qualified ${formatPosition(race.qualifyingPositionLabel)}`);
    }
    if (race.bestQualifyingTime) {
        details.push(race.bestQualifyingTime);
    }
    if (race.timePenalty) {
        details.push(`${race.timePenalty} penalty`);
    }

    const badges: string[] = [];
    if (race.isWin) {
        badges.push('WIN');
    }
    if (race.isPole) {
        badges.push('POLE');
    }
    if (race.isFastestLap) {
        badges.push('FASTEST LAP');
    }
    if (race.isDriverOfTheDay) {
        badges.push('DRIVER OF THE DAY');
    }
    if (race.isGrandSlam) {
        badges.push('GRAND SLAM');
    }

    return (
        <Group
            justify="space-between"
            px={28}
            py={24}
            style={{
                background: `linear-gradient(110deg, ${color}, color-mix(in srgb, ${color}, black 30%))`,
                borderRadius: 'var(--radius-lg)',
                color: '#fff',
            }}
            wrap="nowrap"
        >
            <Box>
                <Box fw={700} fz={12} lts="1px" opacity={0.85}>
                    {`${race.constructor.name}${carNumber}`}
                </Box>
                <Box className="f1-display" ff="var(--font-display)" fw={700} fz={30} lts="-0.02em">
                    {race.name}
                </Box>
                <Box fz={13} opacity={0.9}>
                    {details.join(' · ')}
                </Box>
                {badges.length > 0 && (
                    <Group gap={6} mt={10}>
                        {badges.map(badge => (
                            <Badge color="rgba(255,255,255,.2)" key={badge} variant="filled">{badge}</Badge>
                        ))}
                    </Group>
                )}
            </Box>
            <Link
                params={{ round, year }}
                style={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}
                to="/seasons/$year/races/$round"
            >
                Full race →
            </Link>
        </Group>
    );
};

const LapTable = ({ driver, raceFastestMs, rival, stopLaps }: {
    driver: DriverLaps;
    raceFastestMs: number;
    rival: DriverLaps | undefined;
    stopLaps: Set<number>;
}) => {
    const personalBestMs = Math.min(...driver.laps.map(l => l.timeMs));
    const rivalTimes = new Map<number, number>();
    const rivalLaps = rival?.laps ?? [];
    for (const lap of rivalLaps) {
        rivalTimes.set(lap.lap, lap.timeMs);
    }
    const cols = rival ? RIVAL_LAP_COLS : LAP_COLS;

    return (
        <SectionCard padded={false} title="Lap Times">
            <GridHeader columns={cols}>
                <span>LAP</span>
                <span>TIME</span>
                <span style={{ textAlign: 'center' }}>POS</span>
                {rival && <span style={{ textAlign: 'right' }}>{`VS ${rival.driver.code}`}</span>}
            </GridHeader>
            <Box className="f1-scroll" mah={480} style={{ overflowY: 'auto' }}>
                {driver.laps.map((lap) => {
                    const rivalMs = rivalTimes.get(lap.lap);

                    return (
                        <Box
                            className="f1-grid-row"
                            key={lap.lap}
                            py={7}
                            style={{ '--cols': cols }}
                        >
                            <Group gap={6} wrap="nowrap">
                                <Text c="dimmed" className="f1-num" fw={700} inherit span>{lap.lap}</Text>
                                {stopLaps.has(lap.lap) && <Badge size="xs" variant="light">PIT</Badge>}
                            </Group>
                            <Text c={lapTimeColor(lap.timeMs, personalBestMs, raceFastestMs)} className="f1-num" fw={600} inherit span>
                                {formatLapTime(lap.timeMs)}
                            </Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{lap.position ?? '–'}</Text>
                            {rival && (
                                <Text c={rivalMs === undefined ? undefined : deltaColor(lap.timeMs - rivalMs)} className="f1-num" fw={600} inherit span ta="right">
                                    {rivalMs === undefined ? '' : formatDelta(lap.timeMs - rivalMs)}
                                </Text>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </SectionCard>
    );
};

const PitStops = ({ race }: { race: DriverRace }) => {
    if (race.pitStopCount === null) {
        return (
            <SectionCard title="Pit Stops">
                <Text c="dimmed" fz={13}>Pit stop data isn&apos;t available for this race.</Text>
            </SectionCard>
        );
    }

    if (race.pitStops.length === 0) {
        return (
            <SectionCard title="Pit Stops">
                <Text c="dimmed" fz={13}>No pit stops.</Text>
            </SectionCard>
        );
    }

    return (
        <SectionCard padded={false} title="Pit Stops">
            <GridHeader columns={PIT_COLS}>
                <span>STOP</span>
                <span>LAP</span>
                <span style={{ textAlign: 'right' }}>DURATION</span>
            </GridHeader>
            {race.pitStops.map(stop => (
                <Box
                    className="f1-grid-row"
                    key={stop.stop}
                    py={8}
                    style={{ '--cols': PIT_COLS }}
                >
                    <Text className="f1-num" fw={700} inherit span>{stop.stop}</Text>
                    <Text className="f1-num" inherit span>{stop.lap}</Text>
                    <Text className="f1-num" inherit span ta="right">{stop.duration || '–'}</Text>
                </Box>
            ))}
        </SectionCard>
    );
};

const DriverRacePage = () => {
    const { driverId, round, year } = Route.useParams();
    const { session = 'race', vs } = Route.useSearch();
    const isSprint = session === 'sprint';
    const navigate = Route.useNavigate();
    const [showAllLaps, setShowAllLaps] = useState(false);

    const { data: race } = useSuspenseQuery(driverRaceQuery(Number(year), Number(round), driverId, session));
    const { data: raceDetail } = useSuspenseQuery(raceDetailQuery(Number(year), Number(round)));
    const { data: raceLaps } = useSuspenseQuery(raceLapsQuery(Number(year), Number(round), session));
    const { data: rivalRace } = useQuery({
        ...driverRaceQuery(Number(year), Number(round), vs ?? '', session),
        enabled: vs !== undefined,
    });

    const ownResult = raceDetail.results.find(r => r.driver.id === driverId);
    const rivalOptions = [];
    for (const result of raceDetail.results) {
        if (result.driver.id === driverId) {
            continue;
        }
        const isTeammate = result.constructor.id === ownResult?.constructor.id;
        rivalOptions.push({
            label: isTeammate ? `${result.driver.name} (teammate)` : result.driver.name,
            value: result.driver.id,
        });
    }

    const driverLaps = raceLaps.drivers.find(d => d.driver.id === driverId);
    const rivalLaps = raceLaps.drivers.find(d => d.driver.id === vs);
    const chartDrivers: DriverLaps[] = [];
    if (driverLaps) {
        chartDrivers.push(driverLaps);
    }
    if (rivalLaps) {
        chartDrivers.push(rivalLaps);
    }
    const hasLapData = driverLaps !== undefined && driverLaps.laps.length > 0;
    const isRivalDashed = rivalLaps !== undefined && rivalLaps.color === driverLaps?.color;

    const referenceLines = pitLines(race, race.constructor.color, false);
    if (rivalRace && rivalLaps) {
        referenceLines.push(...pitLines(rivalRace, rivalLaps.color, true));
    }

    const position = positionChart(chartDrivers, 1);
    const pace = paceChart(chartDrivers, !showAllLaps);
    const raceFastestMs = Math.min(...raceLaps.drivers.flatMap(d => d.laps.map(l => l.timeMs)));
    const stopLaps = new Set(race.pitStops.map(s => s.lap));

    return (
        <Stack gap={16}>
            <Hero race={race} round={round} year={year} />

            {race.hasSprint && (
                <SegmentedControl
                    data={SESSION_OPTIONS}
                    onChange={value => void navigate({ search: prev => ({ ...prev, session: value === 'sprint' ? 'sprint' : undefined }) })}
                    style={{ alignSelf: 'flex-start' }}
                    value={session}
                />
            )}

            <SimpleGrid cols={isSprint ? 4 : 6} spacing={8}>
                <MiniStat label="RESULT" value={formatPosition(race.positionLabel)} />
                <MiniStat label="GRID → RESULT" value={<span style={{ whiteSpace: 'nowrap' }}>{`${gridText(race.grid)} → ${formatPosition(race.positionLabel)}`}</span>} />
                <MiniStat label="GAP" value={gapText(race)} />
                <MiniStat label="POINTS" value={race.points} />
                {!isSprint && <MiniStat label="PIT STOPS" value={race.pitStopCount ?? '–'} />}
                {!isSprint && <MiniStat label="FASTEST LAP" value={race.fastestLapRank === null ? '–' : `P${race.fastestLapRank}`} />}
            </SimpleGrid>

            {hasLapData
                ? (
                        <>
                            <Group justify="space-between">
                                <Select
                                    clearable
                                    data={rivalOptions}
                                    onChange={value => void navigate({ search: prev => ({ ...prev, vs: value ?? undefined }) })}
                                    placeholder="Compare with…"
                                    searchable
                                    value={vs ?? null}
                                    w={280}
                                />
                                <Switch
                                    checked={showAllLaps}
                                    label="Show all laps"
                                    onChange={event => setShowAllLaps(event.currentTarget.checked)}
                                />
                            </Group>

                            <SimpleGrid cols={2} spacing={16}>
                                <Box className="f1-card" p={16}>
                                    <Box fw={700} fz={15} mb={8}>Race Pace</Box>
                                    <LineChart
                                        data={pace.data}
                                        dataKey="lap"
                                        h={240}
                                        referenceLines={referenceLines}
                                        series={dashRival(pace.series, isRivalDashed)}
                                        valueFormatter={v => v.toFixed(3)}
                                        xAxisProps={{ interval: 'preserveStartEnd' }}
                                        yAxisProps={{ domain: ['auto', 'auto'], tickCount: 5 }}
                                    />
                                </Box>
                                <Box className="f1-card" p={16}>
                                    <Box fw={700} fz={15} mb={8}>Position</Box>
                                    <LineChart
                                        data={position.data}
                                        dataKey="lap"
                                        h={240}
                                        referenceLines={referenceLines}
                                        series={dashRival(position.series, isRivalDashed)}
                                        xAxisProps={{ interval: 'preserveStartEnd' }}
                                        yAxisProps={{ allowDecimals: false, domain: [1, 'dataMax'], reversed: true }}
                                    />
                                </Box>
                            </SimpleGrid>

                            {isSprint && <LapTable driver={driverLaps} raceFastestMs={raceFastestMs} rival={rivalLaps} stopLaps={stopLaps} />}
                            {!isSprint && (
                                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '7fr 5fr' }}>
                                    <LapTable driver={driverLaps} raceFastestMs={raceFastestMs} rival={rivalLaps} stopLaps={stopLaps} />
                                    <PitStops race={race} />
                                </div>
                            )}
                        </>
                    )
                : (
                        <>
                            <SectionCard title="Lap Times">
                                <Text c="dimmed" fz={13}>Lap data isn&apos;t available for this race.</Text>
                            </SectionCard>
                            {!isSprint && <PitStops race={race} />}
                        </>
                    )}
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/drivers/$driverId/races/$round')({
    component: DriverRacePage,
    validateSearch: SearchSchema,
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch, loaderDeps, loader)
    loaderDeps: ({ search }): { session: Session } => ({ session: search.session ?? 'race' }),
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch, loaderDeps, loader)
    loader: async ({ context, deps, params }) => {
        const year = parseYear(params.year);
        const round = parseRound(params.round);

        void context.queryClient.prefetchQuery(raceLapsQuery(year, round, deps.session));
        void context.queryClient.prefetchQuery(raceDetailQuery(year, round));

        const race = await context.queryClient.ensureQueryData(driverRaceQuery(year, round, params.driverId, deps.session));

        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: race.name, params: { driverId: params.driverId, year: params.year }, to: '/seasons/$year/drivers/$driverId' },
                { label: crumbLabel(race, deps.session) },
            ],
        };
    },
});
