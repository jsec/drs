import type { LinkProps } from '@tanstack/react-router';
import type { CellContext, ColumnDef, ColumnMeta, SortingFnOption } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { TrophyCount } from '#/components/f1-ui';
import { cn } from '#/lib/utils';

type Alignment = 'center' | 'right';

/**
 * Keys of `T` whose value is assignable to `V` (e.g. numeric or renderable
 * columns). Constrains which columns a builder accepts; TypeScript will not
 * narrow `T[K]` back to `V` through this, so the cell still coerces the read,
 * but that coercion is now guaranteed sound by the key constraint.
 */
type KeysMatching<T, V> = string & {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type Shared<T> = {
    align?: Alignment;
    header?: string;
    id?: string;
    link?: (row: T) => LinkProps | undefined;
    sort?: SortingFnOption<T>;
    trailing?: 'caret';
    width?: string;
};

type Size = 'lg' | 'sm';

const SIZE_CLASS = { lg: 'table-cell-lg', sm: 'table-cell-sm' } as const;
const sizeClass = (size?: Size) => (size ? SIZE_CLASS[size] : undefined);

export function makeColumns<T>() {
    const competitor = (
        key: keyof T & string,
        opts: Shared<T> & { label: (row: T) => ReactNode; visual: (row: T) => ReactNode },
    ): ColumnDef<T, unknown> => ({
        accessorKey: key,
        cell: info => (
            <span className="table-cell-entity">
                {opts.visual(info.row.original)}
                <span className="table-cell-entity-label">{opts.label(info.row.original)}</span>
            </span>
        ),
        enableSorting: opts.sort != null,
        header: opts.header,
        id: opts.id ?? key,
        meta: buildMeta(opts),
        sortingFn: opts.sort,
    });

    const custom = (
        opts: Shared<T> & {
            accessor?: (row: T) => unknown;
            cell: (info: CellContext<T, unknown>) => ReactNode;
            id: string;
        },
    ): ColumnDef<T, unknown> => ({
        accessorFn: opts.accessor,
        cell: info => opts.cell(info),
        enableSorting: opts.sort != null,
        header: opts.header,
        id: opts.id,
        meta: buildMeta(opts),
        sortingFn: opts.sort,
    });

    const num = <K extends KeysMatching<T, ReactNode>>(
        key: K,
        opts: Shared<T> & { size?: Size; variant?: 'display' | 'muted' } = {},
    ): ColumnDef<T, unknown> => ({
        accessorKey: key,
        cell: info => (
            <span
                className={cn(
                    'table-cell-num',
                    opts.variant === 'display' && 'table-cell-num-display',
                    sizeClass(opts.size),
                )}
            >
                {info.row.original[key] as ReactNode}
            </span>
        ),
        enableSorting: opts.sort != null,
        header: opts.header,
        id: opts.id ?? key,
        meta: buildMeta(opts),
        sortingFn: opts.sort,
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
        opts: Shared<T> & { fallback?: ReactNode; muted?: boolean; size?: Size } = {},
    ): ColumnDef<T, unknown> => ({
        accessorKey: key,
        cell: (info) => {
            const value = info.row.original[key] as ReactNode;
            return (
                <span
                    className={cn(
                        'table-cell-text',
                        opts.muted && 'table-cell-text-muted',
                        sizeClass(opts.size),
                    )}
                >
                    {value ?? opts.fallback}
                </span>
            );
        },
        enableSorting: opts.sort != null,
        header: opts.header,
        id: opts.id ?? key,
        meta: buildMeta(opts),
        sortingFn: opts.sort,
    });

    const trophy = <K extends KeysMatching<T, number>>(
        key: K,
        opts: Shared<T> & { size?: number } = {},
    ): ColumnDef<T, unknown> => ({
        accessorKey: key,
        cell: info => (
            <span className="table-cell-trophy">
                <TrophyCount count={info.row.original[key] as number} size={opts.size} />
            </span>
        ),
        enableSorting: opts.sort != null,
        header: opts.header,
        id: opts.id ?? key,
        meta: buildMeta({ align: 'center', ...opts }),
        sortingFn: opts.sort,
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
