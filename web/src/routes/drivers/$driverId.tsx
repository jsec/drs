import type { CSSProperties } from 'react';

import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { CaretRightIcon, TrophyIcon } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';

import { CountryFlag } from '#/components/country-flag';
import { GOLD, GridHeader, MiniStat } from '#/components/f1-ui';
import { CURRENT_YEAR, getAllTimeDriver } from '#/data/fixtures';
import { driverCareerQuery } from '#/data/queries';

import './driver-hero.css';

const COLS = '84px 1fr 64px 60px 78px 60px 80px 24px';

const getPositionColor = (pos: number): string => {
    if (pos === 1) return GOLD;
    if (pos <= 3) return 'var(--mantine-color-text)';
    return 'var(--mantine-color-dimmed)';
};

const DriverCareer = () => {
    const { driverId } = Route.useParams();
    const { data } = useSuspenseQuery(driverCareerQuery(driverId));
    const { driver, seasons } = data;
    const countryCode = driver.countryCode;

    return (
        <Stack gap={16}>
            <div
                className="driver-hero"
                style={{ '--driver-color': driver.color } as CSSProperties}
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
                            {driver.titles > 0
                                ? (
                                        <Group className="driver-hero-badge" gap={4} wrap="nowrap">
                                            <TrophyIcon size={13} weight="fill" />
                                            World Champion
                                        </Group>
                                    )
                                : null}
                        </Group>
                        <Box fz={13} mt={5} opacity={0.9}>
                            {`${driver.nat} · ${driver.years} · Career summary`}
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
                <MiniStat label="TITLES" value={driver.titles} />
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
                    const posColor = getPositionColor(s.pos);
                    return (
                        <Link
                            className="f1-row"
                            key={s.year}
                            params={{ year: String(Math.min(s.year, CURRENT_YEAR)) }}
                            style={{
                                alignItems: 'center',
                                background: s.champ ? 'color-mix(in srgb, var(--gold-500) 7%, transparent)' : undefined,
                                borderTop: '1px solid var(--mantine-color-default-border)',
                                color: 'inherit',
                                display: 'grid',
                                gridTemplateColumns: COLS,
                                padding: '11px 20px',
                                textDecoration: 'none',
                            }}
                            to="/seasons/$year"
                        >
                            <Text className="f1-num f1-display" fw={700} fz={16} inherit lts="-0.4px" span>{s.year}</Text>
                            <Group gap={9} wrap="nowrap">
                                <Text c={posColor} className="f1-num" fw={700} fz={13.5} inherit span>{s.posLabel}</Text>
                                {s.champ ? <TrophyIcon color={GOLD} size={12} weight="fill" /> : null}
                                {s.label ? <Text c="dimmed" fw={600} fz={12} inherit span>{s.label}</Text> : null}
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
        if (!getAllTimeDriver(params.driverId)) {
            throw notFound();
        }
        const { driver } = await context.queryClient.ensureQueryData(
            driverCareerQuery(params.driverId),
        );
        return {
            crumbs: [{ label: 'Drivers', to: '/drivers' }, { label: driver.name }],
        };
    },
});
