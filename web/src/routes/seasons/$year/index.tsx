import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import {
    CalendarDotsIcon,
    CrownIcon,
    FlagCheckeredIcon,
    GaugeIcon,
} from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { memo, useMemo } from 'react';

import type { CalendarRound } from '#/data/types';
import type { DriverStanding } from '#/lib/api/seasons';

import { GridHeader, SectionCard, StatCard, TeamBar } from '#/components/f1-ui';
import { LineChart } from '#/components/line-chart';
import { calendarQuery, seasonOverviewQuery } from '#/data/queries';
import { parseYear } from '#/lib/route-params';

const DRIVER_COLS = '34px 1fr 64px 56px 70px';

type MiniRaceCellProps = {
    completed: number;
    driverByCode: Map<string, DriverStanding>;
    r: CalendarRound;
    year: string;
};

const MiniRaceCell = memo(function MiniRaceCell({ completed, driverByCode, r, year }: MiniRaceCellProps) {
    const isDone = r.round <= completed;
    const isNext = r.round === completed + 1;
    const winner = r.winner ? driverByCode.get(r.winner) : null;

    let background: string;
    let border: string;
    if (isDone) {
        background = 'var(--mantine-color-default)';
        border = '1px solid var(--mantine-color-default-border)';
    } else if (isNext) {
        background = 'color-mix(in srgb, var(--mantine-primary-color-filled) 6%, var(--mantine-color-body))';
        border = '1px solid color-mix(in srgb, var(--mantine-primary-color-filled) 40%, var(--mantine-color-default-border))';
    } else {
        background = 'var(--color-accent)';
        border = '1px solid var(--mantine-color-default-border)';
    }

    const cell = (
        <Box
            className={isDone ? 'f1-lift' : undefined}
            px={10}
            py={9}
            style={{ background, border, borderRadius: 7, cursor: isDone ? 'pointer' : 'default' }}
        >
            <Box c="dimmed" className="f1-num" fw={700} fz={10}>
                R
                {r.round}
            </Box>
            <Box fw={700} fz={12.5} mt={2}>{r.code}</Box>
            <Box c="dimmed" fz={10.5} mt={1}>{r.date}</Box>
            <Box
                bg={winner?.constructor?.color ?? 'var(--mantine-color-default-border)'}
                h={3}
                mt={7}
                style={{ borderRadius: 2 }}
            />
        </Box>
    );

    if (isDone) {
        return (
            <Link params={{ round: String(r.round), year }} style={{ textDecoration: 'none' }} to="/seasons/$year/races/$round">
                {cell}
            </Link>
        );
    }

    return cell;
});

const ACTION_LINK: React.CSSProperties = {
    color: 'var(--mantine-primary-color-filled)',
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
};

