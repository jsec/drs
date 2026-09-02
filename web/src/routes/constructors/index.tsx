import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { readSortSearch } from '#/components/data-table';
import { ConstructorListSchema } from '#/lib/api/constructors';
import { api } from '#/lib/query/api';

import { ConstructorsTable } from './-components/constructors-table';
import { SORT_IDS } from './-components/constructors-table/columns';

const constructorsQuery = queryOptions({
    queryFn: () => api.get('constructors').json(ConstructorListSchema),
    queryKey: ['constructors'],
});

const Constructors = () => {
    const { data } = useSuspenseQuery(constructorsQuery);
    return <ConstructorsTable constructors={data} />;
};

export const Route = createFileRoute('/constructors/')({
    component: Constructors,
    validateSearch: readSortSearch(SORT_IDS),
    // eslint-disable-next-line perfectionist/sort-objects -- keep TanStack Router's dependency order (validateSearch before loader)
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(constructorsQuery);
        return { crumbs: [{ label: 'Constructors' }] };
    },
});
