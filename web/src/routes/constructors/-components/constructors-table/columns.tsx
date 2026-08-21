import type { SortingFn } from '@tanstack/react-table';

import type { ListConstructorsResponse } from '#/lib/api/types';

import { makeColumns } from '#/components/data-table';
import { cn } from '#/lib/utils';

type Constructor = ListConstructorsResponse[number];

const col = makeColumns<Constructor>();

export const SORT_IDS = ['name', 'years', 'titles', 'wins', 'podiums'] as const;

const byTitles: SortingFn<Constructor> = (a, b) =>
    a.original.championships - b.original.championships || a.original.wins - b.original.wins;

export function makeConstructorColumns(maxWins: number) {
    return [
        col.ordinal(),
        col.competitor('name', {
            header: 'CONSTRUCTOR',
            label: c => c.name,
            visual: c => (
                <span style={{ background: c.color, borderRadius: 3, flexShrink: 0, height: 26, width: 6 }} />
            ),
            width: '38%',
        }),
        col.custom({
            accessor: c => c.firstRaceDate,
            cell: (info) => {
                const { firstRaceDate, lastRaceDate } = info.row.original;

                let years = '-';
                if (firstRaceDate) {
                    const firstYear = Temporal.PlainDate.from(firstRaceDate).year;
                    const lastYear = lastRaceDate ? Temporal.PlainDate.from(lastRaceDate).year : '';
                    years = `${firstYear}-${lastYear}`;
                }

                return <span className={cn('table-cell-num', 'table-cell-sm')}>{years}</span>;
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
                        <span className={cn('table-cell-num', 'table-cell-num-display')} style={{ width: 34 }}>
                            {c.wins}
                        </span>
                        <div style={{ background: 'var(--mantine-color-default-border)', borderRadius: 9999, flex: 1, height: 6, maxWidth: 150, overflow: 'hidden' }}>
                            <div style={{ background: c.color, borderRadius: 9999, height: '100%', width: `${(c.wins / maxWins) * 100}%` }} />
                        </div>
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
