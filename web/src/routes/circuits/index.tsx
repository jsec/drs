import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { ListCircuitsResponse } from '#/lib/api/circuits.gen';

import { api } from '#/lib/query/api';

import { CircuitsTable, type SortKey, SORTS } from './-components/circuits-table';

const listCircuitsQuery = queryOptions({
    queryFn: () => api.get('circuits').json<ListCircuitsResponse[]>(),
    queryKey: ['circuits'],
});

const Circuits = () => {
    const { data } = useSuspenseQuery(listCircuitsQuery);
    return <CircuitsTable circuits={data} />;
};

export const Route = createFileRoute('/circuits/')({
    component: Circuits,
    validateSearch: (s: Record<string, unknown>): { sort?: SortKey } => ({
        sort: SORTS.some(so => so.key === s.sort) ? (s.sort as SortKey) : undefined,
    }),
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(listCircuitsQuery);
        return { crumbs: [{ label: 'Circuits' }] };
    },
});
