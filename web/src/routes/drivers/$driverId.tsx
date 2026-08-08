import type { CSSProperties } from 'react';

import { CaretRightIcon, TrophyIcon } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';

import { CountryFlag } from '#/components/country-flag';
import { GOLD, MiniStat } from '#/components/f1-ui';
import { CURRENT_YEAR, getAllTimeDriver } from '#/data/fixtures';
import { driverCareerQuery } from '#/data/queries';

import './driver-hero.css';

const COLS = '84px 1fr 64px 60px 78px 60px 80px 24px';

const getPositionColor = (pos: number): string => {
    if (pos === 1) return GOLD;
    if (pos <= 3) return 'var(--color-foreground)';
    return 'var(--color-muted-foreground)';
};

const DriverCareer = () => {
    const { driverId } = Route.useParams();
    const { data } = useSuspenseQuery(driverCareerQuery(driverId));
    const { driver, seasons } = data;
    const countryCode = driver.countryCode;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                        <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
                            <span className="f1-display" style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
                                {driver.name}
                            </span>
                            {driver.titles > 0
                                ? (
                                        <div style={{
                                            alignItems: 'center',
                                            background: 'rgba(255,255,255,.18)',
                                            borderRadius: 20,
                                            display: 'flex',
                                            flexWrap: 'nowrap',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            gap: 4,
                                            padding: '4px 10px',
                                        }}
                                        >
                                            <TrophyIcon size={13} weight="fill" />
                                            World Champion
                                        </div>
                                    )
                                : null}
                        </div>
                        <div style={{ fontSize: 13, marginTop: 5, opacity: 0.9 }}>
                            {`${driver.nat} · ${driver.years} · Career summary`}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(6, 1fr)' }}>
                <MiniStat label="SEASONS" value={seasons.length} />
                <MiniStat label="STARTS" value={driver.starts} />
                <MiniStat label="WINS" value={driver.wins} />
                <MiniStat label="POLES" value={driver.poles} />
                <MiniStat label="PODIUMS" value={driver.podiums} />
                <MiniStat label="TITLES" value={driver.titles} />
            </div>

            <div className="f1-card" style={{ padding: 0 }}>
                <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', padding: '15px 20px' }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Seasons</span>
                    <span style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>
                        Select a season to open its full dashboard
                    </span>
                </div>
                <div style={{
                    color: 'var(--color-muted-foreground)',
                    display: 'grid',
                    fontSize: 10.5,
                    fontWeight: 700,
                    gridTemplateColumns: COLS,
                    letterSpacing: '0.5px',
                    padding: '0 20px 8px',
                    textTransform: 'uppercase',
                }}
                >
                    <span>SEASON</span>
                    <span>CHAMPIONSHIP</span>
                    <span style={{ textAlign: 'center' }}>STARTS</span>
                    <span style={{ textAlign: 'center' }}>WINS</span>
                    <span style={{ textAlign: 'center' }}>PODIUMS</span>
                    <span style={{ textAlign: 'center' }}>POLES</span>
                    <span style={{ textAlign: 'right' }}>POINTS</span>
                    <span />
                </div>
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
                                borderTop: '1px solid var(--color-border)',
                                color: 'inherit',
                                display: 'grid',
                                gridTemplateColumns: COLS,
                                padding: '11px 20px',
                                textDecoration: 'none',
                            }}
                            to="/seasons/$year"
                        >
                            <span className="f1-num f1-display" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.4px' }}>{s.year}</span>
                            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 9 }}>
                                <span className="f1-num" style={{ color: posColor, fontSize: 13.5, fontWeight: 700 }}>{s.posLabel}</span>
                                {s.champ ? <TrophyIcon color={GOLD} size={12} weight="fill" /> : null}
                                {s.label ? <span style={{ color: 'var(--color-muted-foreground)', fontSize: 12, fontWeight: 600 }}>{s.label}</span> : null}
                            </div>
                            <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', textAlign: 'center' }}>{s.starts}</span>
                            <span className="f1-num f1-display" style={{ fontWeight: 700, textAlign: 'center' }}>{s.wins}</span>
                            <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', textAlign: 'center' }}>{s.podiums}</span>
                            <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', textAlign: 'center' }}>{s.poles}</span>
                            <span className="f1-num f1-display" style={{ fontWeight: 700, textAlign: 'right' }}>{s.points}</span>
                            <CaretRightIcon color="var(--neutral-400)" size={14} />
                        </Link>
                    );
                })}
            </div>
        </div>
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
