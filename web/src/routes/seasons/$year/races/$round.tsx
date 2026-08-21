import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { DriverAvatar, GridHeader, SectionCard, TeamBar } from '#/components/f1-ui';
import { LineChart, toChartData, toChartSeries } from '#/components/line-chart';
import { raceDetailQuery } from '#/data/queries';
import { parseRound, parseYear } from '#/lib/route-params';

const MEDALS = ['#f59f00', '#adb5bd', '#e8590c'];
const RESULT_COLS = '36px 1fr 72px 90px 48px';

const HERO_STYLE: React.CSSProperties = {
    alignItems: 'center',
    background: 'linear-gradient(110deg, var(--neutral-950), var(--neutral-800))',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '22px 26px',
};

const RESULT_ROW_STYLE: React.CSSProperties = {
    alignItems: 'center',
    borderTop: '1px solid var(--mantine-color-default-border)',
    color: 'inherit',
    display: 'grid',
    gridTemplateColumns: RESULT_COLS,
    padding: '8px 18px',
    textDecoration: 'none',
};

const QUAL_ROW_STYLE: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: 10,
    marginBottom: 11,
};

const CENTER_LINE_STYLE: React.CSSProperties = {
    background: 'var(--mantine-color-default-border)',
    bottom: 0,
    left: '50%',
    position: 'absolute',
    top: 0,
    width: 1,
};

const getDeltaColor = (delta: number): string => {
    if (delta > 0) return 'var(--green-500)';
    if (delta < 0) return 'var(--mantine-primary-color-filled)';
    return 'var(--neutral-300)';
};

