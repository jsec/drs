import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { SortSearchSchema } from '#/components/data-table';
import { DriverShortSummaryListSchema } from '#/lib/api/drivers';
import { api } from '#/lib/query/api';

import { DriversTable } from './-components/drivers-table';

const listDriversQuery = queryOptions({
    queryFn: () => api.get('drivers').json(DriverShortSummaryListSchema),
    queryKey: ['drivers'],
});

const DriversIndex = () => {
    const { data } = useSuspenseQuery(listDriversQuery);
    return <DriversTable drivers={data} />;
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
