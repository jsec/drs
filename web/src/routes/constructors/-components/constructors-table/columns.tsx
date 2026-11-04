import type { SortingFn } from '@tanstack/react-table';

import { Progress } from '@mantine/core';

import type { Constructor } from '#/lib/api/constructors';

import { makeColumns } from '#/components/data-table';
import { formatCareerYears } from '#/lib/format';

const columnBuilder = makeColumns<Constructor>();

const byTitles: SortingFn<Constructor> = (a, b) =>
    a.original.championships - b.original.championships || a.original.wins - b.original.wins;

export function makeConstructorColumns(maxWins: number) {
    return [
        columnBuilder.ordinal(),
        columnBuilder.competitor('name', {
            header: 'CONSTRUCTOR',
            label: team => team.name,
            link: team => ({ params: { constructorId: team.id }, to: '/constructors/$constructorId' }),
            trailing: 'caret',
            visual: team => (
                <span style={{
                    background: team.color,
                    borderRadius: 3,
                    flexShrink: 0,
                    height: 26,
                    width: 6,
                }}
                />
            ),
            width: '38%',
        }),
        columnBuilder.custom({
            accessor: team => team.firstRaceDate,
            cell: (info) => {
                const team = info.row.original;
                const years = formatCareerYears({
                    firstYear: team.firstRaceDate ? Temporal.PlainDate.from(team.firstRaceDate).year : null,
                    isActive: false,
                    lastYear: team.lastRaceDate ? Temporal.PlainDate.from(team.lastRaceDate).year : null,
                });

                return <span className="table-cell-num table-cell-sm">{years}</span>;
            },
            header: 'YEARS',
            id: 'years',
            width: '10%',
        }),
        columnBuilder.trophy('championships', {
            header: 'TITLES',
            id: 'titles',
            sort: byTitles,
            width: '9%',
        }),
        columnBuilder.custom({
            accessor: team => team.wins,
            cell: (info) => {
                const team = info.row.original;

                return (
                    <div style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'nowrap',
                        gap: 10,
                    }}
                    >
                        <span className="table-cell-num table-cell-num-display" style={{ width: 34 }}>
                            {team.wins}
                        </span>
                        <Progress color={team.color} flex={1} maw={150} size={6} value={(team.wins / maxWins) * 100} />
                    </div>
                );
            },
            header: 'WINS',
            id: 'wins',
            isDescFirst: true,
            width: '23%',
        }),
        columnBuilder.numeric('podiums', {
            align: 'center',
            header: 'PODIUMS',
            width: '8%',
        }),
    ];
}
