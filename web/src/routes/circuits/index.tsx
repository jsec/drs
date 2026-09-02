import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { readSortSearch } from '#/components/data-table';
import { CircuitListSchema } from '#/lib/api/circuits';
import { api } from '#/lib/query/api';

import { CircuitsTable } from './-components/circuits-table';
import { SORT_IDS } from './-components/circuits-table/columns';

const listCircuitsQuery = queryOptions({
    queryFn: () => api.get('circuits').json(CircuitListSchema),
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
