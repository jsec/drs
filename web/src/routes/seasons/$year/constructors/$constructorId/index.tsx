import { Box, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import type { ConstructorSeasonResult } from '#/lib/api/constructors';

import { CareerHero } from '#/components/career-hero';
import { GridHeader, MiniStat, PointsProgressionCard, SectionCard } from '#/components/f1-ui';
import { constructorSeasonQuery } from '#/data/queries';
import { formatPosition, isNumericPosition } from '#/lib/format';
import { parseYear } from '#/lib/route-params';

import { groupRounds } from './-components/rounds';

const DRIVER_COLUMNS = '56px 1fr 70px 70px 70px 70px';
const RESULT_COLUMNS = '56px 64px';
const SPRINT_RESULT_COLUMNS = `${RESULT_COLUMNS} 72px`;
const ROUND_COLUMNS = '44px 1fr 128px 60px';
const SPRINT_ROUND_COLUMNS = '44px 1fr 200px 60px';

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
    const hasSprints = team.results.some(result => result.sprint !== null);
    const resultColumns = hasSprints ? SPRINT_RESULT_COLUMNS : RESULT_COLUMNS;
    const roundColumns = hasSprints ? SPRINT_ROUND_COLUMNS : ROUND_COLUMNS;
    const engines = team.entries.length > 1
        ? team.entries.map(entry => `${entry.engine} ${formatPosition(entry.position)}`).join(' · ')
        : team.entries[0]?.engine;

    return (
        <Stack gap={16}>
            <CareerHero
                badge={team.isChampion ? 'Constructors\' Champion' : undefined}
                color={team.color}
                countryCode={team.countryCode}
                subtitle={`${year} · ${engines}`}
                title={(
                    <Link
                        className="f1-plain-link"
                        params={{ constructorId }}
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

            <SectionCard isPadded={false} title="Drivers">
                <GridHeader columns={DRIVER_COLUMNS}>
                    <span />
                    <span>DRIVER</span>
                    <span style={{ textAlign: 'center' }}>STARTS</span>
                    <span style={{ textAlign: 'center' }}>WINS</span>
                    <span style={{ textAlign: 'center' }}>PODIUMS</span>
                    <span style={{ textAlign: 'right' }}>PTS</span>
                </GridHeader>
                {team.drivers.map(driver => (
                    <Link
                        className="f1-row f1-grid-row"
                        key={driver.id}
                        params={{ driverId: driver.id, year }}
                        style={{ '--cols': DRIVER_COLUMNS }}
                        to="/seasons/$year/drivers/$driverId"
                    >
                        <Text c="dimmed" fw={700} fz={12} inherit span>{driver.code}</Text>
                        <Text fw={600} fz={13} inherit span>{driver.name}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{driver.starts}</Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="center">{driver.wins}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{driver.podiums}</Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="right">{driver.points}</Text>
                    </Link>
                ))}
            </SectionCard>

            <PointsProgressionCard color={team.color} name={team.name} progression={team.progression} />

            <SectionCard isPadded={false} title="Race-by-Race Results">
                <GridHeader columns={roundColumns}>
                    <span>RND</span>
                    <span>GRAND PRIX</span>
                    <Box display="grid" style={{ gridTemplateColumns: resultColumns }}>
                        <span>DRIVER</span>
                        <span>FINISH</span>
                        {hasSprints && <span>SPRINT</span>}
                    </Box>
                    <span style={{ textAlign: 'right' }}>PTS</span>
                </GridHeader>
                {rounds.map(round => (
                    <div className="f1-row f1-grid-row" key={round.round} style={{ '--cols': roundColumns }}>
                        <Text c="dimmed" className="f1-num" fw={700} inherit span>{round.round}</Text>
                        <Text fw={600} fz={14} inherit lineClamp={1} span>{round.raceName}</Text>
                        <Stack gap={4}>
                            {round.results.map((result) => {
                                const [label, color] = finish(result);

                                return (
                                    <Link
                                        className="f1-plain-link"
                                        key={result.finishOrder}
                                        params={{
                                            driverId: result.driverId,
                                            round: String(round.round),
                                            year,
                                        }}
                                        style={{ display: 'grid', gridTemplateColumns: resultColumns }}
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
                        <Text className="f1-num f1-display" fw={700} inherit span ta="right">{round.points > 0 ? round.points : '–'}</Text>
                    </div>
                ))}
            </SectionCard>
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
