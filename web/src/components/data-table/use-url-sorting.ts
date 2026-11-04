import type { OnChangeFn, SortingState } from '@tanstack/react-table';

import { useNavigate, useSearch } from '@tanstack/react-router';
import { functionalUpdate } from '@tanstack/react-table';
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
        const entry = functionalUpdate(updater, sorting)[0];

        if (!entry) {
            void navigate({
                search: previousSearch => ({
                    ...previousSearch,
                    dir: undefined,
                    sort: undefined,
                }),
                to: '.',
            });

            return;
        }

        const dir = entry.desc ? 'desc' : 'asc';

        void navigate({
            search: previousSearch => ({
                ...previousSearch,
                dir,
                sort: entry.id,
            }),
            to: '.',
        });
    };

    return { onSortingChange, sorting };
}
