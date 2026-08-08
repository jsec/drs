import type { FilterFn, SortingFn } from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';

import type { AllTimeDriver } from '#/data/types';

import { makeColumns } from '#/components/data-table';
import { DriverAvatar } from '#/components/f1-ui';

const col = makeColumns<AllTimeDriver>();

const byTitles: SortingFn<AllTimeDriver> = (a, b) =>
    a.original.titles - b.original.titles || a.original.wins - b.original.wins;

const byWins: SortingFn<AllTimeDriver> = (a, b) =>
    a.original.wins - b.original.wins || a.original.podiums - b.original.podiums;

export const fuzzy: FilterFn<AllTimeDriver> = (row, _columnId, value, addMeta) => {
    const ranked = rankItem(`${row.original.name} ${row.original.nat}`, value as string);
    addMeta({ itemRank: ranked });
    return ranked.passed;
};

export const columns = [
    col.ordinal(),
    col.competitor('name', {
        header: 'DRIVER',
        label: d => d.name,
        link: d => ({ params: { driverId: d.id }, to: '/drivers/$driverId' }),
        sort: 'text',
        trailing: 'caret',
        visual: d => <DriverAvatar code={d.code} color={d.color} />,
        width: '45%',
    }),
    col.num('years', { header: 'YEARS', size: 'sm', width: '11%' }),
    col.num('starts', { align: 'center', header: 'STARTS', width: '8%' }),
    col.num('wins', { align: 'center', header: 'WINS', sort: byWins, variant: 'display', width: '7%' }),
    col.num('poles', { align: 'center', header: 'POLES', width: '7%' }),
    col.num('podiums', { align: 'center', header: 'PODIUMS', width: '10%' }),
    col.trophy('titles', { header: 'TITLES', sort: byTitles, width: '8%' }),
];
