import type { ListSeasonsResponse } from '#/lib/api/types';

import { CountryFlag } from '#/components/country-flag';
import { makeColumns } from '#/components/data-table';
import { TeamSquare } from '#/components/f1-ui';

export type Season = ListSeasonsResponse[number];

const col = makeColumns<Season>();

export const columns = [
    col.num('season', {
        header: 'SEASON',
        link: s => ({ params: { year: String(s.season) }, to: '/seasons/$year' }),
        size: 'lg',
        variant: 'display',
        width: '12%',
    }),
    col.num('raceCount', { align: 'center', header: 'RACES', width: '10%' }),
    col.competitor('wdc', {
        header: 'WORLD CHAMPION',
        label: s => s.wdc.name,
        visual: s => <CountryFlag aria-hidden className="season-champion-flag" code={s.wdc.countryCode} />,
        width: '39%',
    }),
    col.custom({
        cell: (info) => {
            const { wcc } = info.row.original;
            if (!wcc) {
                return <span className="table-cell-text table-cell-text-muted">—</span>;
            }
            return (
                <span className="table-cell-entity">
                    <TeamSquare color={wcc.color} />
                    <span className="table-cell-entity-label">{wcc.name}</span>
                </span>
            );
        },
        header: 'CONSTRUCTORS\' CHAMPION',
        id: 'wcc',
        width: '39%',
    }),
];
