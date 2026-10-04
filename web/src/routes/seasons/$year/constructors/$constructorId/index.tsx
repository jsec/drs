import { LineChart } from '@mantine/charts';
import { Box, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import type { ConstructorSeasonResult } from '#/lib/api/constructors';

import { CareerHero } from '#/components/career-hero';
import { GridHeader, MiniStat } from '#/components/f1-ui';
import { constructorSeasonQuery } from '#/data/queries';
import { formatPosition, isNumericPosition } from '#/lib/format';
import { parseYear } from '#/lib/route-params';

import { groupRounds } from './-components/rounds';

const DRIVER_COLS = '56px 1fr 70px 70px 70px 70px';
const RESULT_COLS = '56px 64px';
const SPRINT_RESULT_COLS = `${RESULT_COLS} 72px`;

function finish(result: ConstructorSeasonResult): [label: string, color: string] {
    if (result.statusCategory !== 'finished' && isNumericPosition(result.positionLabel)) {
        return ['DNF', 'var(--mantine-primary-color-filled)'];
    }

    if (result.positionLabel === '1') {
        return ['P1', 'var(--gold-500)'];
    }

    if (result.positionLabel === '2' || result.positionLabel === '3') {
        return [formatPosition(result.positionLabel), 'var(--silver-500)'];
    }

    if (result.points > 0) {
        return [formatPosition(result.positionLabel), 'var(--green-500)'];
    }

    return [formatPosition(result.positionLabel), 'inherit'];
}

const ConstructorSeason = () => {
    const { constructorId, year } = Route.useParams();
    const { data: team } = useSuspenseQuery(constructorSeasonQuery(Number(year), constructorId));
    const rounds = groupRounds(team.results);
    const hasSprints = team.results.some(r => r.sprint !== null);
    const resultCols = hasSprints ? SPRINT_RESULT_COLS : RESULT_COLS;
    const roundCols = `44px 1fr ${hasSprints ? 200 : 128}px 60px`;
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
            <CareerHero
                badge={team.isChampion ? 'Constructors\' Champion' : undefined}
                color={team.color}
                countryCode={team.countryCode}
                subtitle={`${year} · ${engines}`}
                title={(
                    <Link
                        params={{ constructorId }}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        to="/constructors/$constructorId"
                    >
                        {team.name}
                    </Link>
                )}
            />

            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="POINTS" value={team.points ?? '—'} />
                <MiniStat label="STANDING" value={formatPosition(team.position)} />
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
                <GridHeader columns={roundCols}>
                    <span>RND</span>
                    <span>GRAND PRIX</span>
                    <Box display="grid" style={{ gridTemplateColumns: resultCols }}>
                        <span>DRIVER</span>
                        <span>FINISH</span>
                        {hasSprints && <span>SPRINT</span>}
                    </Box>
                    <span style={{ textAlign: 'right' }}>PTS</span>
                </GridHeader>
                {rounds.map(r => (
                    <div className="f1-row f1-grid-row" key={r.round} style={{ '--cols': roundCols }}>
                        <Text c="dimmed" className="f1-num" fw={700} inherit span>{r.round}</Text>
                        <Text fw={600} fz={14} inherit lineClamp={1} span>{r.raceName}</Text>
                        <Stack gap={4}>
                            {r.results.map((result) => {
                                const [label, color] = finish(result);

                                return (
                                    <Link
                                        key={result.finishOrder}
                                        params={{ driverId: result.driverId, round: String(r.round), year }}
                                        style={{ color: 'inherit', display: 'grid', gridTemplateColumns: resultCols, textDecoration: 'none' }}
                                        to="/seasons/$year/drivers/$driverId/races/$round"
                                    >
                                        <Text c="dimmed" fw={700} fz={12} inherit span>{result.driverCode}</Text>
                                        <Text c={color} className="f1-num" fw={700} fz={13} inherit span>{label}</Text>
                                        {hasSprints && (
                                            <Text c="dimmed" className="f1-num" fz={13} inherit span>
                                                {result.sprint ? formatPosition(result.sprint.positionLabel) : '–'}
                                            </Text>
                                        )}
                                    </Link>
                                );
                            })}
                        </Stack>
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
