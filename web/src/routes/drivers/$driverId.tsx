import { Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { TrophyIcon } from '@phosphor-icons/react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { CareerHero } from '#/components/career-hero';
import { MiniStat } from '#/components/f1-ui';
import { SeasonRow, SeasonsCard } from '#/components/seasons-card';
import { DriverSummarySchema } from '#/lib/api/drivers';
import { formatCareerYears, formatPosition } from '#/lib/format';
import { api } from '#/lib/query/api';
import { CURRENT_YEAR } from '#/lib/route-params';

import { championshipPositionColor, driverSummaryColor } from './-components/driver-summary';

const SEASON_COLUMNS = '84px 1fr 64px 60px 78px 60px 80px 24px';

const driverCareerQuery = (driverId: string) =>
    queryOptions({
        queryFn: () => api.get(`drivers/${driverId}`).json(DriverSummarySchema),
        queryKey: ['driver-summary', driverId],
    });

const DriverCareer = () => {
    const { driverId } = Route.useParams();
    const { data: driver } = useSuspenseQuery(driverCareerQuery(driverId));

    return (
        <Stack gap={16}>
            <CareerHero
                badge={driver.championships > 0 ? 'World Champion' : undefined}
                color={driverSummaryColor(driver)}
                countryCode={driver.countryCode}
                mark={driver.code}
                subtitle={`${driver.country} · ${formatCareerYears(driver)} · Career summary`}
                title={driver.name}
            />

            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="SEASONS" value={driver.seasons.length} />
                <MiniStat label="STARTS" value={driver.starts} />
                <MiniStat label="WINS" value={driver.wins} />
                <MiniStat label="POLES" value={driver.poles} />
                <MiniStat label="PODIUMS" value={driver.podiums} />
                <MiniStat label="TITLES" value={driver.championships} />
            </SimpleGrid>

            <SeasonsCard
                columns={SEASON_COLUMNS}
                header={(
                    <>
                        <span>SEASON</span>
                        <span>CHAMPIONSHIP</span>
                        <span style={{ textAlign: 'center' }}>STARTS</span>
                        <span style={{ textAlign: 'center' }}>WINS</span>
                        <span style={{ textAlign: 'center' }}>PODIUMS</span>
                        <span style={{ textAlign: 'center' }}>POLES</span>
                        <span style={{ textAlign: 'right' }}>POINTS</span>
                    </>
                )}
            >
                {driver.seasons.map((season) => {
                    const isChampion = season.position === '1';

                    return (
                        <SeasonRow
                            columns={SEASON_COLUMNS}
                            isChampion={isChampion}
                            key={`${season.season}-${season.constructor.name}`}
                            params={{ year: String(Math.min(season.season, CURRENT_YEAR)) }}
                            season={season.season}
                            to="/seasons/$year"
                        >
                            <Group gap={9} wrap="nowrap">
                                <Text c={championshipPositionColor(season.position)} className="f1-num" fw={700} fz={13.5} inherit span>
                                    {formatPosition(season.position)}
                                </Text>
                                {isChampion ? <TrophyIcon color="var(--gold-500)" size={12} weight="fill" /> : null}
                                <Text c="dimmed" fw={600} fz={12} inherit span>{season.constructor.name}</Text>
                            </Group>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{season.starts}</Text>
                            <Text className="f1-num f1-display" fw={700} inherit span ta="center">{season.wins}</Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{season.podiums}</Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{season.poles}</Text>
                            <Text className="f1-num f1-display" fw={700} inherit span ta="right">{season.points}</Text>
                        </SeasonRow>
                    );
                })}
            </SeasonsCard>
        </Stack>
    );
};

export const Route = createFileRoute('/drivers/$driverId')({
    component: DriverCareer,
    loader: async ({ context, params }) => {
        const summary = await context.queryClient.ensureQueryData(driverCareerQuery(params.driverId));

        return {
            crumbs: [{ label: 'Drivers', to: '/drivers' }, { label: summary.name }],
        };
    },
});
