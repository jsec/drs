import type { ReactNode } from 'react';

import { Card } from '@mantine/core';
import { CrownIcon, FlagCheckeredIcon, TimerIcon, TrophyIcon, WrenchIcon } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { CountryFlag } from '#/components/country-flag';
import { seasonCalendarQuery, seasonStandingsQuery } from '#/data/queries';
import { CURRENT_YEAR } from '#/lib/route-params';

import './overview.css';

type RecordStat = { icon: ReactNode; label: string; sub: string; value: number };
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
    const { data } = useSuspenseQuery(seasonStandingsQuery(CURRENT_YEAR));
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
                <Card className="overview-card">
                    <div className="overview-standings-head">
                        <div>
                            <div className="overview-standings-title">Drivers&apos; championship</div>
                            <div className="overview-standings-sub">{subtitle}</div>
                        </div>
                        <span className="overview-pts-label">PTS</span>
                    </div>
                    {drivers.map((d, i) => {
                        const color = d.constructor?.color ?? 'var(--neutral-400)';

                        return (
                            <div className="overview-row" key={d.id}>
                                <span className="overview-row-pos" style={{ color: i === 0 ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-dimmed)' }}>{d.positionLabel}</span>
                                <span className="overview-row-team" style={{ background: color }} />
                                <span className="overview-row-flag">
                                    <CountryFlag aria-hidden code={d.countryCode} />
                                </span>
                                <div className="overview-row-name">
                                    <span className="overview-row-driver">{d.name}</span>
                                    <span className="overview-row-code">{d.code}</span>
                                </div>
                                <div className="overview-bar">
                                    <div style={{ background: color, width: `${(d.points / leaderPoints) * 100}%` }} />
                                </div>
                                <span className="overview-row-pts">{d.points}</span>
                            </div>
                        );
                    })}
                </Card>

                <Card className="overview-card">
                    <div className="overview-standings-head">
                        <div>
                            <div className="overview-standings-title">Constructors&apos; championship</div>
                            <div className="overview-standings-sub">{subtitle}</div>
                        </div>
                        <span className="overview-pts-label">PTS</span>
                    </div>
                    {constructors.map((c, i) => (
                        <div className="overview-row" key={c.id}>
                            <span className="overview-row-pos" style={{ color: i === 0 ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-dimmed)' }}>{c.positionLabel}</span>
                            <span className="overview-row-team" style={{ background: c.color }} />
                            <span className="overview-row-flag">
                                <CountryFlag aria-hidden code={c.countryCode} />
                            </span>
                            <div className="overview-row-name">
                                <span className="overview-row-driver">{c.name}</span>
                            </div>
                            <div className="overview-bar">
                                <div style={{ background: c.color, width: `${(c.points / data.maxConstructorPoints) * 100}%` }} />
                            </div>
                            <span className="overview-row-pts">{c.points}</span>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};
