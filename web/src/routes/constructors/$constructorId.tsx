import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { CaretRightIcon, TrophyIcon } from '@phosphor-icons/react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

import { CountryFlag } from '#/components/country-flag';
import { GOLD, GridHeader, MiniStat } from '#/components/f1-ui';
import '#/components/career-hero.css';
import { ConstructorSummarySchema } from '#/lib/api/constructors';
import { formatCareerYears, formatPosition } from '#/lib/format';
import { api } from '#/lib/query/api';
import { CURRENT_YEAR } from '#/lib/route-params';

import { countSeasons, splitDrivers } from './-components/constructor-summary';
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
    const navigate = useNavigate();

    return (
        <Stack gap={16}>
            <div className="career-hero" style={{ '--hero-color': team.color }}>
                <CountryFlag aria-hidden className="career-hero-flag" code={team.countryCode} />
                <div className="career-hero-content">
                    <div>
                        <Group gap={10} wrap="nowrap">
                            <Text className="f1-display" ff="var(--font-display)" fw={700} fz={30} inherit lts="-0.02em" span>
                                {team.name}
                            </Text>
                            {team.championships > 0
                                ? (
                                        <Group className="career-hero-badge" gap={4} wrap="nowrap">
                                            <TrophyIcon size={13} weight="fill" />
                                            Constructors' Champion
                                        </Group>
                                    )
                                : null}
                        </Group>
                        {team.fullName === team.name
                            ? null
                            : <div className="career-hero-full-name">{team.fullName}</div>}
                        <Box fz={13} mt={5} opacity={0.9}>
                            {`${team.country} · ${formatCareerYears(team)} · Career summary`}
                        </Box>
                    </div>
                </div>
            </div>

            <LineageStrip currentId={team.id} lineage={lineage} />

            <SimpleGrid cols={6} spacing={8}>
                <MiniStat label="SEASONS" value={countSeasons(seasons)} />
                <MiniStat label="STARTS" value={team.starts} />
                <MiniStat label="WINS" value={team.wins} />
                <MiniStat label="POLES" value={team.poles} />
                <MiniStat label="PODIUMS" value={team.podiums} />
                <MiniStat label="TITLES" value={team.championships} />
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
                    <span>POS</span>
                    <span>ENGINE</span>
                    <span>DRIVERS</span>
                    <span style={{ textAlign: 'center' }}>WINS</span>
                    <span style={{ textAlign: 'center' }}>PODIUMS</span>
                    <span style={{ textAlign: 'center' }}>POLES</span>
                    <span style={{ textAlign: 'right' }}>POINTS</span>
                    <span />
                </GridHeader>
                {seasons.map((s) => {
                    const { more, shown } = splitDrivers(s.drivers);
                    const position = s.position === '' ? '—' : formatPosition(s.position);
                    const year = String(Math.min(s.season, CURRENT_YEAR));
                    return (
                        <div
                            className="f1-row f1-grid-row"
                            key={`${s.season}-${s.engine}`}
                            onClick={() => void navigate({ params: { constructorId: team.id, year }, to: '/seasons/$year/constructors/$constructorId' })}
                            style={{
                                '--cols': COLS,
                                'background': s.isChampion ? 'color-mix(in srgb, var(--gold-500) 7%, transparent)' : undefined,
                                'cursor': 'pointer',
                                'padding': '11px 20px',
                            }}
                        >
                            <Link
                                onClick={event => event.stopPropagation()}
                                params={{ constructorId: team.id, year }}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                to="/seasons/$year/constructors/$constructorId"
                            >
                                <Text className="f1-num f1-display" fw={700} fz={16} inherit lts="-0.4px" span>{s.season}</Text>
                            </Link>
                            <Group gap={6} wrap="nowrap">
                                <Text c={s.isChampion ? GOLD : 'dimmed'} className="f1-num" fw={700} fz={13.5} inherit span>
                                    {position}
                                </Text>
                                {s.isChampion ? <TrophyIcon color={GOLD} size={12} weight="fill" /> : null}
                            </Group>
                            <Text c="dimmed" fw={600} fz={12} inherit span>{s.engine}</Text>
                            <Text fz={12.5} inherit lineClamp={1} span>
                                {shown.map((d, i) => (
                                    <span key={d.id}>
                                        {i > 0 ? ', ' : null}
                                        <Link
                                            onClick={event => event.stopPropagation()}
                                            params={{ driverId: d.id }}
                                            style={{ color: 'inherit' }}
                                            to="/drivers/$driverId"
                                        >
                                            {d.name}
                                        </Link>
                                    </span>
                                ))}
                                {more > 0 ? <Text c="dimmed" inherit span>{` +${more}`}</Text> : null}
                            </Text>
                            <Text className="f1-num f1-display" fw={700} inherit span ta="center">{s.wins}</Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{s.podiums}</Text>
                            <Text c="dimmed" className="f1-num" inherit span ta="center">{s.poles}</Text>
                            <Text className="f1-num f1-display" fw={700} inherit span ta="right">{s.points ?? '—'}</Text>
                            <CaretRightIcon color="var(--neutral-400)" size={14} />
                        </div>
                    );
                })}
            </Box>
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
