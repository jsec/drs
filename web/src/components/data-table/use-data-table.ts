import type { ColumnDef, FilterFn, OnChangeFn, SortingState } from '@tanstack/react-table';

import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useDeferredValue, useState } from 'react';

type UseDataTableOptions<T> = {
    columns: ColumnDef<T, unknown>[];
    data: T[];
    filter?: FilterFn<T>;
    onSortingChange?: OnChangeFn<SortingState>;
    sorting?: SortingState;
};

export function useDataTable<T>({
    columns,
    data,
    filter,
    onSortingChange,
    sorting,
}: UseDataTableOptions<T>) {
    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);

    const table = useReactTable<T>({
        columns,
        data,
        enableMultiSort: false,
        enableSortingRemoval: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: filter ? getFilteredRowModel() : undefined,
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: filter,
        ...(onSortingChange && { onSortingChange }),
        state: {
            globalFilter: filter ? deferredSearch : undefined,
            ...(sorting && { sorting }),
        },
    });

    return { search, setSearch, table };
}
