import { Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { TrophyIcon } from '@phosphor-icons/react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { uniq } from 'es-toolkit';

import { CareerHero } from '#/components/career-hero';
import { MiniStat } from '#/components/f1-ui';
import { SeasonRow, SeasonsCard } from '#/components/seasons-card';
import { ConstructorSummarySchema } from '#/lib/api/constructors';
import { formatCareerYears, formatPosition } from '#/lib/format';
import { api } from '#/lib/query/api';
import { CURRENT_YEAR } from '#/lib/route-params';

import { LineageStrip } from './-components/lineage-strip';

const SEASON_COLUMNS = '84px 64px 110px 1fr 60px 78px 60px 80px 24px';
const MAX_LISTED_DRIVERS = 3;

const constructorCareerQuery = (constructorId: string) =>
    queryOptions({
        queryFn: () => api.get(`constructors/${constructorId}`).json(ConstructorSummarySchema),
        queryKey: ['constructor-summary', constructorId],
    });

const ConstructorCareer = () => {
    const { constructorId } = Route.useParams();
    const { data: team } = useSuspenseQuery(constructorCareerQuery(constructorId));

    return (
        <Stack gap={16}>
            <CareerHero
                badge={team.championships > 0 ? 'Constructors\' Champion' : undefined}
                color={team.color}
                countryCode={team.countryCode}
                fullName={team.fullName === team.name ? undefined : team.fullName}
                subtitle={`${team.country} · ${formatCareerYears(team)} · Career summary`}
                title={team.name}
            />

            <LineageStrip currentId={team.id} lineage={team.lineage} />

            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="SEASONS" value={uniq(team.seasons.map(seasonResult => seasonResult.season)).length} />
                <MiniStat label="STARTS" value={team.starts} />
                <MiniStat label="WINS" value={team.wins} />
                <MiniStat label="POLES" value={team.poles} />
                <MiniStat label="PODIUMS" value={team.podiums} />
                <MiniStat label="TITLES" value={team.championships} />
            </SimpleGrid>

            <SeasonsCard
                columns={SEASON_COLUMNS}
                header={(
                    <>
                        <span>SEASON</span>
                        <span>POS</span>
                        <span>ENGINE</span>
                        <span>DRIVERS</span>
                        <span style={{ textAlign: 'center' }}>WINS</span>
                        <span style={{ textAlign: 'center' }}>PODIUMS</span>
                        <span style={{ textAlign: 'center' }}>POLES</span>
                        <span style={{ textAlign: 'right' }}>POINTS</span>
                    </>
                )}
            >
                {team.seasons.map(seasonResult => (
                    <SeasonRow
                        columns={SEASON_COLUMNS}
                        isChampion={seasonResult.isChampion}
                        key={`${seasonResult.season}-${seasonResult.engine}`}
                        params={{ constructorId: team.id, year: String(Math.min(seasonResult.season, CURRENT_YEAR)) }}
                        season={seasonResult.season}
                        to="/seasons/$year/constructors/$constructorId"
                    >
                        <Group gap={6} wrap="nowrap">
                            <Text c={seasonResult.isChampion ? 'var(--gold-500)' : 'dimmed'} className="f1-num" fw={700} fz={13.5} inherit span>
                                {formatPosition(seasonResult.position)}
                            </Text>
                            {seasonResult.isChampion ? <TrophyIcon color="var(--gold-500)" size={12} weight="fill" /> : null}
                        </Group>
                        <Text c="dimmed" fw={600} fz={12} inherit span>{seasonResult.engine}</Text>
                        <Text fz={12.5} inherit lineClamp={1} span>
                            {seasonResult.drivers.slice(0, MAX_LISTED_DRIVERS).map((driver, index) => (
                                <span key={driver.id}>
                                    {index > 0 && ', '}
                                    <Link params={{ driverId: driver.id }} style={{ color: 'inherit' }} to="/drivers/$driverId">
                                        {driver.name}
                                    </Link>
                                </span>
                            ))}
                            {seasonResult.drivers.length > MAX_LISTED_DRIVERS ? <Text c="dimmed" inherit span>{` +${seasonResult.drivers.length - MAX_LISTED_DRIVERS}`}</Text> : null}
                        </Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="center">{seasonResult.wins}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{seasonResult.podiums}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{seasonResult.poles}</Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="right">{seasonResult.points ?? '—'}</Text>
                    </SeasonRow>
                ))}
            </SeasonsCard>
        </Stack>
    );
};

export const Route = createFileRoute('/constructors/$constructorId')({
    component: ConstructorCareer,
    loader: async ({ context, params }) => {
        const summary = await context.queryClient.ensureQueryData(constructorCareerQuery(params.constructorId));

        return {
            crumbs: [{ label: 'Constructors', to: '/constructors' }, { label: summary.name }],
        };
    },
});
