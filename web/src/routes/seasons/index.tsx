import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { ListSeasonsResponse } from '#/lib/api/types';

import { Card } from '#/components/ui/card';
import { api } from '#/lib/query/api';

import { SeasonsTable } from './-components/seasons-table';

const seasonsQuery = queryOptions({
    queryFn: () => api.get('seasons').json<ListSeasonsResponse>(),
    queryKey: ['seasons'],
});

const Seasons = () => {
    const { data: seasons } = useSuspenseQuery(seasonsQuery);

    return (
        <div className="f1-page-stack">
            <div>
                <h1 className="f1-page-title">Seasons</h1>
                <div className="f1-page-description">Browse championship seasons and their results</div>
            </div>

            <Card className="f1-table-card">
                <SeasonsTable seasons={seasons} />
            </Card>
        </div>
    );
};

export const Route = createFileRoute('/seasons/')({
    component: Seasons,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(seasonsQuery);
        return { crumbs: [{ label: 'Seasons' }] };
    },
});
