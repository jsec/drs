import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { CircuitSummaryResponse } from '#/lib/api/circuits.gen';

import { MiniStat } from '#/components/f1-ui';
import { api } from '#/lib/query/api';

import { CircuitLayout } from './-components/circuit-layout';
import './circuit-hero.css';

const RACE_COLS = '110px 1fr 200px';

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

    const years = `${year(data.firstRace.date)}-${year(data.lastRace.date)}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="circuit-hero">
                <CircuitLayout
                    className="circuit-hero-watermark"
                    layoutId={data.layoutId}
                    name={data.name}
                    size={220}
                />
                <div className="circuit-hero-content">
                    <div className="circuit-hero-mark">
                        <CircuitLayout layoutId={data.layoutId} name={data.name} size={46} />
                    </div>
                    <div>
                        <span className="f1-display" style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
                            {data.name}
                        </span>
                        <div style={{ fontSize: 13, marginTop: 5, opacity: 0.9 }}>
                            {`${data.country} · ${years} · Circuit summary`}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <MiniStat label="GRANDS PRIX" value={data.raceCount} />
                <MiniStat label="TURNS" value={data.turns} />
                <MiniStat label="FIRST RACE" value={year(data.firstRace.date)} />
                <MiniStat label="LAST RACE" value={year(data.lastRace.date)} />
            </div>

            <div className="f1-card" style={{ padding: 0 }}>
                <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', padding: '15px 20px' }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Races</span>
                    <span style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12 }}>
                        Every Grand Prix held at this circuit
                    </span>
                </div>
                <div style={{
                    color: 'var(--mantine-color-dimmed)',
                    display: 'grid',
                    fontSize: 10.5,
                    fontWeight: 700,
                    gridTemplateColumns: RACE_COLS,
                    letterSpacing: '0.5px',
                    padding: '0 20px 8px',
                    textTransform: 'uppercase',
                }}
                >
                    <span>DATE</span>
                    <span>GRAND PRIX</span>
                    <span>WINNER</span>
                </div>
                {data.races.map(race => (
                    <div
                        key={race.raceId}
                        style={{
                            alignItems: 'center',
                            borderTop: '1px solid var(--mantine-color-default-border)',
                            display: 'grid',
                            gridTemplateColumns: RACE_COLS,
                            padding: '11px 20px',
                        }}
                    >
                        <span className="f1-num" style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12.5 }}>
                            {race.date ?? '—'}
                        </span>
                        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{race.name}</span>
                        <span style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12.5 }}>
                            {race.winnerName}
                        </span>
                    </div>
                ))}
            </div>

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
