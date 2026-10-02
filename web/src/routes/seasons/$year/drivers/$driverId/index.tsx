import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { HTTPError } from 'ky';

import type { DriverSeason as DriverSeasonData, DriverSeasonRace } from '#/lib/api/drivers';

import { GridHeader, MiniStat } from '#/components/f1-ui';
import { LineChart } from '#/components/line-chart';
import { driverSeasonQuery } from '#/data/queries';
import { formatPosition, isNumericPosition } from '#/lib/format';
import { parseYear } from '#/lib/route-params';

const COLS = '44px 1fr 70px 70px 70px 60px';
const SPRINT_COLS = `${COLS} 80px`;

function finishColor(position: number, teamColor: string): string {
    if (position <= 3) {
        return 'var(--gold-500)';
    }

    if (position <= 10) {
        return teamColor;
    }

    return 'var(--neutral-300)';
}

function raceStatus(race: DriverSeasonRace): [label: string, color: string] {
    if (race.statusCategory !== 'finished' || race.position === null) {
        const label = isNumericPosition(race.positionLabel) ? 'DNF' : race.positionLabel;
        return [label, 'var(--mantine-primary-color-filled)'];
    }

    if (race.position === 1) {
        return ['WIN', 'var(--gold-500)'];
    }

    if (race.position <= 3) {
        return ['PODIUM', 'var(--silver-500)'];
    }

    if (race.points > 0) {
        return ['POINTS', 'var(--green-500)'];
    }

    return ['—', 'var(--neutral-400)'];
}

