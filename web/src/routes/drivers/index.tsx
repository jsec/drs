import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { allTimeDriversQuery } from '#/data/queries';

import type { Category, Sort } from './-components/drivers-table';

import { CATEGORIES, DriversTable, SORTS } from './-components/drivers-table';

const DriversIndex = () => {
    const { data } = useSuspenseQuery(allTimeDriversQuery());
    return <DriversTable drivers={data} />;
};

export const Route = createFileRoute('/drivers/')({
    component: DriversIndex,
    validateSearch: (s: Record<string, unknown>): { category?: Category; sort?: Sort } => ({
        category: CATEGORIES.some(c => c.key === s.category) ? (s.category as Category) : undefined,
        sort: SORTS.some(so => so.key === s.sort) ? (s.sort as Sort) : undefined,
    }),
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(allTimeDriversQuery());
        return { crumbs: [{ label: 'Drivers' }] };
    },
});
