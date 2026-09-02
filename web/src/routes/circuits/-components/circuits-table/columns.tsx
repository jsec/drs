import type { ListCircuitsResponse } from '#/lib/api/circuits';

import { makeColumns } from '#/components/data-table';

type Circuit = ListCircuitsResponse;

const col = makeColumns<Circuit>();

export const SORT_IDS = [
    'name',
    'location',
    'country',
    'firstRaceYear',
    'lastRaceYear',
    'raceCount',
] as const;

export const columns = [
    col.ordinal(),
    col.text('name', {
        bold: true,
        header: 'CIRCUIT',
        link: c => ({ params: { circuitId: c.circuitId }, to: '/circuits/$circuitId' }),
        sort: 'text',
        width: '19%',
    }),
    col.text('location', { fallback: '—', header: 'LOCATION', muted: true, width: '19%' }),
    col.text('country', { header: 'COUNTRY', muted: true, sort: 'text', width: '21%' }),
    col.num('firstRaceYear', { align: 'center', header: 'FIRST RACE', size: 'sm', sort: 'basic', width: '12%' }),
    col.num('lastRaceYear', { align: 'center', header: 'LAST RACE', size: 'sm', sort: 'basic', width: '12%' }),
    col.num('raceCount', { align: 'center', header: 'GRANDS PRIX', width: '13%' }),
];
