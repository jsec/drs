import type { SortingFn } from '@tanstack/react-table';

import { Progress } from '@mantine/core';

import type { ListConstructorsResponse } from '#/lib/api/constructors';

import { makeColumns } from '#/components/data-table';
import { formatCareerYears } from '#/lib/format';

type Constructor = ListConstructorsResponse[number];

const col = makeColumns<Constructor>();

const byTitles: SortingFn<Constructor> = (a, b) =>
    a.original.championships - b.original.championships || a.original.wins - b.original.wins;

export function makeConstructorColumns(maxWins: number) {
    return [
        col.ordinal(),
        col.competitor('name', {
            header: 'CONSTRUCTOR',
            label: c => c.name,
            link: c => ({ params: { constructorId: c.id }, to: '/constructors/$constructorId' }),
            trailing: 'caret',
            visual: c => (
                <span style={{ background: c.color, borderRadius: 3, flexShrink: 0, height: 26, width: 6 }} />
            ),
            width: '38%',
        }),
        col.custom({
            accessor: c => c.firstRaceDate,
            cell: (info) => {
                const { firstRaceDate, lastRaceDate } = info.row.original;
                const years = formatCareerYears({
                    firstYear: firstRaceDate ? Temporal.PlainDate.from(firstRaceDate).year : null,
                    isActive: false,
                    lastYear: lastRaceDate ? Temporal.PlainDate.from(lastRaceDate).year : null,
                });

                return <span className="table-cell-num table-cell-sm">{years}</span>;
            },
            header: 'YEARS',
            id: 'years',
            width: '10%',
        }),
        col.trophy('championships', { header: 'TITLES', id: 'titles', sort: byTitles, width: '9%' }),
        col.custom({
            accessor: c => c.wins,
            cell: (info) => {
                const c = info.row.original;
                return (
                    <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 10 }}>
                        <span className="table-cell-num table-cell-num-display" style={{ width: 34 }}>
                            {c.wins}
                        </span>
                        <Progress color={c.color} flex={1} maw={150} size={6} value={(c.wins / maxWins) * 100} />
                    </div>
                );
            },
            descFirst: true,
            header: 'WINS',
            id: 'wins',
            width: '23%',
        }),
        col.num('podiums', { align: 'center', header: 'PODIUMS', width: '8%' }),
    ];
}
