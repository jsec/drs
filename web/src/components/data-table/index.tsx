import type { LinkProps } from '@tanstack/react-router';
import type { RowData, Table } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { Table as TablePrimitive } from '@mantine/core';
import { CaretDownIcon, CaretRightIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { flexRender } from '@tanstack/react-table';

import { cn } from '#/lib/utils';

import './data-table.css';

export { makeColumns } from './columns';
export { useDataTable } from './use-data-table';
export { readSortSearch, type SortDirection, type SortingRoute, type SortSearch, useUrlSorting } from './use-url-sorting';

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        align?: 'center' | 'right';
        link?: (row: TData) => LinkProps | undefined;
        ordinal?: boolean;
        trailing?: 'caret';
        width?: string;
    }
}

const LINK_STYLE = { color: 'inherit', display: 'block', textDecoration: 'none' } as const;

const ARIA_SORT: Record<string, 'ascending' | 'descending' | 'none'> = {
    asc: 'ascending',
    desc: 'descending',
    false: 'none',
};

const SortCaret = ({ direction }: { direction: 'asc' | 'desc' | false }) => {
    if (direction === 'asc') {
        return <CaretUpIcon className="table-head-caret" size={12} weight="bold" />;
    }

    if (direction === 'desc') {
        return <CaretDownIcon className="table-head-caret" size={12} weight="bold" />;
    }

    return <CaretUpDownIcon className="table-head-caret table-head-caret--idle" size={12} weight="bold" />;
};

type DataTableProps<T> = {
    headerPy?: number;
    px?: number;
    rowPy?: number;
    table: Table<T>;
};

export function DataTable<T>({ headerPy = 14, px = 18, rowPy = 14, table }: DataTableProps<T>) {
    const navigate = useNavigate();
    const columns = table.getVisibleLeafColumns();
    const headers = table.getHeaderGroups()[0]?.headers ?? [];
    const rows = table.getRowModel().rows;

    const linkColumns = columns.filter(column => column.columnDef.meta?.link);
    if (import.meta.env.DEV && linkColumns.length > 1) {
        throw new Error('DataTable: only one column may declare a `link`.');
    }
    const linkColumn = linkColumns[0];
    const hasCaret = linkColumn?.columnDef.meta?.trailing === 'caret';

    return (
        <TablePrimitive.ScrollContainer minWidth={720} type="native">
            <TablePrimitive className="data-table">
                <colgroup>
                    {columns.map(column => (
                        <col key={column.id} style={{ width: column.columnDef.meta?.width }} />
                    ))}
                </colgroup>
                <TablePrimitive.Thead>
                    <TablePrimitive.Tr>
                        {headers.map((h) => {
                            const label = h.isPlaceholder
                                ? null
                                : flexRender(h.column.columnDef.header, h.getContext());
                            const sorted = h.column.getIsSorted();

                            return (
                                <TablePrimitive.Th
                                    aria-sort={h.column.getCanSort() ? ARIA_SORT[String(sorted)] : undefined}
                                    key={h.id}
                                    scope="col"
                                    style={{
                                        paddingBlock: headerPy,
                                        paddingInline: px,
                                        textAlign: h.column.columnDef.meta?.align ?? 'left',
                                    }}
                                >
                                    {h.column.getCanSort()
                                        ? (
                                                <button
                                                    className="table-head-sort"
                                                    onClick={h.column.getToggleSortingHandler()}
                                                    type="button"
                                                >
                                                    {label}
                                                    <SortCaret direction={sorted} />
                                                </button>
                                            )
                                        : label}
                                </TablePrimitive.Th>
                            );
                        })}
                    </TablePrimitive.Tr>
                </TablePrimitive.Thead>
                <TablePrimitive.Tbody>
                    {rows.map((row, i) => {
                        const link = linkColumn?.columnDef.meta?.link?.(row.original);

                        return (
                            <TablePrimitive.Tr
                                className={cn('f1-row', link && 'f1-row--clickable')}
                                key={row.id}
                                onClick={link ? () => void navigate(link) : undefined}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const meta = cell.column.columnDef.meta;
                                    const align = meta?.align ?? 'left';
                                    const isLinkCell = link != null && cell.column.id === linkColumn?.id;

                                    let content: ReactNode = meta?.ordinal
                                        ? (
                                                <span className="table-cell-rank" style={{ display: 'block', textAlign: align }}>
                                                    {i + 1}
                                                </span>
                                            )
                                        : (
                                                <div style={{ minWidth: 0, textAlign: align }}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            );

                                    if (isLinkCell && hasCaret) {
                                        content = (
                                            <span className="table-cell-linkrow">
                                                {content}
                                                <CaretRightIcon className="table-cell-caret" size={13} />
                                            </span>
                                        );
                                    }

                                    return (
                                        <TablePrimitive.Td
                                            key={cell.id}
                                            style={{ paddingBlock: rowPy, paddingInline: px, textAlign: align }}
                                        >
                                            {isLinkCell
                                                ? (
                                                        <Link
                                                            {...link}
                                                            aria-label="Open details"
                                                            onClick={event => event.stopPropagation()}
                                                            style={LINK_STYLE}
                                                        >
                                                            {content}
                                                        </Link>
                                                    )
                                                : content}
                                        </TablePrimitive.Td>
                                    );
                                })}
                            </TablePrimitive.Tr>
                        );
                    })}
                </TablePrimitive.Tbody>
            </TablePrimitive>
        </TablePrimitive.ScrollContainer>
    );
}
