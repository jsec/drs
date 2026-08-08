import { createFileRoute } from '@tanstack/react-router';

import { CURRENT_YEAR } from '#/data/fixtures';
import { standingsQuery } from '#/data/queries';

import { Overview } from './-components/overview';

export const Route = createFileRoute('/')({
    component: Overview,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(standingsQuery(CURRENT_YEAR));
        return { crumbs: [{ label: 'Overview' }] };
    },
});
