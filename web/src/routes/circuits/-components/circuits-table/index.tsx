import type { SortingState } from '@tanstack/react-table';

import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import type { ListCircuitsResponse } from '#/lib/api/circuits.gen';

import { DataTable, useDataTable } from '#/components/data-table';
import { Pill } from '#/components/f1-ui';
import { Card } from '#/components/ui/card';

import { columns } from './columns';

const route = getRouteApi(('/circuits/'));

export type SortKey = 'country' | 'first_race' | 'last_race' | 'name';

type Props = {
    circuits: ListCircuitsResponse[];
};

export const SORTS: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'country', label: 'Country' },
    { key: 'first_race', label: 'First Race' },
    { key: 'last_race', label: 'Last Race' },
];

export const CircuitsTable = ({ circuits }: Props) => {
    const { sort = 'last_race' } = route.useSearch();
    const navigate = route.useNavigate();

    const setSort = (next: SortKey) => void navigate({ search: () => ({ sort: next }) });

    const sorting = useMemo<SortingState>(
        () => [{ desc: true, id: sort }],
        [sort],
    );

    const { table } = useDataTable({ columns, data: circuits, sorting });

    return (
        <div className="f1-page-stack">
            <div className="f1-page-header">
                <div>
                    <h1 className="f1-page-title">
                        Circuits
                    </h1>
                    <div className="f1-page-description">
                        All-time circuit index
                    </div>
                </div>
                <div className="f1-control-group">
                    <span className="f1-sort-label">SORT</span>
                    {SORTS.map(s => (
                        <Pill active={sort === s.key} key={s.key} onClick={() => setSort(s.key)} variant="subtle">
                            {s.label}
                        </Pill>
                    ))}
                </div>
            </div>

            <Card className="f1-table-card">
                <DataTable px={20} table={table} />
            </Card>
        </div>
    );
};
