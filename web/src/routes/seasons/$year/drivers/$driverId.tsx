import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';

import { GridHeader, MiniStat } from '#/components/f1-ui';
import { LineChart, roundLabels } from '#/components/line-chart';
import { getSeasonDriver } from '#/data/fixtures';
import { driverSeasonQuery } from '#/data/queries';
import { parseYear } from '#/lib/route-params';

const COLS = '44px 1fr 70px 70px 70px 60px';

const DriverSeason = () => {
    const { driverId, year } = Route.useParams();
    const { data } = useSuspenseQuery(driverSeasonQuery(Number(year), driverId));
    const { driver, pos } = data;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
                alignItems: 'center',
                background: `linear-gradient(110deg, ${driver.color}, ${driver.colorDark})`,
                borderRadius: 'var(--radius-lg)',
                color: '#fff',
                display: 'flex',
                gap: 24,
                overflow: 'hidden',
                padding: '24px 28px',
                position: 'relative',
            }}
            >
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 140,
                    fontWeight: 700,
                    lineHeight: 0.8,
                    opacity: 0.18,
                    position: 'absolute',
                    right: 24,
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                >
                    {driver.number}
                </div>
                <div style={{
                    alignItems: 'center',
                    background: 'rgba(255,255,255,.18)',
                    border: '2px solid rgba(255,255,255,.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexShrink: 0,
                    fontSize: 24,
                    fontWeight: 700,
                    height: 78,
                    justifyContent: 'center',
                    width: 78,
                }}
                >
                    {driver.code}
                </div>
                <div style={{ paddingRight: 130, zIndex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', opacity: 0.85 }}>
                        {`${driver.teamName} · #${driver.number}`}
                    </div>
                    <div className="f1-display" style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                        {driver.name}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>
                        {`${driver.country} · Championship P${pos}`}
                    </div>
                </div>
            </div>

            {/* Stat tiles */}
            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(6, 1fr)' }}>
                <MiniStat label="POINTS" value={driver.points} />
                <MiniStat label="WINS" value={driver.wins} />
                <MiniStat label="PODIUMS" value={driver.podiums} />
                <MiniStat label="POLES" value={driver.poles} />
                <MiniStat label="STANDING" value={`P${pos}`} />
                <MiniStat label="CAR NO." value={`#${driver.number}`} />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                <div className="f1-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Points Progression</div>
                    <LineChart
                        ariaLabel={`${driver.name} cumulative points progression`}
                        height={200}
                        series={[{ color: driver.color, values: data.progression }]}
                        ticks={5}
                        viewHeight={260}
                        viewWidth={520}
                        xLabels={roundLabels(data.progression.length, 2)}
                        yMax={data.pointsMax}
                        yMin={0}
                    />
                </div>
                <div className="f1-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Finishing Positions</div>
                    <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'nowrap', gap: 6, height: 180 }}>
                        {data.finishes.map(f => (
                            <div
                                key={f.round}
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flex: 1,
                                    flexDirection: 'column',
                                    height: '100%',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <span className="f1-num" style={{ color: 'var(--neutral-700)', fontSize: 10, fontWeight: 700, marginBottom: 3 }}>{f.pos}</span>
                                <div style={{
                                    background: f.color,
                                    borderRadius: '4px 4px 0 0',
                                    height: `${(100 - ((f.pos - 1) / 19) * 100) * 0.9}%`,
                                    maxWidth: 26,
                                    width: '100%',
                                }}
                                />
                                <span style={{ color: 'var(--color-muted-foreground)', fontSize: 9.5, marginTop: 4 }}>{f.round}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="f1-card" style={{ padding: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, padding: '15px 18px' }}>Race-by-Race Results</div>
                <GridHeader columns={COLS}>
                    <span>RND</span>
                    <span>GRAND PRIX</span>
                    <span style={{ textAlign: 'center' }}>GRID</span>
                    <span style={{ textAlign: 'center' }}>FINISH</span>
                    <span style={{ textAlign: 'center' }}>STATUS</span>
                    <span style={{ textAlign: 'right' }}>PTS</span>
                </GridHeader>
                {data.races.map(r => (
                    <Link
                        className="f1-row"
                        key={r.round}
                        params={{ round: String(r.round), year }}
                        style={{
                            alignItems: 'center',
                            borderTop: '1px solid var(--color-border)',
                            color: 'inherit',
                            display: 'grid',
                            gridTemplateColumns: COLS,
                            padding: '9px 18px',
                            textDecoration: 'none',
                        }}
                        to="/seasons/$year/races/$round"
                    >
                        <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', fontWeight: 700 }}>{r.round}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{r.gp}</span>
                        <span className="f1-num" style={{ color: 'var(--color-muted-foreground)', textAlign: 'center' }}>{r.grid}</span>
                        <span className="f1-num f1-display" style={{ fontWeight: 700, textAlign: 'center' }}>{r.finish}</span>
                        <span style={{ color: r.statusColor, fontSize: 11, fontWeight: 700, textAlign: 'center' }}>{r.status}</span>
                        <span className="f1-num" style={{ fontWeight: 700, textAlign: 'right' }}>{r.pts > 0 ? r.pts : '–'}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export const Route = createFileRoute('/seasons/$year/drivers/$driverId')({
    component: DriverSeason,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        if (!getSeasonDriver(params.driverId)) {
            throw notFound();
        }
        const detail = await context.queryClient.ensureQueryData(
            driverSeasonQuery(year, params.driverId),
        );
        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: detail.driver.name },
            ],
        };
    },
});