const DriverSeason = () => {
    const { driverId, year } = Route.useParams();
    const { data: driver } = useSuspenseQuery(driverSeasonQuery(Number(year), driverId));
    const color = driver.constructor.color;
    const pointsMax = Math.max(50, Math.ceil(driver.points / 50) * 50);
    const hasSprints = driver.races.some(r => r.sprint !== null);
    const cols = hasSprints ? SPRINT_COLS : COLS;
    const carNumber = driver.carNumber === null ? '–' : `#${driver.carNumber}`;
    const progression = [
        { [driver.code]: 0, x: 'R0' },
        ...driver.progression.map(p => ({ [driver.code]: p.points, x: `R${p.round}` })),
    ];

    return (
        <Stack gap={16}>
            <Group
                gap={24}
                pos="relative"
                px={28}
                py={24}
                style={{
                    background: `linear-gradient(110deg, ${color}, color-mix(in srgb, ${color}, black 30%))`,
                    borderRadius: 'var(--radius-lg)',
                    color: '#fff',
                    overflow: 'hidden',
                }}
                wrap="nowrap"
            >
                <Box
                    ff="var(--font-display)"
                    fw={700}
                    fz={140}
                    opacity={0.18}
                    pos="absolute"
                    right={24}
                    style={{ lineHeight: 0.8, transform: 'translateY(-50%)' }}
                    top="50%"
                >
                    {driver.carNumber}
                </Box>
                <Group
                    fw={700}
                    fz={24}
                    h={78}
                    justify="center"
                    style={{
                        background: 'rgba(255,255,255,.18)',
                        border: '2px solid rgba(255,255,255,.5)',
                        borderRadius: '50%',
                        flexShrink: 0,
                    }}
                    w={78}
                    wrap="nowrap"
                >
                    {driver.code}
                </Group>
                <Box pr={130} style={{ zIndex: 1 }}>
                    <Box fw={700} fz={12} lts="1px" opacity={0.85}>
                        {`${driver.constructor.name} · ${carNumber}`}
                    </Box>
                    <Box
                        className="f1-display"
                        ff="var(--font-display)"
                        fw={700}
                        fz={30}
                        lts="-0.02em"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {driver.name}
                    </Box>
                    <Box fz={13} opacity={0.9}>
                        {`${driver.country} · Championship P${driver.position}`}
                    </Box>
                </Box>
            </Group>

            {/* Stat tiles */}
            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="POINTS" value={driver.points} />
                <MiniStat label="WINS" value={driver.wins} />
                <MiniStat label="PODIUMS" value={driver.podiums} />
                <MiniStat label="POLES" value={driver.poles} />
                <MiniStat label="STANDING" value={`P${driver.position}`} />
                <MiniStat label="CAR NO." value={carNumber} />
            </SimpleGrid>

            {/* Charts */}
            <SimpleGrid cols={2} spacing={16}>
                <Box className="f1-card" p={16}>
                    <Box fw={700} fz={15} mb={8}>Points Progression</Box>
                    <LineChart
                        data={progression}
                        dataKey="x"
                        h={200}
                        series={[{ color, name: driver.code }]}
                        xAxisProps={{ interval: 1 }}
                        yAxisProps={{ domain: [0, pointsMax], tickCount: 5 }}
                    />
                </Box>
                <Box className="f1-card" p={16}>
                    <Box fw={700} fz={15} mb={10}>Finishing Positions</Box>
                    <Group align="flex-end" gap={6} h={180} wrap="nowrap">
                        {driver.races.map(r => (
                            <Link
                                key={r.round}
                                params={{ driverId, round: String(r.round), year }}
                                style={{ color: 'inherit', flex: 1, height: '100%', textDecoration: 'none' }}
                                to="/seasons/$year/drivers/$driverId/races/$round"
                            >
                                <Stack
                                    align="center"
                                    gap={0}
                                    h="100%"
                                    justify="flex-end"
                                >
                                    <Text c="var(--neutral-700)" className="f1-num" fw={700} fz={10} inherit mb={3} span>{r.positionLabel}</Text>
                                    {r.position !== null && (
                                        <Box
                                            bg={finishColor(r.position, color)}
                                            h={`${Math.max(4, (100 - ((r.position - 1) / 19) * 100) * 0.9)}%`}
                                            maw={26}
                                            style={{ borderRadius: '4px 4px 0 0' }}
                                            w="100%"
                                        />
                                    )}
                                    <Text c="dimmed" fz={9.5} inherit mt={4} span>{`R${r.round}`}</Text>
                                </Stack>
                            </Link>
                        ))}
                    </Group>
                </Box>
            </SimpleGrid>

            <Box className="f1-card" p={0}>
                <Box fw={700} fz={15} px={18} py={15}>Race-by-Race Results</Box>
                <GridHeader columns={cols}>
                    <span>RND</span>
                    <span>GRAND PRIX</span>
                    <span style={{ textAlign: 'center' }}>GRID</span>
                    <span style={{ textAlign: 'center' }}>FINISH</span>
                    <span style={{ textAlign: 'center' }}>STATUS</span>
                    <span style={{ textAlign: 'right' }}>PTS</span>
                    {hasSprints && <span style={{ textAlign: 'right' }}>SPR</span>}
                </GridHeader>
                {driver.races.map((r) => {
                    const [status, statusColor] = raceStatus(r);

                    return (
                        <Link
                            className="f1-row"
                            key={r.round}
                            params={{ driverId, round: String(r.round), year }}
                            style={{
                                alignItems: 'center',
                                borderTop: '1px solid var(--mantine-color-default-border)',
                                color: 'inherit',
                                display: 'grid',
                                gridTemplateColumns: cols,
                                padding: '9px 18px',
                                textDecoration: 'none',
                            }}
                            to="/seasons/$year/drivers/$driverId/races/$round"
                        >
                            <Text c="dimmed" className="f1-num" fw={700} inherit span>{r.round}</Text>
                            <Text fw={600} fz={13} inherit span>{r.name}</Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{r.grid ?? '–'}</Text>
                            <Text className="f1-num f1-display" fw={700} inherit span ta="center">{r.positionLabel}</Text>
                            <Text c={statusColor} fw={700} fz={11} inherit span ta="center">{status}</Text>
                            <Text className="f1-num" fw={700} inherit span ta="right">{r.points > 0 ? r.points : '–'}</Text>
                            {hasSprints && (
                                <Text c="dimmed" className="f1-num" inherit span ta="right">
                                    {r.sprint ? `${formatPosition(r.sprint.positionLabel)} · ${r.sprint.points}` : '–'}
                                </Text>
                            )}
                        </Link>
                    );
                })}
            </Box>
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/drivers/$driverId/')({
    component: DriverSeason,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        let driver: DriverSeasonData;

        try {
            driver = await context.queryClient.ensureQueryData(driverSeasonQuery(year, params.driverId));
        } catch (error) {
            if (error instanceof HTTPError && error.response.status === 404) {
                throw notFound();
            }

            throw error;
        }

        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: driver.name },
            ],
        };
    },
});
