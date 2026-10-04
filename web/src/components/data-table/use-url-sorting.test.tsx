import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithRouter, searchOf } from '#/test/router';

import { DataTable, makeColumns, SortSearchSchema, useDataTable, useUrlSorting } from './index';

type Row = {
    name: string;
    wins: number;
};

const DATA: Row[] = [
    { name: 'Charlie', wins: 5 },
    { name: 'Alice', wins: 12 },
    { name: 'Bob', wins: 1 },
];

const col = makeColumns<Row>();

const columns = [
    col.text('name', { header: 'NAME' }),
    col.num('wins', { header: 'WINS' }),
];

const Harness = () => {
    const { onSortingChange, sorting } = useUrlSorting();
    const { table } = useDataTable({ columns, data: DATA, onSortingChange, sorting });

    return <DataTable table={table} />;
};

const names = () =>
    screen.getAllByRole('row')
        .slice(1)
        .map(row => row.querySelector('td')?.textContent?.trim());

describe('useUrlSorting', () => {
    it('applies sorting from the incoming URL', async () => {
        await renderWithRouter(<Harness />, '/?sort=wins&dir=desc');

        expect(names()).toEqual(['Alice', 'Charlie', 'Bob']);
        expect(screen.getByRole('columnheader', { name: /WINS/ }).getAttribute('aria-sort'))
            .toBe('descending');
    });

    it('renders unsorted when the URL carries no sort', async () => {
        await renderWithRouter(<Harness />);

        expect(names()).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('writes both params when a header is clicked', async () => {
        const { router } = await renderWithRouter(<Harness />);

        fireEvent.click(screen.getByRole('button', { name: 'WINS' }));

        await waitFor(() => expect(searchOf(router)).toBe('dir=desc&sort=wins'));
    });

    it('removes both params when the sort is cleared', async () => {
        const { router } = await renderWithRouter(<Harness />, '/?sort=wins&dir=asc');
        const button = screen.getByRole('button', { name: 'WINS' });

        // asc is the second state for a numeric column, so one more click clears.
        fireEvent.click(button);

        await waitFor(() => expect(searchOf(router)).toBe(''));
        await waitFor(() => expect(names()).toEqual(['Charlie', 'Alice', 'Bob']));
    });

    it('preserves unrelated search params', async () => {
        const { router } = await renderWithRouter(<Harness />, '/?category=champions');

        fireEvent.click(screen.getByRole('button', { name: 'NAME' }));

        await waitFor(() =>
            expect(searchOf(router)).toBe('category=champions&dir=asc&sort=name'));
    });
});

describe('SortSearchSchema', () => {
    it('keeps a sort id and its direction', () => {
        expect(SortSearchSchema.parse({ dir: 'desc', sort: 'wins' })).toEqual({ dir: 'desc', sort: 'wins' });
    });

    it('drops a non-string sort and a junk dir instead of throwing', () => {
        expect(SortSearchSchema.parse({ dir: 'sideways', sort: 7 })).toEqual({});
    });
});
