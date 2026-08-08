import type { ComponentProps } from 'react';

import { cn } from '#/lib/utils';

import './table.css';

export const TableContainer = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('ui-table-container', className)} {...props} />
);

export const Table = ({ className, ...props }: ComponentProps<'table'>) => (
    <table className={cn('ui-table', className)} {...props} />
);

export const TableHeader = ({ className, ...props }: ComponentProps<'thead'>) => (
    <thead className={cn('ui-table-header', className)} {...props} />
);

export const TableBody = ({ className, ...props }: ComponentProps<'tbody'>) => (
    <tbody className={className} {...props} />
);

export const TableRow = ({ className, ...props }: ComponentProps<'tr'>) => (
    <tr className={cn('ui-table-row', className)} {...props} />
);

export const TableHead = ({ className, ...props }: ComponentProps<'th'>) => (
    <th className={cn('ui-table-head', className)} {...props} />
);

export const TableCell = ({ className, ...props }: ComponentProps<'td'>) => (
    <td className={cn('ui-table-cell', className)} {...props} />
);
