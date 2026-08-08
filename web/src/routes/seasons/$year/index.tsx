import {
    CalendarDotsIcon,
    CrownIcon,
    FlagCheckeredIcon,
    GaugeIcon,
} from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { memo, useMemo } from 'react';

import type { CalendarRound, SeasonDriver } from '#/data/types';

import { GridHeader, SectionCard, StatCard, TeamBar } from '#/components/f1-ui';
import { LineChart, roundLabels } from '#/components/line-chart';
import { seasonOverviewQuery } from '#/data/queries';
import { parseYear } from '#/lib/route-params';

const DRIVER_COLS = '34px 1fr 64px 56px 70px';

type MiniRaceCellProps = {
    completed: number;
    driverByCode: Map<string, SeasonDriver>;
    r: CalendarRound;
    year: string;
};

const MiniRaceCell = memo(function MiniRaceCell({ completed, driverByCode, r, year }: MiniRaceCellProps) {
    const isDone = r.round <= completed;
    const isNext = r.round === completed + 1;
    const winner = r.winner ? driverByCode.get(r.winner) : null;

    let background: string;
    let border: string;
    if (isDone) {
        background = 'var(--color-card)';
        border = '1px solid var(--color-border)';
    } else if (isNext) {
        background = 'color-mix(in srgb, var(--color-primary) 6%, var(--color-background))';
        border = '1px solid color-mix(in srgb, var(--color-primary) 40%, var(--color-border))';
    } else {
        background = 'var(--color-accent)';
        border = '1px solid var(--color-border)';
    }

    const cell = (
        <div
            className={isDone ? 'f1-lift' : undefined}
            style={{ background, border, borderRadius: 7, cursor: isDone ? 'pointer' : 'default', padding: '9px 10px' }}
        >
            <div className="f1-num" style={{ color: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: 700 }}>
                R
                {r.round}
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 2 }}>{r.code}</div>
            <div style={{ color: 'var(--color-muted-foreground)', fontSize: 10.5, marginTop: 1 }}>{r.date}</div>
            <div style={{ background: winner?.color ?? 'var(--color-border)', borderRadius: 2, height: 3, marginTop: 7 }} />
        </div>
    );

    if (isDone) {
        return (
            <Link params={{ round: String(r.round), year }} style={{ textDecoration: 'none' }} to="/seasons/$year/races/$round">
                {cell}
            </Link>
        );
    }

    return cell;
});

const ACTION_LINK: React.CSSProperties = {
    color: 'var(--color-primary)',
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
};

