import type { LinkProps } from '@tanstack/react-router';
import type { Cell, RowData, Table } from '@tanstack/react-table';

import { Table as TablePrimitive } from '@mantine/core';
import { CaretDownIcon, CaretRightIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { flexRender } from '@tanstack/react-table';

import { cn } from '#/lib/utils';

import './data-table.css';

export { makeColumns } from './columns';
export { useDataTable } from './use-data-table';
export { SortSearchSchema, useUrlSorting } from './use-url-sorting';

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        align?: 'center' | 'right';
        isOrdinal?: boolean;
        link?: (row: TData) => LinkProps | undefined;
        trailing?: 'caret';
        width?: string;
    }
}

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

type CellBodyProps<T> = {
    align: 'center' | 'left' | 'right';
    cell: Cell<T, unknown>;
    rank: number;
};

type DataTableProps<T> = {
    px?: number;
    table: Table<T>;
};

export function DataTable<T>({ px = 18, table }: DataTableProps<T>) {
    const navigate = useNavigate();
    const columns = table.getVisibleLeafColumns();
    const headers = table.getHeaderGroups()[0]?.headers ?? [];
    const rows = table.getRowModel().rows;

    const linkColumn = columns.find(column => column.columnDef.meta?.link);
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
                        {headers.map((header) => {
                            const label = header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext());
                            const sorted = header.column.getIsSorted();

                            return (
                                <TablePrimitive.Th
                                    aria-sort={header.column.getCanSort() ? ARIA_SORT[String(sorted)] : undefined}
                                    key={header.id}
                                    scope="col"
                                    style={{
                                        paddingBlock: 14,
                                        paddingInline: px,
                                        textAlign: header.column.columnDef.meta?.align ?? 'left',
                                    }}
                                >
                                    {header.column.getCanSort()
                                        ? (
                                                <button
                                                    className="table-head-sort"
                                                    onClick={header.column.getToggleSortingHandler()}
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
                    {rows.map((row, rowIndex) => {
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

                                    const body = <CellBody align={align} cell={cell} rank={rowIndex + 1} />;
                                    const content = isLinkCell && hasCaret
                                        ? (
                                                <span className="table-cell-linkrow">
                                                    {body}
                                                    <CaretRightIcon className="table-cell-caret" size={13} />
                                                </span>
                                            )
                                        : body;

                                    return (
                                        <TablePrimitive.Td
                                            key={cell.id}
                                            style={{
                                                paddingBlock: 14,
                                                paddingInline: px,
                                                textAlign: align,
                                            }}
                                        >
                                            {isLinkCell
                                                ? (
                                                        <Link
                                                            {...link}
                                                            aria-label="Open details"
                                                            className="f1-plain-link"
                                                            onClick={event => event.stopPropagation()}
                                                            style={{ display: 'block' }}
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

function CellBody<T>({ align, cell, rank }: CellBodyProps<T>) {
    if (cell.column.columnDef.meta?.isOrdinal) {
        return (
            <span className="table-cell-rank" style={{ display: 'block', textAlign: align }}>
                {rank}
            </span>
        );
    }

    return (
        <div style={{ minWidth: 0, textAlign: align }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
    );
}
