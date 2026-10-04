import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { CareerHero } from '#/components/career-hero';
import { GridHeader, MiniStat } from '#/components/f1-ui';
import { CircuitSummarySchema } from '#/lib/api/circuits';
import { api } from '#/lib/query/api';

import { CircuitLayout } from './-components/circuit-layout';

const RACE_COLS = '110px 1fr 200px';

const circuitSummaryQuery = (circuitId: string) =>
    queryOptions({
        queryFn: () => api.get(`circuits/${circuitId}`).json(CircuitSummarySchema),
        queryKey: ['circuit-summary', circuitId],
    });

const year = (date: null | string) => date?.slice(0, 4) ?? '—';

const CircuitDetail = () => {
    const { circuitId } = Route.useParams();
    const { data } = useSuspenseQuery(circuitSummaryQuery(circuitId));

    const years = `${year(data.firstRace.date)}-${year(data.lastRace.date)}`;

    return (
        <Stack gap={16}>
            <CareerHero
                color="var(--mantine-primary-color-filled)"
                countryCode={data.countryCode}
                mark={<CircuitLayout layoutId={data.layoutId} name={data.name} size={46} />}
                subtitle={`${data.country} · ${years} · Circuit summary`}
                title={data.name}
            />

            <SimpleGrid cols={4} spacing={8}>
                <MiniStat label="GRANDS PRIX" value={data.raceCount} />
                <MiniStat label="TURNS" value={data.turns} />
                <MiniStat label="FIRST RACE" value={year(data.firstRace.date)} />
                <MiniStat label="LAST RACE" value={year(data.lastRace.date)} />
            </SimpleGrid>

            <Box className="f1-card" p={0}>
                <Group justify="space-between" px={20} py={15} wrap="nowrap">
                    <Text fw={700} fz={15} inherit span>Races</Text>
                    <Text c="dimmed" fz={12} inherit span>
                        Every Grand Prix held at this circuit
                    </Text>
                </Group>
                <GridHeader columns={RACE_COLS} px={20}>
                    <span>DATE</span>
                    <span>GRAND PRIX</span>
                    <span>WINNER</span>
                </GridHeader>
                {data.races.map(race => (
                    <Box
                        className="f1-grid-row"
                        key={race.raceId}
                        px={20}
                        py={11}
                        style={{ '--cols': RACE_COLS }}
                    >
                        <Text c="dimmed" className="f1-num" fz={12.5} inherit span>
                            {race.date ?? '—'}
                        </Text>
                        <Text fw={600} fz={13.5} inherit span>{race.name}</Text>
                        <Text c="dimmed" fz={12.5} inherit span>
                            {race.winnerName}
                        </Text>
                    </Box>
                ))}
            </Box>

            <Box c="dimmed" fz={11.5}>
                Circuit layouts from
                {' '}
                <a
                    href="https://github.com/f1db/f1db"
                    rel="noreferrer"
                    style={{ color: 'inherit' }}
                    target="_blank"
                >
                    f1db
                </a>
                , licensed under CC BY 4.0.
            </Box>
        </Stack>
    );
};

export const Route = createFileRoute('/circuits/$circuitId')({
    component: CircuitDetail,
    loader: async ({ context, params }) => {
        const summary = await context.queryClient.ensureQueryData(
            circuitSummaryQuery(params.circuitId),
        );
        return {
            crumbs: [{ label: 'Circuits', to: '/circuits' }, { label: summary.name }],
        };
    },
});