const SeasonOverview = () => {
    const { year } = Route.useParams();
    const { data } = useSuspenseQuery(seasonOverviewQuery(Number(year)));
    const maxConstructor = data.constructors[0]?.points || 1;
    const topDrivers = data.drivers.slice(0, 8);
    const driverByCode = useMemo(
        () => new Map(data.drivers.map(d => [d.code, d])),
        [data.drivers],
    );

    const progressionSeries = data.progression.map(p => ({ color: p.color, values: p.values }));
    const xLabels = roundLabels(data.completed + 1, 2);
    xLabels[0] = 'Start';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ alignItems: 'flex-end', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ color: 'var(--color-muted-foreground)', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        FIA FORMULA 1 WORLD CHAMPIONSHIP
                    </div>
                    <h1 className="f1-display" style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', margin: '6px 0 0' }}>
                        {`${data.year} Season Overview`}
                    </h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>Last round</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{data.lastRaceName}</div>
                </div>
            </div>

            {/* KPI cards */}
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <StatCard
                    accent="var(--color-primary)"
                    icon={<FlagCheckeredIcon size={15} weight="fill" />}
                    label="Round"
                    sub="season progress"
                    value={`${data.completed} / ${data.totalRounds}`}
                />
                <StatCard
                    accent="var(--gold-500)"
                    icon={<CrownIcon size={15} weight="fill" />}
                    label="Championship Leader"
                    sub={`${data.leader.points} pts`}
                    value={data.leader.short}
                />
                <StatCard
                    accent="var(--color-primary)"
                    icon={<GaugeIcon size={15} weight="fill" />}
                    label="Lead Margin"
                    sub={`over ${data.runnerUp.short}`}
                    value={`+${data.leader.points - data.runnerUp.points}`}
                />
                <StatCard
                    accent="var(--teal-500)"
                    icon={<CalendarDotsIcon size={15} />}
                    label="Next Race"
                    sub={data.nextRace.name}
                    value={data.nextRace.code}
                />
            </div>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '7.2fr 4.8fr' }}>
                <SectionCard
                    action={(
                        <Link params={{ year }} style={ACTION_LINK} to="/seasons/$year/standings">
                            View full table →
                        </Link>
                    )}
                    padded={false}
                    title="Drivers' Championship"
                >
                    <GridHeader columns={DRIVER_COLS}>
                        <span>POS</span>
                        <span>DRIVER</span>
                        <span style={{ textAlign: 'right' }}>PTS</span>
                        <span style={{ textAlign: 'center' }}>WINS</span>
                        <span style={{ textAlign: 'right' }}>GAP</span>
                    </GridHeader>
                    {topDrivers.map((d, i) => (
                        <Link
                            className="f1-row"
                            key={d.code}
                            params={{ driverId: d.code, year }}
                            style={{
                                alignItems: 'center',
                                borderTop: '1px solid var(--color-border)',
                                color: 'inherit',
                                display: 'grid',
                                gridTemplateColumns: DRIVER_COLS,
                                padding: '9px 18px',
                                textDecoration: 'none',
                            }}
                            to="/seasons/$year/drivers/$driverId"
                        >
                            <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', fontWeight: 700 }}>{i + 1}</span>
                            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 11 }}>
                                <TeamBar color={d.color} />
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{d.short}</div>
                                    <div style={{ color: 'var(--color-muted-foreground)', fontSize: 11 }}>{d.teamName}</div>
                                </div>
                            </div>
                            <span className="f1-num f1-display" style={{ fontWeight: 700, textAlign: 'right' }}>{d.points}</span>
                            <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', textAlign: 'center' }}>{d.wins}</span>
                            <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', fontSize: 12.5, textAlign: 'right' }}>
                                {i === 0 ? '—' : `-${data.leader.points - d.points}`}
                            </span>
                        </Link>
                    ))}
                </SectionCard>

                <SectionCard
                    action={(
                        <Link style={ACTION_LINK} to="/constructors">
                            Compare →
                        </Link>
                    )}
                    padded={false}
                    title="Constructors"
                >
                    {data.constructors.map(c => (
                        <div
                            key={c.key}
                            style={{ borderTop: '1px solid var(--color-border)', padding: '8px 18px' }}
                        >
                            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', marginBottom: 5 }}>
                                <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 9 }}>
                                    <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', fontSize: 11, fontWeight: 700, textAlign: 'center', width: 18 }}>{c.pos}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                                </div>
                                <span className="f1-num f1-display" style={{ fontSize: 13, fontWeight: 700 }}>{c.points}</span>
                            </div>
                            <div style={{ marginLeft: 27 }}>
                                <div style={{ background: 'var(--color-border)', borderRadius: 9999, height: 5, overflow: 'hidden' }}>
                                    <div style={{ background: c.color, borderRadius: 9999, height: '100%', width: `${(c.points / maxConstructor) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </SectionCard>
            </div>

            {/* Points progression chart */}
            <div className="f1-card" style={{ padding: 16 }}>
                <div style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>Championship Points Progression</div>
                        <div style={{ color: 'var(--color-muted-foreground)', fontSize: 12, marginTop: 2 }}>
                            Cumulative points after each round · top 6 drivers
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 14 }}>
                        {data.progression.map(l => (
                            <div key={l.code} style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', fontSize: 12, fontWeight: 600, gap: 6 }}>
                                <div style={{ background: l.color, borderRadius: 2, height: 3, width: 11 }} />
                                {l.code}
                            </div>
                        ))}
                    </div>
                </div>
                <LineChart
                    ariaLabel="Cumulative championship points after each round, top 6 drivers"
                    height={280}
                    series={progressionSeries}
                    ticks={6}
                    viewHeight={300}
                    viewWidth={1100}
                    xLabels={xLabels}
                    yMax={250}
                    yMin={0}
                />
            </div>

            <SectionCard
                action={(
                    <Link params={{ year }} style={ACTION_LINK} to="/seasons/$year/calendar">
                        Full calendar →
                    </Link>
                )}
                title={`${data.year} Calendar`}
            >
                <div style={{ display: 'grid', gap: 9, gridTemplateColumns: 'repeat(8, 1fr)' }}>
                    {data.calendar.map(r => (
                        <MiniRaceCell
                            completed={data.completed}
                            driverByCode={driverByCode}
                            key={r.round}
                            r={r}
                            year={year}
                        />
                    ))}
                </div>
            </SectionCard>
        </div>
    );
};

export const Route = createFileRoute('/seasons/$year/')({
    component: SeasonOverview,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        await context.queryClient.ensureQueryData(seasonOverviewQuery(year));
        return { crumbs: [{ label: 'Season Overview' }] };
    },
});
