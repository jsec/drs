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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <h1 className="f1-page-title">{`${year} Race Calendar`}</h1>
                <div className="f1-page-description">
                    {`${data.completed} of ${TOTAL_ROUNDS} rounds completed`}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {data.calendar.map((r) => {
                    const isDone = r.round <= data.completed;
                    const isNext = r.round === data.completed + 1;
                    const winner = r.winner ? getSeasonDriver(r.winner) : null;
                    const row = (
                        <div
                            className={`f1-card${isDone ? ' f1-row' : ''}`}
                            key={r.round}
                            style={{ overflow: 'hidden', padding: 0 }}
                        >
                            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 18, padding: '14px 20px' }}>
                                <span className="f1-num f1-display" style={{ color: 'var(--mantine-color-default-border)', fontSize: 20, fontWeight: 700, width: 42 }}>
                                    {r.round}
                                </span>
                                <div style={{
                                    alignItems: 'center',
                                    background: 'var(--color-accent)',
                                    borderRadius: 6,
                                    color: 'var(--mantine-color-text)',
                                    display: 'flex',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    height: 40,
                                    justifyContent: 'center',
                                    width: 54,
                                }}
                                >
                                    {r.code}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                                    <div style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12 }}>{r.circuit}</div>
                                </div>
                                <span style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12.5, width: 120 }}>{r.date}</span>
                                <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 9, width: 200 }}>
                                    {isDone && winner
                                        ? (
                                                <>
                                                    <span style={{ color: 'var(--mantine-color-dimmed)', fontSize: 11, fontWeight: 600 }}>WINNER</span>
                                                    <div style={{ background: winner.color, borderRadius: 2, flexShrink: 0, height: 20, width: 4 }} />
                                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{winner.short}</span>
                                                </>
                                            )
                                        : (
                                                <span style={{ color: isNext ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-dimmed)', fontSize: 12, fontWeight: 700 }}>
                                                    {isNext ? 'UP NEXT' : 'Scheduled'}
                                                </span>
                                            )}
                                </div>
                                <CaretRightIcon color="var(--neutral-300)" size={15} />
                            </div>
                        </div>
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
            </div>
        </div>
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
