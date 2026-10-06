import { Card } from '@mantine/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { DataTable, SortSearchSchema, useDataTable, useUrlSorting } from '#/components/data-table';
import { CircuitListSchema } from '#/lib/api/circuits';
import { api } from '#/lib/query/api';

import { columns } from './-components/circuits-table/columns';

const listCircuitsQuery = queryOptions({
    queryFn: () => api.get('circuits').json(CircuitListSchema),
    queryKey: ['circuits'],
});

const Circuits = () => {
    const { data: circuits } = useSuspenseQuery(listCircuitsQuery);
    const { onSortingChange, sorting } = useUrlSorting();
    const { table } = useDataTable({ columns, data: circuits, onSortingChange, sorting });

    return (
        <div className="f1-page-stack">
            <div className="f1-page-header">
                <div>
                    <h1 className="f1-page-title">Circuits</h1>
                    <div className="f1-page-description">All-time circuit index</div>
                </div>
            </div>

            <Card className="f1-table-card">
                <DataTable px={20} table={table} />
            </Card>
        </div>
    );
};

export const Route = createFileRoute('/circuits/')({
    component: Circuits,
    validateSearch: SortSearchSchema,
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(listCircuitsQuery);
        return { crumbs: [{ label: 'Circuits' }] };
    },
});
