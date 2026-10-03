import { createFileRoute } from '@tanstack/react-router';

import { seasonCalendarQuery, seasonOverviewQuery } from '#/data/queries';
import { CURRENT_YEAR } from '#/lib/route-params';

import { Overview } from './-components/overview';

export const Route = createFileRoute('/')({
    component: Overview,
    loader: async ({ context }) => {
        await Promise.all([
            context.queryClient.ensureQueryData(seasonOverviewQuery(CURRENT_YEAR)),
            context.queryClient.ensureQueryData(seasonCalendarQuery(CURRENT_YEAR)),
        ]);
        return { crumbs: [{ label: 'Overview' }] };
    },
});
