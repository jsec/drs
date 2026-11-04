import type { CircuitListItem } from '#/lib/api/circuits';

import { makeColumns } from '#/components/data-table';

const columnBuilder = makeColumns<CircuitListItem>();

export const columns = [
    columnBuilder.ordinal(),
    columnBuilder.text('name', {
        header: 'CIRCUIT',
        isBold: true,
        link: circuit => ({ params: { circuitId: circuit.circuitId }, to: '/circuits/$circuitId' }),
        sort: 'text',
        width: '19%',
    }),
    columnBuilder.text('location', {
        header: 'LOCATION',
        isMuted: true,
        width: '19%',
    }),
    columnBuilder.text('country', {
        header: 'COUNTRY',
        isMuted: true,
        sort: 'text',
        width: '21%',
    }),
    columnBuilder.numeric('firstRaceYear', {
        align: 'center',
        header: 'FIRST RACE',
        size: 'sm',
        sort: 'basic',
        width: '12%',
    }),
    columnBuilder.numeric('lastRaceYear', {
        align: 'center',
        header: 'LAST RACE',
        size: 'sm',
        sort: 'basic',
        width: '12%',
    }),
    columnBuilder.numeric('raceCount', {
        align: 'center',
        header: 'GRANDS PRIX',
        width: '13%',
    }),
];
