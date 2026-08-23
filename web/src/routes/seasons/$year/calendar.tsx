import { Box, Group, Stack, Text } from '@mantine/core';
import { CaretRightIcon } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { getSeasonDriver, TOTAL_ROUNDS } from '#/data/fixtures';
import { calendarQuery } from '#/data/queries';
import { parseYear } from '#/lib/route-params';

const Calendar = () => {
    const { year } = Route.useParams();
    const { data } = useSuspenseQuery(calendarQuery(Number(year)));

    return (
        <Stack gap={16}>
            <div>
                <h1 className="f1-page-title">{`${year} Race Calendar`}</h1>
                <div className="f1-page-description">
                    {`${data.completed} of ${TOTAL_ROUNDS} rounds completed`}
                </div>
            </div>

            <Stack gap={9}>
                {data.calendar.map((r) => {
                    const isDone = r.round <= data.completed;
                    const isNext = r.round === data.completed + 1;
                    const winner = r.winner ? getSeasonDriver(r.winner) : null;
                    const row = (
                        <Box
                            className={`f1-card${isDone ? ' f1-row' : ''}`}
                            key={r.round}
                            p={0}
                            style={{ overflow: 'hidden' }}
                        >
                            <Group gap={18} px={20} py={14} wrap="nowrap">
                                <Text c="var(--mantine-color-default-border)" className="f1-num f1-display" fw={700} fz={20} inherit span w={42}>
                                    {r.round}
                                </Text>
                                <Group
                                    bg="var(--color-accent)"
                                    c="var(--mantine-color-text)"
                                    fw={700}
                                    fz={13}
                                    h={40}
                                    justify="center"
                                    style={{ borderRadius: 6 }}
                                    w={54}
                                    wrap="nowrap"
                                >
                                    {r.code}
                                </Group>
                                <Box flex={1} miw={0}>
                                    <Box fw={700} fz={15}>{r.name}</Box>
                                    <Box c="dimmed" fz={12}>{r.circuit}</Box>
                                </Box>
                                <Text c="dimmed" fz={12.5} inherit span w={120}>{r.date}</Text>
                                <Group gap={9} w={200} wrap="nowrap">
                                    {isDone && winner
                                        ? (
                                                <>
                                                    <Text c="dimmed" fw={600} fz={11} inherit span>WINNER</Text>
                                                    <Box bg={winner.color} h={20} style={{ borderRadius: 2, flexShrink: 0 }} w={4} />
                                                    <Text fw={600} fz={13} inherit span>{winner.short}</Text>
                                                </>
                                            )
                                        : (
                                                <Text
                                                    c={isNext ? 'var(--mantine-primary-color-filled)' : 'dimmed'}
                                                    fw={700}
                                                    fz={12}
                                                    inherit
                                                    span
                                                >
                                                    {isNext ? 'UP NEXT' : 'Scheduled'}
                                                </Text>
                                            )}
                                </Group>
                                <CaretRightIcon color="var(--neutral-300)" size={15} />
                            </Group>
                        </Box>
                    );
                    if (isDone) {
                        return (
                            <Link
                                key={r.round}
                                params={{ round: String(r.round), year }}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                to="/seasons/$year/races/$round"
                            >
                                {row}
                            </Link>
                        );
                    }

                    return row;
                })}
            </Stack>
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/calendar')({
    component: Calendar,
    loader: async ({ context, params }) => {
        await context.queryClient.ensureQueryData(calendarQuery(parseYear(params.year)));
        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: 'Calendar' },
            ],
        };
    },
});