const RaceDetail = () => {
    const { round, year } = Route.useParams();
    const { data } = useSuspenseQuery(raceDetailQuery(Number(year), Number(round)));

    const positionSeries = toChartSeries(data.positionLines);
    const positionData = toChartData(data.positionLines, i => `L${i * 5 + 1}`);
    const paceSeries = toChartSeries(data.paceLines);
    const paceData = toChartData(data.paceLines, i => `L${i + 1}`);

    const headStats = [
        { label: 'POLE', value: data.pole.short },
        { label: 'FASTEST LAP', value: data.fastestLap.short },
        { label: 'WINNER', value: data.winner.short },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hero */}
            <div style={HERO_STYLE}>
                <div>
                    <div style={{ color: 'var(--color-sidebar-muted)', fontSize: 12, fontWeight: 700, letterSpacing: '1px' }}>
                        {`ROUND ${data.round} · ${data.year}`}
                    </div>
                    <div className="f1-display" style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '6px 0' }}>
                        {data.name}
                    </div>
                    <div style={{ color: 'var(--neutral-300)', fontSize: 13 }}>
                        {`${data.circuit} · ${data.date} · ${data.laps} laps`}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 26 }}>
                    {headStats.map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--color-sidebar-muted)', fontSize: 11, fontWeight: 600 }}>{s.label}</div>
                            <div className="f1-display" style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginTop: 3 }}>
                                {s.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Podium cards */}
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {data.results.slice(0, 3).map((r, i) => (
                    <Link
                        key={r.code}
                        params={{ driverId: r.code, year }}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        to="/seasons/$year/drivers/$driverId"
                    >
                        <div
                            className="f1-card f1-lift"
                            style={{ borderTop: `4px solid ${r.driver.color}`, cursor: 'pointer', padding: 16 }}
                        >
                            <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 14 }}>
                                <span className="f1-display" style={{ color: MEDALS[i], fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700 }}>{i + 1}</span>
                                <DriverAvatar code={r.code} color={r.driver.color} size="lg" />
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700 }}>{r.driver.name}</div>
                                    <div style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12 }}>{r.driver.teamName}</div>
                                    <div className="f1-num" style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>
                                        {i === 0 ? '1:32:14.882' : r.gap}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                <div className="f1-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Position Changes</div>
                    <div style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12, marginBottom: 8 }}>
                        Track position lap-by-lap · top 5
                    </div>
                    <LineChart
                        data={positionData}
                        dataKey="x"
                        h={240}
                        series={positionSeries}
                        xAxisProps={{ interval: 3 }}
                        yAxisProps={{ domain: [1, 10], reversed: true, tickCount: 5 }}
                    />
                </div>
                <div className="f1-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Race Pace</div>
                    <div style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12, marginBottom: 8 }}>
                        Lap time (s) · lower is faster
                    </div>
                    <LineChart
                        data={paceData}
                        dataKey="x"
                        h={240}
                        series={paceSeries}
                        valueFormatter={v => v.toFixed(1)}
                        xAxisProps={{ interval: 5 }}
                        yAxisProps={{ domain: [77.5, 82], tickCount: 5 }}
                    />
                </div>
            </div>

            {/* Results + Qual vs Race */}
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '7.2fr 4.8fr' }}>
                <SectionCard padded={false} title="Race Results">
                    <GridHeader columns={RESULT_COLS}>
                        <span>POS</span>
                        <span>DRIVER</span>
                        <span style={{ textAlign: 'center' }}>GRID</span>
                        <span style={{ textAlign: 'right' }}>GAP</span>
                        <span style={{ textAlign: 'right' }}>PTS</span>
                    </GridHeader>
                    <div className="f1-scroll" style={{ maxHeight: 430, overflowY: 'auto' }}>
                        {data.results.map(r => (
                            <Link
                                className="f1-row"
                                key={r.code}
                                params={{ driverId: r.code, year }}
                                style={RESULT_ROW_STYLE}
                                to="/seasons/$year/drivers/$driverId"
                            >
                                <span className="f1-num" style={{ color: 'var(--mantine-color-dimmed)', fontWeight: 700 }}>{r.pos}</span>
                                <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 9 }}>
                                    <TeamBar color={r.driver.color} size="sm" />
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{r.driver.short}</span>
                                </div>
                                <span className="f1-num" style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12.5, textAlign: 'center' }}>{r.grid}</span>
                                <span className="f1-num" style={{ fontSize: 12.5, textAlign: 'right' }}>{r.gap}</span>
                                <span className="f1-num" style={{ color: r.pts > 0 ? 'inherit' : 'var(--neutral-300)', fontWeight: 700, textAlign: 'right' }}>
                                    {r.pts > 0 ? r.pts : '–'}
                                </span>
                            </Link>
                        ))}
                    </div>
                </SectionCard>

                <div className="f1-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Qualifying vs Race</div>
                    <div style={{ color: 'var(--mantine-color-dimmed)', fontSize: 12, marginBottom: 14 }}>
                        Positions gained or lost on Sunday
                    </div>
                    {data.results.slice(0, 10).map((r) => {
                        const delta = r.grid - r.pos;
                        const mag = (Math.min(Math.abs(delta), 8) / 8) * 45;
                        const color = getDeltaColor(delta);
                        return (
                            <div key={r.code} style={QUAL_ROW_STYLE}>
                                <span style={{ fontSize: 12, fontWeight: 700, width: 40 }}>{r.code}</span>
                                <span className="f1-num" style={{ color: 'var(--mantine-color-dimmed)', fontSize: 11, width: 62 }}>
                                    P
                                    {r.grid}
                                    →P
                                    {r.pos}
                                </span>
                                <div style={{ flex: 1, height: 14, position: 'relative' }}>
                                    <div style={CENTER_LINE_STYLE} />
                                    <div style={{
                                        background: color,
                                        borderRadius: 3,
                                        height: 8,
                                        left: delta >= 0 ? '50%' : `${50 - mag}%`,
                                        position: 'absolute',
                                        top: 3,
                                        width: `${Math.max(mag, 1)}%`,
                                    }}
                                    />
                                </div>
                                <span className="f1-num" style={{ color, fontSize: 12, fontWeight: 700, textAlign: 'right', width: 34 }}>
                                    {delta > 0 ? `+${delta}` : delta}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute('/seasons/$year/races/$round')({
    component: RaceDetail,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        const race = await context.queryClient.ensureQueryData(
            raceDetailQuery(year, parseRound(params.round)),
        );
        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: 'Calendar', params: { year: params.year }, to: '/seasons/$year/calendar' },
                { label: race.name },
            ],
        };
    },
});
