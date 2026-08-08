import type { SeasonConstructor, SeasonDriver } from '#/data/types';

import { makeColumns } from '#/components/data-table';
import { TeamBar, TeamSquare } from '#/components/f1-ui';

const CODE_STYLE = { color: 'var(--color-muted-foreground)', fontSize: 11, fontWeight: 700, marginLeft: 8 } as const;

export function makeConstructorColumns(maxConstructor: number) {
    const col = makeColumns<SeasonConstructor>();

    return [
        col.ordinal({ header: 'POS', width: '46px' }),
        col.competitor('name', {
            header: 'CONSTRUCTOR',
            label: c => c.name,
            visual: c => <TeamSquare color={c.color} height={30} width={10} />,
            width: '240px',
        }),
        col.custom({
            cell: (info) => {
                const c = info.row.original;
                return (
                    <div style={{ background: 'var(--color-border)', borderRadius: 9999, height: 9, overflow: 'hidden' }}>
                        <div style={{ background: c.color, borderRadius: 9999, height: '100%', width: `${(c.points / maxConstructor) * 100}%` }} />
                    </div>
                );
            },
            header: '',
            id: 'bar',
        }),
        col.num('points', { align: 'right', header: 'PTS', variant: 'display', width: '90px' }),
    ];
}

export function makeDriverColumns(year: string) {
    const col = makeColumns<SeasonDriver>();

    return [
        col.ordinal({ header: 'POS', width: '46px' }),
        col.competitor('name', {
            header: 'DRIVER',
            label: d => (
                <>
                    {d.name}
                    <span style={CODE_STYLE}>{d.code}</span>
                </>
            ),
            link: d => ({ params: { driverId: d.code, year }, to: '/seasons/$year/drivers/$driverId' }),
            visual: d => <TeamBar color={d.color} height={24} />,
        }),
        col.text('teamName', { header: 'TEAM', muted: true, size: 'sm', width: '130px' }),
        col.num('wins', { align: 'center', header: 'WINS', width: '70px' }),
        col.num('podiums', { align: 'center', header: 'PODIUMS', width: '80px' }),
        col.num('poles', { align: 'center', header: 'POLES', width: '80px' }),
        col.num('points', { align: 'right', header: 'PTS', variant: 'display', width: '80px' }),
    ];
}
