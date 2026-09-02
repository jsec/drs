import type { FilterFn, SortingFn } from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';

import type { DriverShortSummary } from '#/lib/api/drivers.gen';

import { makeColumns } from '#/components/data-table';
import { DriverAvatar } from '#/components/f1-ui';

const col = makeColumns<DriverShortSummary>();

export const SORT_IDS = ['name', 'years', 'starts', 'wins', 'poles', 'podiums', 'titles'] as const;

const byTitles: SortingFn<DriverShortSummary> = (a, b) =>
    a.original.championships - b.original.championships || a.original.wins - b.original.wins;

const byWins: SortingFn<DriverShortSummary> = (a, b) =>
    a.original.wins - b.original.wins || a.original.podiums - b.original.podiums;

export const formatYears = ({ firstYear, isActive, lastYear }: DriverShortSummary) => {
    if (!firstYear) {
        return '-';
    }

    if (isActive || !lastYear) {
        return `${firstYear}-`;
    }

    return `${firstYear}–${lastYear}`;
};

export const fuzzy: FilterFn<DriverShortSummary> = (row, _columnId, value, addMeta) => {
    const ranked = rankItem(`${row.original.name} ${row.original.code}`, value as string);
    addMeta({ itemRank: ranked });
    return ranked.passed;
};

export const columns = [
    col.ordinal(),
    col.competitor('name', {
        header: 'DRIVER',
        label: d => d.name,
        link: d => ({
            params: { driverId: d.id },
            to: '/drivers/$driverId',
        }),
        sort: 'text',
        trailing: 'caret',
        visual: d => <DriverAvatar code={d.code} color={d.constructorColor} />,
        width: '45%',
    }),
    col.custom({
        accessor: d => d.firstYear,
        cell: info => (
            <span className="table-cell-num table-cell-sm">
                {formatYears(info.row.original)}
            </span>
        ),
        header: 'YEARS',
        id: 'years',
        width: '11%',
    }),
    col.num('starts', { align: 'center', header: 'STARTS', width: '8%' }),
    col.num('wins', { align: 'center', header: 'WINS', sort: byWins, variant: 'display', width: '7%' }),
    col.num('poles', { align: 'center', header: 'POLES', width: '7%' }),
    col.num('podiums', { align: 'center', header: 'PODIUMS', width: '10%' }),
    col.trophy('championships', { header: 'TITLES', id: 'titles', sort: byTitles, width: '8%' }),
];
