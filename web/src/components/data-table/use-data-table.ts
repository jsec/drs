import type { ColumnDef, FilterFn, OnChangeFn, RowData, SortingState } from '@tanstack/react-table';

import {
    columnFilteringFeature,
    createFilteredRowModel,
    createSortedRowModel,
    globalFilteringFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_basic,
    sortFn_text,
    tableFeatures,
    useTable,
} from '@tanstack/react-table';
import { useDeferredValue, useState } from 'react';

const features = tableFeatures({
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    globalFilteringFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        basic: sortFn_basic,
        text: sortFn_text,
    },
});

export type Features = typeof features;

type UseDataTableOptions<T extends RowData> = {
    columns: ColumnDef<Features, T, unknown>[];
    data: T[];
    filter?: FilterFn<Features, T>;
    onSortingChange?: OnChangeFn<SortingState>;
    sorting?: SortingState;
};

export function useDataTable<T extends RowData>({
    columns,
    data,
    filter,
    onSortingChange,
    sorting,
}: UseDataTableOptions<T>) {
    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);
    const [localSorting, setLocalSorting] = useState<SortingState>([]);

    const table = useTable({
        columns,
        data,
        enableMultiSort: false,
        features,
        globalFilterFn: filter,
        onSortingChange: onSortingChange ?? setLocalSorting,
        state: {
            globalFilter: filter ? deferredSearch : undefined,
            sorting: sorting ?? localSorting,
        },
    });

    return {
        search,
        setSearch,
        table,
    };
}
