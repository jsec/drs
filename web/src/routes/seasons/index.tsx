import { Card } from '@mantine/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { DataTable, SortSearchSchema, useDataTable, useUrlSorting } from '#/components/data-table';
import { SeasonListSchema } from '#/lib/api/seasons';
import { api } from '#/lib/query/api';

import { columns } from './-components/seasons-table/columns';
import './-components/seasons-table/seasons-table.css';

const seasonsQuery = queryOptions({
    queryFn: () => api.get('seasons').json(SeasonListSchema),
    queryKey: ['seasons'],
});

const Seasons = () => {
    const { data: seasons } = useSuspenseQuery(seasonsQuery);
    const { onSortingChange, sorting } = useUrlSorting();
    const { table } = useDataTable({ columns, data: seasons, onSortingChange, sorting });

    return (
        <div className="f1-page-stack">
            <div>
                <h1 className="f1-page-title">Seasons</h1>
                <div className="f1-page-description">Browse championship seasons and their results</div>
            </div>

            <Card className="f1-table-card">
                <DataTable table={table} />
            </Card>
        </div>
    );
};

export const Route = createFileRoute('/seasons/')({
    component: Seasons,
    validateSearch: SortSearchSchema,
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(seasonsQuery);
        return { crumbs: [{ label: 'Seasons' }] };
    },
});
