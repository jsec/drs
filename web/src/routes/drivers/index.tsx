import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { SortSearch } from '#/components/data-table';
import type { DriverShortSummary } from '#/lib/api/drivers.gen';

import { readSortSearch } from '#/components/data-table';
import { api } from '#/lib/query/api';

import type { Category } from './-components/drivers-table';

import { CATEGORIES, DriversTable } from './-components/drivers-table';
import { SORT_IDS } from './-components/drivers-table/columns';

const listDriversQuery = queryOptions({
    queryFn: () => api.get('drivers').json<DriverShortSummary[]>(),
    queryKey: ['drivers'],
});

const DriversIndex = () => {
    const { data } = useSuspenseQuery(listDriversQuery);
    return <DriversTable drivers={data} />;
};

export const Route = createFileRoute('/drivers/')({
    component: DriversIndex,
    validateSearch: (s: Record<string, unknown>): SortSearch & { category?: Category } => ({
        category: CATEGORIES.some(c => c.key === s.category) ? (s.category as Category) : undefined,
        ...readSortSearch(SORT_IDS)(s),
    }),
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(listDriversQuery);
        return { crumbs: [{ label: 'Drivers' }] };
    },
});
