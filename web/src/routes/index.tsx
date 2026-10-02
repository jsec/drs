import { createFileRoute } from '@tanstack/react-router';

import { seasonCalendarQuery, seasonStandingsQuery } from '#/data/queries';
import { CURRENT_YEAR } from '#/lib/route-params';

import { Overview } from './-components/overview';

export const Route = createFileRoute('/')({
    component: Overview,
    loader: async ({ context }) => {
        await Promise.all([
            context.queryClient.ensureQueryData(seasonStandingsQuery(CURRENT_YEAR)),
            context.queryClient.ensureQueryData(seasonCalendarQuery(CURRENT_YEAR)),
        ]);
        return { crumbs: [{ label: 'Overview' }] };
    },
});
