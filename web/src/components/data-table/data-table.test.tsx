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
    {
        name: 'Charlie',
        note: 'c',
        wins: 5,
    },
    {
        name: 'Alice',
        note: 'a',
        wins: 12,
    },
    {
        name: 'Bob',
        note: 'b',
        wins: 1,
    },
];

const columnBuilder = makeColumns<Row>();

const byNote: SortingFn<Row> = (a, b) => a.original.note.localeCompare(b.original.note);

const defaultColumns = [
    columnBuilder.ordinal(),
    columnBuilder.text('name', { header: 'NAME' }),
    columnBuilder.numeric('wins', { header: 'WINS' }),
    columnBuilder.custom({
        cell: info => info.row.original.note,
        header: 'NOTE',
        id: 'note',
    }),
];

const customColumns = [
    columnBuilder.ordinal(),
    columnBuilder.text('name', { header: 'NAME' }),
    columnBuilder.numeric('wins', { header: 'WINS', sort: byNote }),
];

const Harness = ({ columns = defaultColumns }: { columns?: ColumnDef<Row, unknown>[] }) => {
    const { table } = useDataTable({ columns, data: DATA });

    return <DataTable table={table} />;
};

const names = () =>
    screen.getAllByRole('row')
        .slice(1)
        .map(row => row.querySelectorAll('td')[1]?.textContent?.trim());

const header = (name: string) => screen.getByRole('columnheader', { name: new RegExp(name) });

const ariaSort = (name: string) => header(name).getAttribute('aria-sort');

describe('DataTable', () => {
    describe('sorting', () => {
        it('should open a text column ascending', async () => {
            await renderWithRouter(<Harness />);

            fireEvent.click(screen.getByRole('button', { name: 'NAME' }));

            expect(names()).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('should open a numeric column descending', async () => {
            await renderWithRouter(<Harness />);

            fireEvent.click(screen.getByRole('button', { name: 'WINS' }));

            expect(names()).toEqual(['Alice', 'Charlie', 'Bob']);
        });

        it('should clear the sort on the third click', async () => {
            await renderWithRouter(<Harness />);

            const button = screen.getByRole('button', { name: 'WINS' });

            fireEvent.click(button);
            fireEvent.click(button);
            const ascendingNames = names();

            fireEvent.click(button);
            const clearedNames = names();

            expect(ascendingNames).toEqual(['Bob', 'Charlie', 'Alice']);
            expect(clearedNames).toEqual(['Charlie', 'Alice', 'Bob']);
        });

        it('should report direction through aria-sort across the cycle', async () => {
            await renderWithRouter(<Harness />);

            const button = screen.getByRole('button', { name: 'WINS' });
            const initialSort = ariaSort('WINS');

            fireEvent.click(button);
            const firstClickSort = ariaSort('WINS');

            fireEvent.click(button);
            const secondClickSort = ariaSort('WINS');

            fireEvent.click(button);
            const thirdClickSort = ariaSort('WINS');

            expect(initialSort).toBe('none');
            expect(firstClickSort).toBe('descending');
            expect(secondClickSort).toBe('ascending');
            expect(thirdClickSort).toBe('none');
        });

        it('should render no control for the ordinal or an opted-out column', async () => {
            await renderWithRouter(<Harness />);

            expect(header('#').querySelector('button')).toBeNull();
            expect(ariaSort('#')).toBeNull();
            expect(header('NOTE').querySelector('button')).toBeNull();
            expect(ariaSort('NOTE')).toBeNull();
        });

        it('should use a column\'s custom comparator over the natural one', async () => {
            await renderWithRouter(<Harness columns={customColumns} />);

            fireEvent.click(screen.getByRole('button', { name: 'WINS' }));

            // Descending by note, which reverses the alphabet rather than the wins.
            expect(names()).toEqual(['Charlie', 'Bob', 'Alice']);
        });
    });

    describe('re-renders', () => {
        it('should settle when the caller passes a new sorting array on every render', async () => {
            let renders = 0;

            const ControlledHarness = () => {
                renders++;

                const { setSearch, table } = useDataTable({
                    columns: defaultColumns,
                    data: DATA,
                    filter: (row, _id, value: string) => row.original.name.includes(value),
                    sorting: [],
                });

                return (
                    <>
                        <input aria-label="search" onChange={event => setSearch(event.currentTarget.value)} />
                        <DataTable table={table} />
                    </>
                );
            };

            await renderWithRouter(<ControlledHarness />);

            fireEvent.change(screen.getByRole('textbox', { name: 'search' }), { target: { value: 'A' } });
            renders = 0;
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(renders).toBeLessThan(5);
        });
    });
});
