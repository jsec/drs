import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';

import { GridHeader, MiniStat } from '#/components/f1-ui';
import { LineChart, toChartData, toChartSeries } from '#/components/line-chart';
import { getSeasonDriver } from '#/data/fixtures';
import { driverSeasonQuery } from '#/data/queries';
import { parseYear } from '#/lib/route-params';

const COLS = '44px 1fr 70px 70px 70px 60px';

const DriverSeason = () => {
    const { driverId, year } = Route.useParams();
    const { data } = useSuspenseQuery(driverSeasonQuery(Number(year), driverId));
    const { driver, pos } = data;
    const progressionLines = [{ code: driver.code, color: driver.color, values: data.progression }];

    return (
        <Stack gap={16}>
            <Group
                gap={24}
                pos="relative"
                px={28}
                py={24}
                style={{
                    background: `linear-gradient(110deg, ${driver.color}, ${driver.colorDark})`,
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
                    {driver.number}
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
                        {`${driver.teamName} · #${driver.number}`}
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
                        {`${driver.country} · Championship P${pos}`}
                    </Box>
                </Box>
            </Group>

            {/* Stat tiles */}
            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="POINTS" value={driver.points} />
                <MiniStat label="WINS" value={driver.wins} />
                <MiniStat label="PODIUMS" value={driver.podiums} />
                <MiniStat label="POLES" value={driver.poles} />
                <MiniStat label="STANDING" value={`P${pos}`} />
                <MiniStat label="CAR NO." value={`#${driver.number}`} />
            </SimpleGrid>

            {/* Charts */}
            <SimpleGrid cols={2} spacing={16}>
                <Box className="f1-card" p={16}>
                    <Box fw={700} fz={15} mb={8}>Points Progression</Box>
                    <LineChart
                        data={toChartData(progressionLines, i => `R${i}`)}
                        dataKey="x"
                        h={200}
                        series={toChartSeries(progressionLines)}
                        xAxisProps={{ interval: 1 }}
                        yAxisProps={{ domain: [0, data.pointsMax], tickCount: 5 }}
                    />
                </Box>
                <Box className="f1-card" p={16}>
                    <Box fw={700} fz={15} mb={10}>Finishing Positions</Box>
                    <Group align="flex-end" gap={6} h={180} wrap="nowrap">
                        {data.finishes.map(f => (
                            <Stack
                                align="center"
                                gap={0}
                                h="100%"
                                justify="flex-end"
                                key={f.round}
                                style={{ flex: 1 }}
                            >
                                <Text c="var(--neutral-700)" className="f1-num" fw={700} fz={10} inherit mb={3} span>{f.pos}</Text>
                                <Box
                                    bg={f.color}
                                    h={`${(100 - ((f.pos - 1) / 19) * 100) * 0.9}%`}
                                    maw={26}
                                    style={{ borderRadius: '4px 4px 0 0' }}
                                    w="100%"
                                />
                                <Text c="dimmed" fz={9.5} inherit mt={4} span>{f.round}</Text>
                            </Stack>
                        ))}
                    </Group>
                </Box>
            </SimpleGrid>

            <Box className="f1-card" p={0}>
                <Box fw={700} fz={15} px={18} py={15}>Race-by-Race Results</Box>
                <GridHeader columns={COLS}>
                    <span>RND</span>
                    <span>GRAND PRIX</span>
                    <span style={{ textAlign: 'center' }}>GRID</span>
                    <span style={{ textAlign: 'center' }}>FINISH</span>
                    <span style={{ textAlign: 'center' }}>STATUS</span>
                    <span style={{ textAlign: 'right' }}>PTS</span>
                </GridHeader>
                {data.races.map(r => (
                    <Link
                        className="f1-row"
                        key={r.round}
                        params={{ round: String(r.round), year }}
                        style={{
                            alignItems: 'center',
                            borderTop: '1px solid var(--mantine-color-default-border)',
                            color: 'inherit',
                            display: 'grid',
                            gridTemplateColumns: COLS,
                            padding: '9px 18px',
                            textDecoration: 'none',
                        }}
                        to="/seasons/$year/races/$round"
                    >
                        <Text c="dimmed" className="f1-num" fw={700} inherit span>{r.round}</Text>
                        <Text fw={600} fz={13} inherit span>{r.gp}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{r.grid}</Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="center">{r.finish}</Text>
                        <Text c={r.statusColor} fw={700} fz={11} inherit span ta="center">{r.status}</Text>
                        <Text className="f1-num" fw={700} inherit span ta="right">{r.pts > 0 ? r.pts : '–'}</Text>
                    </Link>
                ))}
            </Box>
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/drivers/$driverId')({
    component: DriverSeason,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        if (!getSeasonDriver(params.driverId)) {
            throw notFound();
        }
        const detail = await context.queryClient.ensureQueryData(
            driverSeasonQuery(year, params.driverId),
        );
        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: detail.driver.name },
            ],
        };
    },
});
