import type { LinkProps } from '@tanstack/react-router';
import type { CellContext, ColumnDef, ColumnMeta, RowData, SortFnOption } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { TrophyCount } from '#/components/f1-ui';
import { cn } from '#/lib/utils';

import type { Features } from './use-data-table';

type Alignment = 'center' | 'right';

type KeysMatching<T, V> = string & {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type Shared<T extends RowData> = {
    align?: Alignment;
    header?: string;
    id?: string;
    link?: (row: T) => LinkProps | undefined;
    sort?: SortFnOption<Features, T>;
    trailing?: 'caret';
    width?: string;
};

type Size = 'lg' | 'sm';

type SortValue = null | number | string;

const SIZE_CLASS = { lg: 'table-cell-lg', sm: 'table-cell-sm' } as const;

export function makeColumns<T extends RowData>() {
    const competitor = (
        key: keyof T & string,
        options: Shared<T> & {
            accessor?: (row: T) => SortValue;
            label: (row: T) => ReactNode;
            visual: (row: T) => ReactNode;
        },
    ): ColumnDef<Features, T, unknown> => ({
        accessorFn: options.accessor ?? (row => row[key]),
        cell: info => (
            <span className="table-cell-entity">
                {options.visual(info.row.original)}
                <span className="table-cell-entity-label">{options.label(info.row.original)}</span>
            </span>
        ),
        header: options.header,
        id: options.id ?? key,
        meta: buildMeta(options),
        sortDescFirst: false,
        sortFn: options.sort ?? 'auto',
    });

    const custom = (
        options: Shared<T> & {
            accessor?: (row: T) => SortValue;
            cell: (info: CellContext<Features, T, unknown>) => ReactNode;
            id: string;
            isDescFirst?: boolean;
        },
    ): ColumnDef<Features, T, unknown> => ({
        accessorFn: options.accessor,
        cell: options.cell,
        enableSorting: options.accessor != null,
        header: options.header,
        id: options.id,
        meta: buildMeta(options),
        sortDescFirst: options.isDescFirst ?? false,
        sortFn: options.sort ?? 'auto',
    });

    const numeric = <K extends KeysMatching<T, ReactNode>>(
        key: K,
        options: Shared<T> & { size?: Size; variant?: 'display' } = {},
    ): ColumnDef<Features, T, unknown> => ({
        accessorKey: key,
        cell: (info) => {
            // SAFETY: K extends KeysMatching<T, ReactNode>, so T[K] is ReactNode; TS can't resolve that for a generic T.
            const value = info.row.original[key] as ReactNode;

            return (
                <span
                    className={cn(
                        'table-cell-num',
                        options.variant === 'display' && 'table-cell-num-display',
                        options.size !== undefined && SIZE_CLASS[options.size],
                    )}
                >
                    {value}
                </span>
            );
        },
        header: options.header,
        id: options.id ?? key,
        meta: buildMeta(options),
        sortDescFirst: true,
        sortFn: options.sort ?? 'auto',
    });

    const ordinal = (
        options: { header?: string; id?: string; width?: string } = {},
    ): ColumnDef<Features, T, unknown> => ({
        enableSorting: false,
        header: options.header ?? '#',
        id: options.id ?? 'rank',
        meta: { isOrdinal: true, width: options.width ?? '4%' },
    });

    const text = <K extends KeysMatching<T, ReactNode>>(
        key: K,
        options: Shared<T> & { isBold?: boolean; isMuted?: boolean } = {},
    ): ColumnDef<Features, T, unknown> => ({
        accessorKey: key,
        cell: (info) => {
            // SAFETY: K extends KeysMatching<T, ReactNode>, so T[K] is ReactNode; TS can't resolve that for a generic T.
            const value = info.row.original[key] as ReactNode;

            return (
                <span
                    className={cn(
                        'table-cell-text',
                        options.isBold && 'table-cell-text-bold',
                        options.isMuted && 'table-cell-text-muted',
                    )}
                >
                    {value}
                </span>
            );
        },
        header: options.header,
        id: options.id ?? key,
        meta: buildMeta(options),
        sortDescFirst: false,
        sortFn: options.sort ?? 'auto',
    });

    const trophy = <K extends KeysMatching<T, number>>(
        key: K,
        options: Shared<T> = {},
    ): ColumnDef<Features, T, unknown> => ({
        accessorKey: key,
        cell: (info) => {
            // SAFETY: K extends KeysMatching<T, number>, so T[K] is number; TS can't resolve that for a generic T.
            const count = info.row.original[key] as number;

            return (
                <span className="table-cell-trophy">
                    <TrophyCount count={count} />
                </span>
            );
        },
        header: options.header,
        id: options.id ?? key,
        meta: buildMeta({ align: 'center', ...options }),
        sortDescFirst: true,
        sortFn: options.sort ?? 'auto',
    });

    return {
        competitor,
        custom,
        numeric,
        ordinal,
        text,
        trophy,
    };
}

function buildMeta<T extends RowData>(options: Shared<T>): ColumnMeta<Features, T, unknown> {
    return {
        align: options.align,
        link: options.link,
        trailing: options.trailing,
        width: options.width,
    };
}
