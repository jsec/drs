import type { ListCircuitsResponse } from '#/lib/api/circuits.gen';

import { makeColumns } from '#/components/data-table';

type Circuit = ListCircuitsResponse[][number];

const col = makeColumns<Circuit>();

export const columns = [
    col.ordinal(),
    col.text('name', { header: 'CIRCUIT' }),
    col.text('location', { header: 'LOCATION', muted: true }),
    col.text('country', { header: 'COUNTRY', muted: true }),
    col.text('first_race', { header: 'FIRST RACE' }),
    col.text('last_race', { header: 'LAST RACE' }),
    col.text('race_count', { header: '# OF GRANDS PRIX', muted: true }),
];
