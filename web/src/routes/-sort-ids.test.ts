import type { ColumnDef } from '@tanstack/react-table';

import { describe, expect, it } from 'vitest';

import { SORT_IDS as CIRCUIT_IDS, columns as circuitColumns } from './circuits/-components/circuits-table/columns';
import { SORT_IDS as CONSTRUCTOR_IDS, makeConstructorColumns } from './constructors/-components/constructors-table/columns';
import { SORT_IDS as DRIVER_IDS, columns as driverColumns } from './drivers/-components/drivers-table/columns';
import { SORT_IDS as SEASON_IDS, columns as seasonColumns } from './seasons/-components/seasons-table/columns';

const sortableIds = (columns: ColumnDef<never, unknown>[]) =>
    columns.filter(c => c.enableSorting !== false).map(c => c.id);

describe('SORT_IDS match their sortable columns', () => {
    it.each([
        ['circuits', CIRCUIT_IDS, circuitColumns],
        ['constructors', CONSTRUCTOR_IDS, makeConstructorColumns(1)],
        ['drivers', DRIVER_IDS, driverColumns],
        ['seasons', SEASON_IDS, seasonColumns],
    ])('%s', (_name, ids, columns) => {
        expect(sortableIds(columns as ColumnDef<never, unknown>[])).toEqual([...ids]);
    });
});
