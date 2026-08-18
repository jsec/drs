import type { ListCircuitsResponse } from '#/lib/api/circuits.gen';

import { makeColumns } from '#/components/data-table';

type Circuit = ListCircuitsResponse;

const col = makeColumns<Circuit>();

export const columns = [
    col.ordinal(),
    col.text('name', { header: 'CIRCUIT', sort: 'text', width: '21%' }),
    col.text('location', { fallback: '—', header: 'LOCATION', muted: true, width: '19%' }),
    col.text('country', { header: 'COUNTRY', muted: true, sort: 'text', width: '21%' }),
    col.num('first_race_year', { align: 'center', header: 'FIRST RACE', size: 'sm', sort: 'basic', width: '12%' }),
    col.num('last_race_year', { align: 'center', header: 'LAST RACE', size: 'sm', sort: 'basic', width: '12%' }),
    col.num('race_count', { align: 'center', header: 'GRANDS PRIX', width: '11%' }),
];
