import { Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { TrophyIcon } from '@phosphor-icons/react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { CareerHero } from '#/components/career-hero';
import { GOLD, MiniStat } from '#/components/f1-ui';
import { SeasonRow, SeasonsCard } from '#/components/seasons-card';
import { ConstructorSummarySchema } from '#/lib/api/constructors';
import { formatCareerYears, formatPosition } from '#/lib/format';
import { api } from '#/lib/query/api';
import { CURRENT_YEAR } from '#/lib/route-params';

import { countSeasons } from './-components/constructor-summary';
import { LineageStrip } from './-components/lineage-strip';

const COLS = '84px 64px 110px 1fr 60px 78px 60px 80px 24px';

const constructorCareerQuery = (constructorId: string) =>
    queryOptions({
        queryFn: () => api.get(`constructors/${constructorId}`).json(ConstructorSummarySchema),
        queryKey: ['constructor-summary', constructorId],
    });

const ConstructorCareer = () => {
    const { constructorId } = Route.useParams();
    const { data } = useSuspenseQuery(constructorCareerQuery(constructorId));
    const { lineage, seasons, ...team } = data;

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

            <LineageStrip currentId={team.id} lineage={lineage} />

            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="SEASONS" value={countSeasons(seasons)} />
                <MiniStat label="STARTS" value={team.starts} />
                <MiniStat label="WINS" value={team.wins} />
                <MiniStat label="POLES" value={team.poles} />
                <MiniStat label="PODIUMS" value={team.podiums} />
                <MiniStat label="TITLES" value={team.championships} />
            </SimpleGrid>

            <SeasonsCard
                columns={COLS}
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
                {seasons.map(s => (
                    <SeasonRow
                        columns={COLS}
                        isChampion={s.isChampion}
                        key={`${s.season}-${s.engine}`}
                        params={{ constructorId: team.id, year: String(Math.min(s.season, CURRENT_YEAR)) }}
                        season={<Text className="f1-num f1-display" fw={700} fz={16} inherit lts="-0.4px" span>{s.season}</Text>}
                        to="/seasons/$year/constructors/$constructorId"
                    >
                        <Group gap={6} wrap="nowrap">
                            <Text c={s.isChampion ? GOLD : 'dimmed'} className="f1-num" fw={700} fz={13.5} inherit span>
                                {formatPosition(s.position)}
                            </Text>
                            {s.isChampion ? <TrophyIcon color={GOLD} size={12} weight="fill" /> : null}
                        </Group>
                        <Text c="dimmed" fw={600} fz={12} inherit span>{s.engine}</Text>
                        <Text fz={12.5} inherit lineClamp={1} span>
                            {s.drivers.slice(0, 3).map((d, i) => (
                                <span key={d.id}>
                                    {i > 0 && ', '}
                                    <Link params={{ driverId: d.id }} style={{ color: 'inherit' }} to="/drivers/$driverId">
                                        {d.name}
                                    </Link>
                                </span>
                            ))}
                            {s.drivers.length > 3 ? <Text c="dimmed" inherit span>{` +${s.drivers.length - 3}`}</Text> : null}
                        </Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="center">{s.wins}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{s.podiums}</Text>
                        <Text c="dimmed" className="f1-num" inherit span ta="center">{s.poles}</Text>
                        <Text className="f1-num f1-display" fw={700} inherit span ta="right">{s.points ?? '—'}</Text>
                    </SeasonRow>
                ))}
            </SeasonsCard>
        </Stack>
    );
};

export const Route = createFileRoute('/constructors/$constructorId')({
    component: ConstructorCareer,
    loader: async ({ context, params }) => {
        const { name } = await context.queryClient.ensureQueryData(constructorCareerQuery(params.constructorId));

        return {
            crumbs: [{ label: 'Constructors', to: '/constructors' }, { label: name }],
        };
    },
});
