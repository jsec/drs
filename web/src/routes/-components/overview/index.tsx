import type { ReactNode } from 'react';

import { Card } from '@mantine/core';
import { CrownIcon, FlagCheckeredIcon, TimerIcon, TrophyIcon, WrenchIcon } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { CountryFlag } from '#/components/country-flag';
import { seasonCalendarQuery, seasonOverviewQuery } from '#/data/queries';
import { CURRENT_YEAR } from '#/lib/route-params';

import './overview.css';

type RecordStat = { icon: ReactNode; label: string; sub: string; value: number };
type StandingsRow = {
    code?: string;
    color: string;
    countryCode: string;
    key: string;
    name: string;
    points: number;
    positionLabel: string;
};
type Total = { label: string; meta: string; value: number };

const TOTALS: Total[] = [
    { label: 'Seasons', meta: `1950 → ${CURRENT_YEAR}`, value: 77 },
    { label: 'Drivers', meta: '34 champions', value: 774 },
    { label: 'Constructors', meta: '10 on the grid', value: 171 },
    { label: 'Circuits', meta: '34 countries', value: 77 },
];

const RECORDS: RecordStat[] = [
    { icon: <CrownIcon color="var(--gold-500)" size={15} weight="fill" />, label: 'WDC', sub: '🇬🇧 Hamilton · 🇩🇪 Schumacher', value: 7 },
    { icon: <WrenchIcon color="#DC0000" size={15} weight="fill" />, label: 'WCC', sub: '🇮🇹 Scuderia Ferrari', value: 16 },
    { icon: <TrophyIcon color="var(--mantine-primary-color-filled)" size={15} weight="fill" />, label: 'Most wins', sub: '🇬🇧 Lewis Hamilton', value: 105 },
    { icon: <TimerIcon color="var(--teal-500)" size={15} weight="fill" />, label: 'Most poles', sub: '🇬🇧 Lewis Hamilton', value: 104 },
    { icon: <FlagCheckeredIcon color="var(--blue-500)" size={15} weight="fill" />, label: 'Most starts', sub: '🇪🇸 Fernando Alonso', value: 416 },
];

export const Overview = () => {
    const { data } = useSuspenseQuery(seasonOverviewQuery(CURRENT_YEAR));
    const { data: calendar } = useSuspenseQuery(seasonCalendarQuery(CURRENT_YEAR));
    const drivers = data.drivers.slice(0, 10);
    const constructors = data.constructors.slice(0, 10);
    const leaderPoints = drivers[0]?.points ?? 0;
    const subtitle = `${CURRENT_YEAR} · after ${calendar.roundsCompleted} of ${calendar.totalRounds} rounds`;

    return (
        <div className="overview-stack">
            <div className="overview-header">
                <div>
                    <div className="overview-eyebrow">FIA Formula 1 World Championship</div>
                    <h1 className="overview-title">Overview</h1>
                    <div className="overview-desc">
                        Every driver, constructor and season since 1950 — plus the story so far in
                        {' '}
                        {CURRENT_YEAR}
                        .
                    </div>
                </div>
                <div className="overview-header-meta">
                    <div className="overview-header-meta-label">Season in progress</div>
                    <div className="overview-header-meta-value">{`${CURRENT_YEAR} · R${calendar.roundsCompleted} / ${calendar.totalRounds}`}</div>
                </div>
            </div>

            <Card className="overview-card">
                <div className="overview-card-head">
                    <div className="overview-card-title">Championship history</div>
                    <div className="overview-card-sub">{`The series at a glance · 1950 → ${CURRENT_YEAR}`}</div>
                </div>
                <div className="overview-totals">
                    {TOTALS.map(t => (
                        <div className="overview-total" key={t.label}>
                            <div className="overview-total-value">{t.value}</div>
                            <div className="overview-total-label">{t.label}</div>
                            <div className="overview-total-meta">{t.meta}</div>
                        </div>
                    ))}
                </div>
                <div className="overview-records-head">All-time records</div>
                <div className="overview-records">
                    {RECORDS.map(r => (
                        <div className="overview-record" key={r.label}>
                            <div className="overview-record-label">
                                {r.icon}
                                {r.label}
                            </div>
                            <div className="overview-record-value">{r.value}</div>
                            <div className="overview-record-sub">{r.sub}</div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="overview-standings">
                <StandingsCard
                    maxPoints={leaderPoints}
                    rows={drivers.map(d => ({
                        code: d.code,
                        color: d.constructor?.color ?? 'var(--neutral-400)',
                        countryCode: d.countryCode,
                        key: d.id,
                        name: d.name,
                        points: d.points,
                        positionLabel: d.positionLabel,
                    }))}
                    subtitle={subtitle}
                    title="Drivers' championship"
                />
                <StandingsCard
                    maxPoints={data.maxConstructorPoints}
                    rows={constructors.map(c => ({
                        color: c.color,
                        countryCode: c.countryCode,
                        key: `${c.id}-${c.engineId}`,
                        name: c.name,
                        points: c.points,
                        positionLabel: c.positionLabel,
                    }))}
                    subtitle={subtitle}
                    title="Constructors' championship"
                />
            </div>
        </div>
    );
};

type StandingsCardProps = {
    maxPoints: number;
    rows: StandingsRow[];
    subtitle: string;
    title: string;
};

const StandingsCard = ({ maxPoints, rows, subtitle, title }: StandingsCardProps) => (
    <Card className="overview-card">
        <div className="overview-standings-head">
            <div>
                <div className="overview-standings-title">{title}</div>
                <div className="overview-standings-sub">{subtitle}</div>
            </div>
            <span className="overview-pts-label">PTS</span>
        </div>
        {rows.map((r, i) => (
            <div className="overview-row" key={r.key}>
                <span className="overview-row-pos" style={{ color: i === 0 ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-dimmed)' }}>{r.positionLabel}</span>
                <span className="overview-row-team" style={{ background: r.color }} />
                <span className="overview-row-flag">
                    <CountryFlag aria-hidden code={r.countryCode} />
                </span>
                <div className="overview-row-name">
                    <span className="overview-row-driver">{r.name}</span>
                    {r.code && <span className="overview-row-code">{r.code}</span>}
                </div>
                <div className="overview-bar">
                    <div style={{ background: r.color, width: `${(r.points / maxPoints) * 100}%` }} />
                </div>
                <span className="overview-row-pts">{r.points}</span>
            </div>
        ))}
    </Card>
);
