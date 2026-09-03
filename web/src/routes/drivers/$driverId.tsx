import type { CSSProperties } from 'react';

import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { CaretRightIcon, TrophyIcon } from '@phosphor-icons/react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { HTTPError } from 'ky';

import { CountryFlag } from '#/components/country-flag';
import { GOLD, GridHeader, MiniStat } from '#/components/f1-ui';
import { CURRENT_YEAR } from '#/data/fixtures';

import './driver-hero.css';
import { DriverSummarySchema } from '#/lib/api/drivers';
import { api } from '#/lib/query/api';

import {
    championshipPositionColor,
    driverSummaryColor,
    formatChampionshipPosition,
    formatDriverYears,
    isChampionshipWinner,
} from './-components/driver-summary';

const COLS = '84px 1fr 64px 60px 78px 60px 80px 24px';

const driverCareerQuery = (driverId: string) =>
    queryOptions({
        queryFn: () => api.get(`drivers/${driverId}`).json(DriverSummarySchema),
        queryKey: ['driver-summary', driverId],
    });

const DriverCareer = () => {
    const { driverId } = Route.useParams();
    const { data } = useSuspenseQuery(driverCareerQuery(driverId));
    const { seasons, ...driver } = data;
    const countryCode = driver.countryCode;

    return (
        <Stack gap={16}>
            <div
                className="driver-hero"
                style={{ '--driver-color': driverSummaryColor(driver) } as CSSProperties}
            >
                {countryCode ? <CountryFlag aria-hidden className="driver-hero-flag" code={countryCode} /> : null}
                <div className="driver-hero-content">
                    <div className="driver-hero-code">
                        {driver.code}
                    </div>
                    <div>
                        <Group gap={10} wrap="nowrap">
                            <Text className="f1-display" ff="var(--font-display)" fw={700} fz={30} inherit lts="-0.02em" span>
                                {driver.name}
                            </Text>
                            {driver.championships > 0
                                ? (
                                        <Group className="driver-hero-badge" gap={4} wrap="nowrap">
                                            <TrophyIcon size={13} weight="fill" />
                                            World Champion
                                        </Group>
                                    )
                                : null}
                        </Group>
                        <Box fz={13} mt={5} opacity={0.9}>
                            {`${driver.country} · ${formatDriverYears(driver)} · Career summary`}
                        </Box>
                    </div>
                </div>
            </div>

            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="SEASONS" value={seasons.length} />
                <MiniStat label="STARTS" value={driver.starts} />
                <MiniStat label="WINS" value={driver.wins} />
                <MiniStat label="POLES" value={driver.poles} />
                <MiniStat label="PODIUMS" value={driver.podiums} />
                <MiniStat label="TITLES" value={driver.championships} />
            </SimpleGrid>

            <Box className="f1-card" p={0}>
                <Group justify="space-between" px={20} py={15} wrap="nowrap">
                    <Text fw={700} fz={15} inherit span>Seasons</Text>
                    <Text c="dimmed" fz={12} inherit span>
                        Select a season to open its full dashboard
                    </Text>
                </Group>
                <GridHeader columns={COLS} px={20}>
                    <span>SEASON</span>
                    <span>CHAMPIONSHIP</span>
                    <span style={{ textAlign: 'center' }}>STARTS</span>
                    <span style={{ textAlign: 'center' }}>WINS</span>
                    <span style={{ textAlign: 'center' }}>PODIUMS</span>
                    <span style={{ textAlign: 'center' }}>POLES</span>
                    <span style={{ textAlign: 'right' }}>POINTS</span>
                    <span />
                </GridHeader>
                {seasons.map((s) => {
                    const isChampion = isChampionshipWinner(s.position);
                    return (
                        <Link
                            className="f1-row"
                            key={`${s.season}-${s.constructor.name}`}
                            params={{ year: String(Math.min(s.season, CURRENT_YEAR)) }}
                            style={{
                                alignItems: 'center',
                                background: isChampion ? 'color-mix(in srgb, var(--gold-500) 7%, transparent)' : undefined,
                                borderTop: '1px solid var(--mantine-color-default-border)',
                                color: 'inherit',
                                display: 'grid',
                                gridTemplateColumns: COLS,
                                padding: '11px 20px',
                                textDecoration: 'none',
                            }}
                            to="/seasons/$year"
                        >
                            <Text className="f1-num f1-display" fw={700} fz={16} inherit lts="-0.4px" span>{s.season}</Text>
                            <Group gap={9} wrap="nowrap">
                                <Text c={championshipPositionColor(s.position)} className="f1-num" fw={700} fz={13.5} inherit span>
                                    {formatChampionshipPosition(s.position)}
                                </Text>
                                {isChampion ? <TrophyIcon color={GOLD} size={12} weight="fill" /> : null}
                                <Text c="dimmed" fw={600} fz={12} inherit span>{s.constructor.name}</Text>
                            </Group>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{s.starts}</Text>
                            <Text className="f1-num f1-display" fw={700} inherit span ta="center">{s.wins}</Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{s.podiums}</Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{s.poles}</Text>
                            <Text className="f1-num f1-display" fw={700} inherit span ta="right">{s.points}</Text>
                            <CaretRightIcon color="var(--neutral-400)" size={14} />
                        </Link>
                    );
                })}
            </Box>
        </Stack>
    );
};

export const Route = createFileRoute('/drivers/$driverId')({
    component: DriverCareer,
    loader: async ({ context, params }) => {
        let name: string;

        try {
            ({ name } = await context.queryClient.ensureQueryData(
                driverCareerQuery(params.driverId),
            ));
        } catch (error) {
            if (error instanceof HTTPError && error.response.status === 404) {
                throw notFound();
            }

            throw error;
        }

        return {
            crumbs: [{ label: 'Drivers', to: '/drivers' }, { label: name }],
        };
    },
});
