import type { ColumnDef, SortingFn } from '@tanstack/react-table';

import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithRouter } from '#/test/router';

import { DataTable, makeColumns, useDataTable } from './index';

type Row = {
    name: string;
    note: string;
    wins: number;
};

const DATA: Row[] = [
    { name: 'Charlie', note: 'c', wins: 5 },
    { name: 'Alice', note: 'a', wins: 12 },
    { name: 'Bob', note: 'b', wins: 1 },
];

const col = makeColumns<Row>();

const byNote: SortingFn<Row> = (a, b) => a.original.note.localeCompare(b.original.note);

const columns = [
    col.ordinal(),
    col.text('name', { header: 'NAME' }),
    col.num('wins', { header: 'WINS' }),
    col.text('note', { header: 'NOTE', sortable: false }),
];

const customColumns = [
    col.ordinal(),
    col.text('name', { header: 'NAME' }),
    col.num('wins', { header: 'WINS', sort: byNote }),
];

const Harness = ({ cols = columns }: { cols?: ColumnDef<Row, unknown>[] }) => {
    const { table } = useDataTable({ columns: cols, data: DATA });
    return <DataTable table={table} />;
};

const names = () =>
    screen.getAllByRole('row')
        .slice(1)
        .map(row => row.querySelectorAll('td')[1]?.textContent?.trim());

const header = (name: string) => screen.getByRole('columnheader', { name: new RegExp(name) });

const ariaSort = (name: string) => header(name).getAttribute('aria-sort');

describe('DataTable sorting', () => {
    it('opens a text column ascending', async () => {
        await renderWithRouter(<Harness />);

        fireEvent.click(screen.getByRole('button', { name: 'NAME' }));

        expect(names()).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('opens a numeric column descending', async () => {
        await renderWithRouter(<Harness />);

        fireEvent.click(screen.getByRole('button', { name: 'WINS' }));

        expect(names()).toEqual(['Alice', 'Charlie', 'Bob']);
    });

    it('clears the sort on the third click', async () => {
        await renderWithRouter(<Harness />);
        const button = screen.getByRole('button', { name: 'WINS' });

        fireEvent.click(button);
        fireEvent.click(button);
        expect(names()).toEqual(['Bob', 'Charlie', 'Alice']);

        fireEvent.click(button);
        expect(names()).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('reports direction through aria-sort across the cycle', async () => {
        await renderWithRouter(<Harness />);
        const button = screen.getByRole('button', { name: 'WINS' });

        expect(ariaSort('WINS')).toBe('none');

        fireEvent.click(button);
        expect(ariaSort('WINS')).toBe('descending');

        fireEvent.click(button);
        expect(ariaSort('WINS')).toBe('ascending');

        fireEvent.click(button);
        expect(ariaSort('WINS')).toBe('none');
    });

    it('renders no control for the ordinal or an opted-out column', async () => {
        await renderWithRouter(<Harness />);

        expect(header('#').querySelector('button')).toBeNull();
        expect(ariaSort('#')).toBeNull();
        expect(header('NOTE').querySelector('button')).toBeNull();
        expect(ariaSort('NOTE')).toBeNull();
    });

    it('uses a column\'s custom comparator over the natural one', async () => {
        await renderWithRouter(<Harness cols={customColumns} />);

        fireEvent.click(screen.getByRole('button', { name: 'WINS' }));

        // Descending by note, which reverses the alphabet rather than the wins.
        expect(names()).toEqual(['Charlie', 'Bob', 'Alice']);
    });
});
