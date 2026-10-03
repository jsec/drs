import type { OnChangeFn, SortingState } from '@tanstack/react-table';

import { z } from 'zod';

export const SortSearchSchema = z.object({
    dir: z.enum(['asc', 'desc']).optional().catch(undefined),
    sort: z.string().optional().catch(undefined),
});

export type SortingRoute = {
    useNavigate: () => (opts: {
        search: (prev: Record<string, unknown>) => Record<string, unknown>;
    }) => unknown;
    useSearch: () => SortSearch;
};

export type SortSearch = z.infer<typeof SortSearchSchema>;

export function useUrlSorting(route: SortingRoute) {
    const { dir, sort } = route.useSearch();
    const navigate = route.useNavigate();

    const sorting: SortingState = sort ? [{ desc: dir === 'desc', id: sort }] : [];

    const onSortingChange: OnChangeFn<SortingState> = (updater) => {
        const next = typeof updater === 'function' ? updater(sorting) : updater;
        const entry = next[0];

        void navigate({
            search: prev => ({
                ...prev,
                dir: entry && (entry.desc ? 'desc' : 'asc'),
                sort: entry?.id,
            }),
        });
    };

    return { onSortingChange, sorting };
}
