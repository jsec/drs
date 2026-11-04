import { Progress } from '@mantine/core';
import { Link } from '@tanstack/react-router';

import type { ConstructorStanding, DriverStanding } from '#/lib/api/seasons';

import { makeColumns } from '#/components/data-table';
import { TeamBar, TeamSquare } from '#/components/f1-ui';

const CODE_STYLE = {
    color: 'var(--mantine-color-dimmed)',
    fontSize: 11,
    fontWeight: 700,
    marginLeft: 8,
} as const;

export function makeConstructorColumns(year: string, maxConstructorPoints: number) {
    const columnBuilder = makeColumns<ConstructorStanding>();

    return [
        columnBuilder.ordinal({ header: 'POS', width: '46px' }),
        columnBuilder.competitor('name', {
            header: 'CONSTRUCTOR',
            label: standing => standing.name,
            link: standing => ({ params: { constructorId: standing.id, year }, to: '/seasons/$year/constructors/$constructorId' }),
            visual: standing => <TeamSquare color={standing.color} size="bar" />,
            width: '240px',
        }),
        columnBuilder.custom({
            cell: info => (
                <Progress color={info.row.original.color} size={9} value={(info.row.original.points / maxConstructorPoints) * 100} />
            ),
            header: '',
            id: 'bar',
        }),
        columnBuilder.numeric('points', {
            align: 'right',
            header: 'PTS',
            variant: 'display',
            width: '90px',
        }),
    ];
}

export function makeDriverColumns(year: string) {
    const columnBuilder = makeColumns<DriverStanding>();

    return [
        columnBuilder.ordinal({ header: 'POS', width: '46px' }),
        columnBuilder.competitor('name', {
            header: 'DRIVER',
            label: driver => (
                <>
                    {driver.name}
                    <span style={CODE_STYLE}>{driver.code}</span>
                </>
            ),
            link: driver => ({ params: { driverId: driver.id, year }, to: '/seasons/$year/drivers/$driverId' }),
            visual: driver => <TeamBar color={driver.constructor?.color ?? 'var(--neutral-500)'} size="md" />,
        }),
        columnBuilder.custom({
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
        columnBuilder.numeric('wins', {
            align: 'center',
            header: 'WINS',
            width: '70px',
        }),
        columnBuilder.numeric('podiums', {
            align: 'center',
            header: 'PODIUMS',
            width: '80px',
        }),
        columnBuilder.numeric('poles', {
            align: 'center',
            header: 'POLES',
            width: '80px',
        }),
        columnBuilder.numeric('points', {
            align: 'right',
            header: 'PTS',
            variant: 'display',
            width: '80px',
        }),
    ];
}
