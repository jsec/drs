import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table';

import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useDeferredValue, useMemo, useState } from 'react';

type UseDataTableOptions<T> = {
    columns: ColumnDef<T, unknown>[];
    data: T[];
    filter?: FilterFn<T>;
    sorting?: SortingState;
};

export function useDataTable<T>({ columns, data, filter, sorting }: UseDataTableOptions<T>) {
    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);

    const coreRowModel = useMemo(() => getCoreRowModel<T>(), []);
    const filteredRowModel = useMemo(() => getFilteredRowModel<T>(), []);
    const sortedRowModel = useMemo(() => getSortedRowModel<T>(), []);

    const table = useReactTable<T>({
        columns,
        data,
        getCoreRowModel: coreRowModel,
        getFilteredRowModel: filter ? filteredRowModel : undefined,
        getSortedRowModel: sorting ? sortedRowModel : undefined,
        globalFilterFn: filter,
        state: {
            globalFilter: filter ? deferredSearch : undefined,
            sorting,
        },
    });

    return { search, setSearch, table };
}