const SeasonOverview = () => {
    const { year } = Route.useParams();
    const { data: overview } = useSuspenseQuery(seasonOverviewQuery(Number(year)));
    const { data: calendar } = useSuspenseQuery(calendarQuery(Number(year)));
    const driverByCode = useMemo(
        () => new Map(overview.drivers.map(d => [d.code, d])),
        [overview.drivers],
    );

    if (overview.leader === null || overview.runnerUp === null) {
        return <SectionCard title="Championship Standings">No championship standings recorded.</SectionCard>;
    }

    const { leader, runnerUp } = overview;
    const topDrivers = overview.drivers.slice(0, 8);

    return (
        <Stack gap={16}>
            <Group align="flex-end" gap={0} justify="space-between" wrap="nowrap">
                <div>
                    <Box c="dimmed" fw={700} fz={12} lts="1.5px" tt="uppercase">
                        FIA FORMULA 1 WORLD CHAMPIONSHIP
                    </Box>
                    <Box
                        className="f1-display"
                        component="h1"
                        ff="var(--font-display)"
                        fw={700}
                        fz={30}
                        lts="-0.02em"
                        mb={0}
                        mt={6}
                    >
                        {`${year} Season Overview`}
                    </Box>
                </div>
                <Box ta="right">
                    <Box c="dimmed" fz={12}>Last round</Box>
                    <Box fw={700} fz={15}>{calendar.lastRaceName}</Box>
                </Box>
            </Group>

            {/* KPI cards */}
            <SimpleGrid cols={2} spacing={16}>
                <StatCard
                    accent="var(--mantine-primary-color-filled)"
                    icon={<FlagCheckeredIcon size={15} weight="fill" />}
                    label="Round"
                    sub="season progress"
                    value={`${calendar.completed} / ${calendar.totalRounds}`}
                />
                <StatCard
                    accent="var(--gold-500)"
                    icon={<CrownIcon size={15} weight="fill" />}
                    label="Championship Leader"
                    sub={`${leader.points} pts`}
                    value={leader.name}
                />
                <StatCard
                    accent="var(--mantine-primary-color-filled)"
                    icon={<GaugeIcon size={15} weight="fill" />}
                    label="Lead Margin"
                    sub={`over ${runnerUp.name}`}
                    value={`+${leader.points - runnerUp.points}`}
                />
                <StatCard
                    accent="var(--teal-500)"
                    icon={<CalendarDotsIcon size={15} />}
                    label="Next Race"
                    sub={calendar.nextRace.name}
                    value={calendar.nextRace.code}
                />
            </SimpleGrid>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '7.2fr 4.8fr' }}>
                <SectionCard
                    action={(
                        <Link params={{ year }} style={ACTION_LINK} to="/seasons/$year/standings">
                            View full table →
                        </Link>
                    )}
                    padded={false}
                    title="Drivers' Championship"
                >
                    <GridHeader columns={DRIVER_COLS}>
                        <span>POS</span>
                        <span>DRIVER</span>
                        <span style={{ textAlign: 'right' }}>PTS</span>
                        <span style={{ textAlign: 'center' }}>WINS</span>
                        <span style={{ textAlign: 'right' }}>GAP</span>
                    </GridHeader>
                    {topDrivers.map((d, i) => (
                        <Link
                            className="f1-row"
                            key={d.code}
                            params={{ driverId: d.code, year }}
                            style={{
                                alignItems: 'center',
                                borderTop: '1px solid var(--mantine-color-default-border)',
                                color: 'inherit',
                                display: 'grid',
                                gridTemplateColumns: DRIVER_COLS,
                                padding: '9px 18px',
                                textDecoration: 'none',
                            }}
                            to="/seasons/$year/drivers/$driverId"
                        >
                            <Text c="dimmed" className="f1-num" fw={700} inherit span>{i + 1}</Text>
                            <Group gap={11} wrap="nowrap">
                                <TeamBar color={d.constructor?.color ?? 'var(--neutral-500)'} />
                                <Box miw={0}>
                                    <Box fw={600} fz={13.5} style={{ whiteSpace: 'nowrap' }}>{d.name}</Box>
                                    <Box c="dimmed" fz={11}>{d.constructor?.name ?? 'No constructor recorded'}</Box>
                                </Box>
                            </Group>
                            <Text className="f1-num f1-display" fw={700} inherit span ta="right">{d.points}</Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{d.wins}</Text>
                            <Text c="dimmed" className="f1-num" fz={12.5} inherit span ta="right">
                                {i === 0 ? '—' : `-${leader.points - d.points}`}
                            </Text>
                        </Link>
                    ))}
                </SectionCard>

                <SectionCard
                    action={(
                        <Link style={ACTION_LINK} to="/constructors">
                            Compare →
                        </Link>
                    )}
                    padded={false}
                    title="Constructors"
                >
                    {overview.constructors.map(c => (
                        <Box
                            key={c.id}
                            px={18}
                            py={8}
                            style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}
                        >
                            <Group justify="space-between" mb={5} wrap="nowrap">
                                <Group gap={9} wrap="nowrap">
                                    <Text c="dimmed" className="f1-num" fw={700} fz={11} inherit span ta="center" w={18}>{c.positionLabel}</Text>
                                    <Text fw={600} fz={13} inherit span>{c.name}</Text>
                                </Group>
                                <Text className="f1-num f1-display" fw={700} fz={13} inherit span>{c.points}</Text>
                            </Group>
                            <Box ml={27}>
                                <Box
                                    bg="var(--mantine-color-default-border)"
                                    h={5}
                                    style={{ borderRadius: 9999, overflow: 'hidden' }}
                                >
                                    <Box
                                        bg={c.color}
                                        h="100%"
                                        style={{ borderRadius: 9999 }}
                                        w={`${(c.points / overview.maxConstructorPoints) * 100}%`}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </SectionCard>
            </div>

            {/* Points progression chart */}
            <Box className="f1-card" p={16}>
                <Group align="flex-start" gap={0} justify="space-between" mb={6} wrap="nowrap">
                    <div>
                        <Box fw={700} fz={15}>Championship Points Progression</Box>
                        <Box c="dimmed" fz={12} mt={2}>
                            Cumulative points after each round · top 6 drivers
                        </Box>
                    </div>
                    <Group gap={14} wrap="nowrap">
                        {overview.progression.series.map(s => (
                            <Group fw={600} fz={12} gap={6} key={s.name} wrap="nowrap">
                                <Box bg={s.color} h={3} style={{ borderRadius: 2 }} w={11} />
                                {s.name}
                            </Group>
                        ))}
                    </Group>
                </Group>
                <LineChart
                    data={overview.progression.data}
                    dataKey="round"
                    h={280}
                    series={overview.progression.series}
                    xAxisProps={{ interval: 1 }}
                    yAxisProps={{ tickCount: 6 }}
                />
            </Box>

            <SectionCard
                action={(
                    <Link params={{ year }} style={ACTION_LINK} to="/seasons/$year/calendar">
                        Full calendar →
                    </Link>
                )}
                title={`${year} Calendar`}
            >
                <SimpleGrid cols={8} spacing={9}>
                    {calendar.calendar.map(r => (
                        <MiniRaceCell
                            completed={calendar.completed}
                            driverByCode={driverByCode}
                            key={r.round}
                            r={r}
                            year={year}
                        />
                    ))}
                </SimpleGrid>
            </SectionCard>
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/')({
    component: SeasonOverview,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        await Promise.all([
            context.queryClient.ensureQueryData(seasonOverviewQuery(year)),
            context.queryClient.ensureQueryData(calendarQuery(year)),
        ]);
        return { crumbs: [{ label: 'Season Overview' }] };
    },
});
