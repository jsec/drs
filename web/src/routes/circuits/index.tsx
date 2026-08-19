import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { ListCircuitsResponse } from '#/lib/api/circuits.gen';

import { readSortSearch } from '#/components/data-table';
import { api } from '#/lib/query/api';

import { CircuitsTable } from './-components/circuits-table';
import { SORT_IDS } from './-components/circuits-table/columns';

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
    validateSearch: readSortSearch(SORT_IDS),
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(listCircuitsQuery);
        return { crumbs: [{ label: 'Circuits' }] };
    },
});
