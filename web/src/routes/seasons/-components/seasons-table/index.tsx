import { getRouteApi } from '@tanstack/react-router';

import type { ListSeasonsResponse } from '#/lib/api/seasons';

import { DataTable, useDataTable, useUrlSorting } from '#/components/data-table';

import { columns } from './columns';
import './seasons-table.css';

const route = getRouteApi('/seasons/');

type Props = {
    seasons: ListSeasonsResponse;
};

export const SeasonsTable = ({ seasons }: Props) => {
    const { onSortingChange, sorting } = useUrlSorting(route);
    const { table } = useDataTable({ columns, data: seasons, onSortingChange, sorting });

    return <DataTable table={table} />;
};
