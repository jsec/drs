import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { TrophyIcon } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import type { ConstructorSeasonResult } from '#/lib/api/constructors';

import { CountryFlag } from '#/components/country-flag';
import { GridHeader, MiniStat } from '#/components/f1-ui';
import '#/components/career-hero.css';
import { LineChart } from '#/components/line-chart';
import { constructorSeasonQuery } from '#/data/queries';
import { formatPosition, isNumericPosition } from '#/lib/format';
import { parseYear } from '#/lib/route-params';

import { groupRounds } from './-components/rounds';

const DRIVER_COLS = '56px 1fr 70px 70px 70px 70px';
const ROUND_COLS = '44px 220px 1fr 60px';

function finishLabel(result: ConstructorSeasonResult): string {
    if (result.statusCategory !== 'finished' && isNumericPosition(result.positionLabel)) {
        return 'DNF';
    }

    return formatPosition(result.positionLabel);
}

const ConstructorSeason = () => {
    const { constructorId, year } = Route.useParams();
    const { data: team } = useSuspenseQuery(constructorSeasonQuery(Number(year), constructorId));
    const rounds = groupRounds(team.results);
    const engines = team.entries.length > 1
        ? team.entries.map(e => `${e.engine} ${formatPosition(e.position)}`).join(' · ')
        : team.entries[0]?.engine;
    const pointsMax = Math.max(50, Math.ceil((team.points ?? 0) / 50) * 50);
    const progression = [
        { [team.name]: 0, x: 'R0' },
        ...team.progression.map(p => ({ [team.name]: p.points, x: `R${p.round}` })),
    ];

    return (
        <Stack gap={16}>
            <div className="career-hero" style={{ '--hero-color': team.color }}>
                <CountryFlag aria-hidden className="career-hero-flag" code={team.countryCode} />
                <div className="career-hero-content">
                    <div>
                        <Group gap={10} wrap="nowrap">
                            <Link
                                params={{ constructorId }}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                to="/constructors/$constructorId"
                            >
                                <Text className="f1-display" ff="var(--font-display)" fw={700} fz={30} inherit lts="-0.02em" span>
                                    {team.name}
                                </Text>
                            </Link>
                            {team.isChampion
                                ? (
                                        <Group className="career-hero-badge" gap={4} wrap="nowrap">
                                            <TrophyIcon size={13} weight="fill" />
                                            Constructors' Champion
                                        </Group>
                                    )
                                : null}
                        </Group>
                        <Box fz={13} mt={5} opacity={0.9}>
                            {`${year} · ${engines}`}
                        </Box>
                    </div>
                </div>
            </div>

            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="POINTS" value={team.points ?? '—'} />
                <MiniStat label="STANDING" value={team.position === '' ? '—' : formatPosition(team.position)} />
                <MiniStat label="WINS" value={team.wins} />
                <MiniStat label="PODIUMS" value={team.podiums} />
                <MiniStat label="POLES" value={team.poles} />
                <MiniStat label="DNFS" value={team.dnfs} />
            </SimpleGrid>

            <Box className="f1-card" p={0}>
                <Box fw={700} fz={15} px={18} py={15}>Drivers</Box>
                <GridHeader columns={DRIVER_COLS}>
                    <span />
                    <span>DRIVER</span>
                    <span style={{ textAlign: 'center' }}>STARTS</span>
                    <span style={{ textAlign: 'center' }}>WINS</span>
                    <span style={{ textAlign: 'center' }}>PODIUMS</span>
                    <span style={{ textAlign: 'right' }}>PTS</span>
                </GridHeader>
                {team.drivers.map(d => (
                    <Link
                        className="f1-row f1-grid-row"
                        key={d.id}
                        params={{ driverId: d.id, year }}
                        style={{ '--cols': DRIVER_COLS }}
                        to="/seasons/$year/drivers/$driverId"
                    >
                        <Text c="dimmed" fw={700} fz={12} inherit span>{d.code}</Text>
                        <Text fw={600} fz={13} inherit span>{d.name}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{d.starts}</Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="center">{d.wins}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{d.podiums}</Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="right">{d.points}</Text>
                    </Link>
                ))}
            </Box>

            <Box className="f1-card" p={16}>
                <Box fw={700} fz={15} mb={8}>Points Progression</Box>
                {team.progression.length > 0
                    ? (
                            <LineChart
                                data={progression}
                                dataKey="x"
                                h={200}
                                series={[{ color: team.color, name: team.name }]}
                                xAxisProps={{ interval: 1 }}
                                yAxisProps={{ domain: [0, pointsMax], tickCount: 5 }}
                            />
                        )
                    : <Text c="dimmed" fz={13}>No constructors' championship standings this season.</Text>}
            </Box>

            <Box className="f1-card" p={0}>
                <Box fw={700} fz={15} px={18} py={15}>Race-by-Race Results</Box>
                <GridHeader columns={ROUND_COLS}>
                    <span>RND</span>
                    <span>GRAND PRIX</span>
                    <span>DRIVERS</span>
                    <span style={{ textAlign: 'right' }}>PTS</span>
                </GridHeader>
                {rounds.map(r => (
                    <div className="f1-row f1-grid-row" key={r.round} style={{ '--cols': ROUND_COLS }}>
                        <Text c="dimmed" className="f1-num" fw={700} inherit span>{r.round}</Text>
                        <Text fw={600} fz={13} inherit span>{r.raceName}</Text>
                        <Group gap={6}>
                            {r.results.map(result => (
                                <Link
                                    key={`${result.driverId}-${result.positionLabel}`}
                                    params={{ driverId: result.driverId, round: String(r.round), year }}
                                    style={{
                                        border: '1px solid var(--mantine-color-default-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'inherit',
                                        fontSize: 12,
                                        padding: '2px 8px',
                                        textDecoration: 'none',
                                    }}
                                    to="/seasons/$year/drivers/$driverId/races/$round"
                                >
                                    <Text c="dimmed" fw={700} inherit span>{result.driverCode}</Text>
                                    {` ${finishLabel(result)}`}
                                    {result.sprint ? <Text c="dimmed" inherit span>{` · S ${formatPosition(result.sprint.positionLabel)}`}</Text> : null}
                                </Link>
                            ))}
                        </Group>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="right">{r.points > 0 ? r.points : '–'}</Text>
                    </div>
                ))}
            </Box>
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/constructors/$constructorId/')({
    component: ConstructorSeason,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        const team = await context.queryClient.ensureQueryData(constructorSeasonQuery(year, params.constructorId));

        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: team.name },
            ],
        };
    },
});
