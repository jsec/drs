import type { FilterFn, SortingFn } from '@tanstack/react-table';

import type { DriverShortSummary } from '#/lib/api/drivers';

import { makeColumns } from '#/components/data-table';
import { DriverAvatar } from '#/components/f1-ui';
import { formatCareerYears } from '#/lib/format';

import { driverSummaryColor } from '../driver-summary';

const columnBuilder = makeColumns<DriverShortSummary>();

const byTitles: SortingFn<DriverShortSummary> = (a, b) =>
    a.original.championships - b.original.championships || a.original.wins - b.original.wins;

const byWins: SortingFn<DriverShortSummary> = (a, b) =>
    a.original.wins - b.original.wins || a.original.podiums - b.original.podiums;

export const matchesSearch: FilterFn<DriverShortSummary> = (row, _columnId, value: string) =>
    `${row.original.name} ${row.original.code}`.toLowerCase().includes(value.toLowerCase());

export const columns = [
    columnBuilder.ordinal(),
    columnBuilder.competitor('name', {
        header: 'DRIVER',
        label: driver => driver.name,
        link: driver => ({
            params: { driverId: driver.id },
            to: '/drivers/$driverId',
        }),
        sort: 'text',
        trailing: 'caret',
        visual: driver => <DriverAvatar code={driver.code} color={driverSummaryColor(driver)} />,
        width: '45%',
    }),
    columnBuilder.custom({
        accessor: driver => driver.firstYear,
        cell: info => (
            <span className="table-cell-num table-cell-sm">
                {formatCareerYears(info.row.original)}
            </span>
        ),
        header: 'YEARS',
        id: 'years',
        width: '11%',
    }),
    columnBuilder.numeric('starts', {
        align: 'center',
        header: 'STARTS',
        width: '8%',
    }),
    columnBuilder.numeric('wins', {
        align: 'center',
        header: 'WINS',
        sort: byWins,
        variant: 'display',
        width: '7%',
    }),
    columnBuilder.numeric('poles', {
        align: 'center',
        header: 'POLES',
        width: '7%',
    }),
    columnBuilder.numeric('podiums', {
        align: 'center',
        header: 'PODIUMS',
        width: '10%',
    }),
    columnBuilder.trophy('championships', {
        header: 'TITLES',
        id: 'titles',
        sort: byTitles,
        width: '8%',
    }),
];
