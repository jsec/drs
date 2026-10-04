import type { OnChangeFn, SortingState } from '@tanstack/react-table';

import { useNavigate, useSearch } from '@tanstack/react-router';
import { z } from 'zod';

export const SortSearchSchema = z.object({
    dir: z.enum(['asc', 'desc']).optional().catch(undefined),
    sort: z.string().optional().catch(undefined),
});

export function useUrlSorting() {
    const { dir, sort } = useSearch({ strict: false });
    const navigate = useNavigate();

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
            to: '.',
        });
    };

    return { onSortingChange, sorting };
}
