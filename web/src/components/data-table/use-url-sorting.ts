import type { OnChangeFn, SortingState } from '@tanstack/react-table';

import { useCallback, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export type SortSearch = {
    dir?: SortDirection;
    sort?: string;
};

type SortingRoute = {
    useNavigate: () => (opts: {
        search: (prev: Record<string, unknown>) => Record<string, unknown>;
    }) => unknown;
    useSearch: () => SortSearch;
};

export function useUrlSorting(route: SortingRoute) {
    const { dir, sort } = route.useSearch();
    const navigate = route.useNavigate();

    const sorting = useMemo<SortingState>(
        () => (sort ? [{ desc: dir === 'desc', id: sort }] : []),
        [dir, sort],
    );

    const onSortingChange = useCallback<OnChangeFn<SortingState>>(
        (updater) => {
            const next = typeof updater === 'function' ? updater(sorting) : updater;
            const entry = next[0];

            void navigate({
                search: prev => ({
                    ...prev,
                    dir: entry && (entry.desc ? 'desc' : 'asc'),
                    sort: entry?.id,
                }),
            });
        },
        [navigate, sorting],
    );

    return { onSortingChange, sorting };
}
