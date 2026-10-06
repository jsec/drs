import { Progress } from '@mantine/core';
import { Link } from '@tanstack/react-router';

import type { ConstructorStanding, DriverStanding } from '#/lib/api/seasons';

import { makeColumns } from '#/components/data-table';
import { TeamBar, TeamSquare } from '#/components/f1-ui';

const CODE_STYLE = { color: 'var(--mantine-color-dimmed)', fontSize: 11, fontWeight: 700, marginLeft: 8 } as const;

export function makeConstructorColumns(year: string, maxConstructor: number) {
    const col = makeColumns<ConstructorStanding>();

    return [
        col.ordinal({ header: 'POS', width: '46px' }),
        col.competitor('name', {
            header: 'CONSTRUCTOR',
            label: c => c.name,
            link: c => ({ params: { constructorId: c.id, year }, to: '/seasons/$year/constructors/$constructorId' }),
            visual: c => <TeamSquare color={c.color} size="bar" />,
            width: '240px',
        }),
        col.custom({
            cell: info => (
                <Progress color={info.row.original.color} size={9} value={(info.row.original.points / maxConstructor) * 100} />
            ),
            header: '',
            id: 'bar',
        }),
        col.num('points', { align: 'right', header: 'PTS', variant: 'display', width: '90px' }),
    ];
}

export function makeDriverColumns(year: string) {
    const col = makeColumns<DriverStanding>();

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
            link: d => ({ params: { driverId: d.id, year }, to: '/seasons/$year/drivers/$driverId' }),
            visual: d => <TeamBar color={d.constructor?.color ?? 'var(--neutral-500)'} size="md" />,
        }),
        col.custom({
            cell: (info) => {
                const team = info.row.original.constructor;
                if (!team) {
                    return '—';
                }

                return (
                    <Link
                        className="f1-plain-link"
                        onClick={event => event.stopPropagation()}
                        params={{ constructorId: team.id }}
                        to="/constructors/$constructorId"
                    >
                        {team.name}
                    </Link>
                );
            },
            header: 'TEAM',
            id: 'constructor',
            width: '130px',
        }),
        col.num('wins', { align: 'center', header: 'WINS', width: '70px' }),
        col.num('podiums', { align: 'center', header: 'PODIUMS', width: '80px' }),
        col.num('poles', { align: 'center', header: 'POLES', width: '80px' }),
        col.num('points', { align: 'right', header: 'PTS', variant: 'display', width: '80px' }),
    ];
}
