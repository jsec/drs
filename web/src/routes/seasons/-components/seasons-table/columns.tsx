import type { Season } from '#/lib/api/seasons';

import { CountryFlag } from '#/components/country-flag';
import { makeColumns } from '#/components/data-table';
import { TeamSquare } from '#/components/f1-ui';

const columnBuilder = makeColumns<Season>();

export const columns = [
    columnBuilder.numeric('season', {
        header: 'SEASON',
        link: season => ({ params: { year: String(season.season) }, to: '/seasons/$year' }),
        size: 'lg',
        variant: 'display',
        width: '12%',
    }),
    columnBuilder.numeric('raceCount', {
        align: 'center',
        header: 'RACES',
        width: '10%',
    }),
    columnBuilder.competitor('wdc', {
        accessor: season => season.wdc.name,
        header: 'WORLD CHAMPION',
        label: season => season.wdc.name,
        visual: season => <CountryFlag aria-hidden className="season-champion-flag" code={season.wdc.countryCode} />,
        width: '39%',
    }),
    columnBuilder.custom({
        accessor: season => season.wcc?.name ?? '',
        cell: (info) => {
            const season = info.row.original;
            if (!season.wcc) {
                return <span className="table-cell-text table-cell-text-muted">—</span>;
            }

            return (
                <span className="table-cell-entity">
                    <TeamSquare color={season.wcc.color} />
                    <span className="table-cell-entity-label">{season.wcc.name}</span>
                </span>
            );
        },
        header: 'CONSTRUCTORS\' CHAMPION',
        id: 'wcc',
        width: '39%',
    }),
];
