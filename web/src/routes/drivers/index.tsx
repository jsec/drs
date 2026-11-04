import { Card, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import type { DriverShortSummary } from '#/lib/api/drivers';

import { DataTable, SortSearchSchema, useDataTable, useUrlSorting } from '#/components/data-table';
import { Pill } from '#/components/f1-ui';
import { DriverShortSummaryListSchema } from '#/lib/api/drivers';
import { api } from '#/lib/query/api';

import { columns, matchesSearch } from './-components/drivers-table/columns';

type Category = 'active' | 'all' | 'champions';

const CATEGORIES: { key: Category; label: string }[] = [
    { key: 'all', label: 'All drivers' },
    { key: 'champions', label: 'World Champions' },
    { key: 'active', label: 'Active' },
];

const listDriversQuery = queryOptions({
    queryFn: () => api.get('drivers').json(DriverShortSummaryListSchema),
    queryKey: ['drivers'],
});

const CATEGORY_FILTERS = {
    active: (driver: DriverShortSummary) => driver.isActive,
    all: () => true,
    champions: (driver: DriverShortSummary) => driver.championships > 0,
} satisfies Record<Category, (driver: DriverShortSummary) => boolean>;

const DriversIndex = () => {
    const { data: drivers } = useSuspenseQuery(listDriversQuery);
    const { category = 'all' } = Route.useSearch();
    const navigate = Route.useNavigate();
    const { onSortingChange, sorting } = useUrlSorting();

    const { search, setSearch, table } = useDataTable({
        columns,
        data: drivers.filter(driver => CATEGORY_FILTERS[category](driver)),
        filter: matchesSearch,
        onSortingChange,
        sorting,
    });

    return (
        <div className="f1-page-stack">
            <div>
                <h1 className="f1-page-title">Drivers</h1>
                <div className="f1-page-description">
                    {'All-time index · career statistics across every season · '}
                    <strong>{table.getRowModel().rows.length}</strong>
                    {` of ${drivers.length} shown`}
                </div>
            </div>

            <div className="f1-toolbar">
                <TextInput
                    leftSection={<MagnifyingGlassIcon size={15} />}
                    onChange={event => setSearch(event.currentTarget.value)}
                    placeholder="Search name or code…"
                    value={search}
                    w={260}
                />

                <div className="f1-control-group">
                    {CATEGORIES.map(option => (
                        <Pill
                            isActive={category === option.key}
                            key={option.key}
                            onClick={() => void navigate({ search: previous => ({ ...previous, category: option.key }) })}
                        >
                            {option.label}
                        </Pill>
                    ))}
                </div>
            </div>

            <Card className="f1-table-card">
                <DataTable table={table} />
            </Card>
        </div>
    );
};

export const Route = createFileRoute('/drivers/')({
    component: DriversIndex,
    validateSearch: SortSearchSchema.extend({
        category: z.enum(['active', 'all', 'champions']).optional().catch(undefined),
    }),
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(listDriversQuery);

        return { crumbs: [{ label: 'Drivers' }] };
    },
});
