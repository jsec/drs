import { Card } from '@mantine/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { DataTable, SortSearchSchema, useDataTable, useUrlSorting } from '#/components/data-table';
import { ConstructorListSchema } from '#/lib/api/constructors';
import { api } from '#/lib/query/api';

import { makeConstructorColumns } from './-components/constructors-table/columns';

const constructorsQuery = queryOptions({
    queryFn: () => api.get('constructors').json(ConstructorListSchema),
    queryKey: ['constructors'],
});

const Constructors = () => {
    const { data: constructors } = useSuspenseQuery(constructorsQuery);
    const columns = makeConstructorColumns(Math.max(...constructors.map(c => c.wins)));
    const { onSortingChange, sorting } = useUrlSorting();
    const { table } = useDataTable({ columns, data: constructors, onSortingChange, sorting });

    return (
        <div className="f1-page-stack">
            <div className="f1-page-header">
                <div>
                    <h1 className="f1-page-title">Constructors</h1>
                    <div className="f1-page-description">
                        All-time index · Constructors&apos; Championships and records since 1958
                    </div>
                </div>
            </div>

            <Card className="f1-table-card">
                <DataTable px={20} table={table} />
            </Card>
        </div>
    );
};

export const Route = createFileRoute('/constructors/')({
    component: Constructors,
    validateSearch: SortSearchSchema,
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(constructorsQuery);
        return { crumbs: [{ label: 'Constructors' }] };
    },
});
