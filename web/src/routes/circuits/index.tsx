import type { ReactNode } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import type { Circuit } from '#/data/types';

import { COMPLETED, CURRENT_YEAR } from '#/data/fixtures';
import { circuitsQuery } from '#/data/queries';

const CIRCUIT_HEADER_STYLE: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
};

const CIRCUIT_SVG_WRAP_STYLE: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: 120,
    justifyContent: 'center',
};

const CIRCUIT_SVG_STYLE: React.CSSProperties = {
    height: '100%',
    width: '100%',
};

const CIRCUIT_STATS_STYLE: React.CSSProperties = {
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    gap: 16,
    marginTop: 10,
    paddingTop: 10,
};

const LINK_STYLE: React.CSSProperties = {
    color: 'inherit',
    textDecoration: 'none',
};

const CircuitStat = ({ label, value }: { label: string; value: ReactNode }) => (
    <div>
        <div className="f1-num f1-display" style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
        <div style={{ color: 'var(--color-muted-foreground)', fontSize: 10 }}>{label}</div>
    </div>
);

type CircuitCardProps = {
    circuit: Circuit;
    done: boolean;
    year: string;
};

const CircuitCard = ({ circuit: c, done, year }: CircuitCardProps) => {
    const card = (
        <div
            className={done ? 'f1-card f1-lift' : 'f1-card'}
            style={{ cursor: done ? 'pointer' : 'default', height: '100%', padding: 16 }}
        >
            <div style={CIRCUIT_HEADER_STYLE}>
                <span style={{ color: 'var(--color-muted-foreground)', fontSize: 11, fontWeight: 700 }}>
                    {`ROUND ${c.round}`}
                </span>
                <span style={{ color: 'var(--color-primary)', fontSize: 11, fontWeight: 700 }}>
                    {c.code}
                </span>
            </div>
            <div style={CIRCUIT_SVG_WRAP_STYLE}>
                <svg style={CIRCUIT_SVG_STYLE} viewBox="0 0 200 120">
                    <path
                        d={c.path}
                        fill="none"
                        stroke="var(--neutral-800)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3.5}
                    />
                </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 6 }}>{c.name}</div>
            <div style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>{c.country}</div>
            <div style={CIRCUIT_STATS_STYLE}>
                <CircuitStat label="LENGTH" value={c.length} />
                <CircuitStat label="CORNERS" value={c.corners} />
                <CircuitStat label="LAPS" value={c.laps} />
            </div>
        </div>
    );

    return done
        ? (
                <Link params={{ round: String(c.round), year }} style={LINK_STYLE} to="/seasons/$year/races/$round">
                    {card}
                </Link>
            )
        : card;
};

const Circuits = () => {
    const { data: circuits } = useSuspenseQuery(circuitsQuery(CURRENT_YEAR));
    const year = String(CURRENT_YEAR);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <h1 className="f1-page-title">Circuits</h1>
                <div className="f1-page-description">{`${CURRENT_YEAR} championship venues`}</div>
            </div>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {circuits.map(c => (
                    <CircuitCard
                        circuit={c}
                        done={c.round <= COMPLETED}
                        key={c.code}
                        year={year}
                    />
                ))}
            </div>
        </div>
    );
};

export const Route = createFileRoute('/circuits/')({
    component: Circuits,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(circuitsQuery(CURRENT_YEAR));
        return { crumbs: [{ label: 'Circuits' }] };
    },
});
