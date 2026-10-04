import type { LinkProps } from '@tanstack/react-router';
import type { CellContext, ColumnDef, ColumnMeta, SortingFnOption } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { TrophyCount } from '#/components/f1-ui';
import { cn } from '#/lib/utils';

type Alignment = 'center' | 'right';

type KeysMatching<T, V> = string & {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type Shared<T> = {
    align?: Alignment;
    header?: string;
    id?: string;
    link?: (row: T) => LinkProps | undefined;
    sort?: SortingFnOption<T>;
    sortable?: boolean;
    trailing?: 'caret';
    width?: string;
};

type Size = 'lg' | 'sm';

type SortValue = null | number | string;

const SIZE_CLASS = { lg: 'table-cell-lg', sm: 'table-cell-sm' } as const;

export function makeColumns<T>() {
    const competitor = (
        key: keyof T & string,
        opts: Shared<T> & {
            accessor?: (row: T) => SortValue;
            label: (row: T) => ReactNode;
            visual: (row: T) => ReactNode;
        },
    ): ColumnDef<T, unknown> => ({
        accessorFn: opts.accessor ?? (row => row[key]),
        cell: info => (
            <span className="table-cell-entity">
                {opts.visual(info.row.original)}
                <span className="table-cell-entity-label">{opts.label(info.row.original)}</span>
            </span>
        ),
        enableSorting: canSort(opts),
        header: opts.header,
        id: opts.id ?? key,
        meta: buildMeta(opts),
        sortDescFirst: false,
        sortingFn: opts.sort ?? 'auto',
    });

    const custom = (
        opts: Shared<T> & {
            accessor?: (row: T) => SortValue;
            cell: (info: CellContext<T, unknown>) => ReactNode;
            descFirst?: boolean;
            id: string;
        },
    ): ColumnDef<T, unknown> => ({
        accessorFn: opts.accessor,
        cell: opts.cell,
        enableSorting: canSort(opts) && opts.accessor != null,
        header: opts.header,
        id: opts.id,
        meta: buildMeta(opts),
        sortDescFirst: opts.descFirst ?? false,
        sortingFn: opts.sort ?? 'auto',
    });

    const num = <K extends KeysMatching<T, ReactNode>>(
        key: K,
        opts: Shared<T> & { size?: Size; variant?: 'display' } = {},
    ): ColumnDef<T, unknown> => ({
        accessorKey: key,
        cell: (info) => {
            // SAFETY: K extends KeysMatching<T, ReactNode>, so T[K] is ReactNode; TS can't resolve that for a generic T.
            const value = info.row.original[key] as ReactNode;
            return (
                <span
                    className={cn(
                        'table-cell-num',
                        opts.variant === 'display' && 'table-cell-num-display',
                        opts.size !== undefined && SIZE_CLASS[opts.size],
                    )}
                >
                    {value}
                </span>
            );
        },
        enableSorting: canSort(opts),
        header: opts.header,
        id: opts.id ?? key,
        meta: buildMeta(opts),
        sortDescFirst: true,
        sortingFn: opts.sort ?? 'auto',
    });

    const ordinal = (
        opts: { header?: string; id?: string; width?: string } = {},
    ): ColumnDef<T, unknown> => ({
        enableSorting: false,
        header: opts.header ?? '#',
        id: opts.id ?? 'rank',
        meta: { ordinal: true, width: opts.width ?? '4%' },
    });

    const text = <K extends KeysMatching<T, ReactNode>>(
        key: K,
        opts: Shared<T> & { bold?: boolean; muted?: boolean } = {},
    ): ColumnDef<T, unknown> => ({
        accessorKey: key,
        cell: (info) => {
            // SAFETY: K extends KeysMatching<T, ReactNode>, so T[K] is ReactNode; TS can't resolve that for a generic T.
            const value = info.row.original[key] as ReactNode;
            return (
                <span
                    className={cn(
                        'table-cell-text',
                        opts.bold && 'table-cell-text-bold',
                        opts.muted && 'table-cell-text-muted',
                    )}
                >
                    {value}
                </span>
            );
        },
        enableSorting: canSort(opts),
        header: opts.header,
        id: opts.id ?? key,
        meta: buildMeta(opts),
        sortDescFirst: false,
        sortingFn: opts.sort ?? 'auto',
    });

    const trophy = <K extends KeysMatching<T, number>>(
        key: K,
        opts: Shared<T> = {},
    ): ColumnDef<T, unknown> => ({
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
        enableSorting: canSort(opts),
        header: opts.header,
        id: opts.id ?? key,
        meta: buildMeta({ align: 'center', ...opts }),
        sortDescFirst: true,
        sortingFn: opts.sort ?? 'auto',
    });

    return { competitor, custom, num, ordinal, text, trophy };
}

function buildMeta<T>(opts: Shared<T>): ColumnMeta<T, unknown> {
    return {
        align: opts.align,
        link: opts.link,
        trailing: opts.trailing,
        width: opts.width,
    };
}

function canSort<T>(opts: Shared<T>): boolean {
    return opts.sortable !== false;
}
