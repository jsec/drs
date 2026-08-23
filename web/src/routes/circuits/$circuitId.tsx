import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { CircuitSummaryResponse } from '#/lib/api/circuits.gen';

import { MiniStat, SectionCard } from '#/components/f1-ui';
import { api } from '#/lib/query/api';

import { CircuitLayout } from './-components/circuit-layout';

const RACE_COLS = '92px 1fr 200px';

type CircuitRace = CircuitSummaryResponse['races'][number] & { date: null | string };

type CircuitSummary = Omit<CircuitSummaryResponse, 'firstRace' | 'lastRace' | 'races'> & {
    firstRace: { date: null | string; name: string };
    lastRace: { date: null | string; name: string };
    races: CircuitRace[];
};

const circuitSummaryQuery = (circuitId: string) =>
    queryOptions({
        queryFn: () => api.get(`circuits/${circuitId}`).json<CircuitSummary>(),
        queryKey: ['circuit-summary', circuitId],
    });

const year = (date: null | string) => date?.slice(0, 4) ?? '—';

const CircuitDetail = () => {
    const { circuitId } = Route.useParams();
    const { data } = useSuspenseQuery(circuitSummaryQuery(circuitId));

    return (
        <div className="f1-page-stack">
            <div className="f1-page-header">
                <div>
                    <h1 className="f1-page-title">
                        {data.name}
                    </h1>
                    <div className="f1-page-description">
                        {`${data.country} · ${data.raceCount} Grands Prix`}
                    </div>
                </div>
            </div>

            <div className="f1-card" style={{ alignItems: 'center', display: 'flex', gap: 28, padding: 24 }}>
                <CircuitLayout layoutId={data.layoutId} name={data.name} />
                <div style={{ display: 'grid', flex: 1, gap: 12, gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <MiniStat label="Turns" value={data.turns} />
                    <MiniStat label="Grands Prix" value={data.raceCount} />
                    <MiniStat label="First race" value={year(data.firstRace.date)} />
                    <MiniStat label="Last race" value={year(data.lastRace.date)} />
                </div>
            </div>

            <SectionCard padded={false} title="Races">
                {data.races.map(race => (
                    <div
                        key={race.raceId}
                        style={{
                            alignItems: 'center',
                            borderTop: '1px solid var(--mantine-color-default-border)',
                            display: 'grid',
                            gridTemplateColumns: RACE_COLS,
                            padding: '9px 18px',
                        }}
                    >
                        <span className="f1-num" style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12.5 }}>
                            {race.date ?? '—'}
                        </span>
                        <span style={{ fontSize: 13.5 }}>{race.name}</span>
                        <span style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12.5 }}>
                            {race.winnerName}
                        </span>
                    </div>
                ))}
            </SectionCard>

            <div style={{ color: 'var(--mantine-color-dimmed)', fontSize: 11.5 }}>
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
            </div>
        </div>
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
