import type { SortingState } from '@tanstack/react-table';

import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import type { ListCircuitsResponse } from '#/lib/api/circuits.gen';

import { DataTable, useDataTable } from '#/components/data-table';
import { Pill } from '#/components/f1-ui';
import { Card } from '#/components/ui/card';

import { columns } from './columns';

const route = getRouteApi(('/circuits/'));

export type SortKey = 'country' | 'first_race_year' | 'last_race_year' | 'name';

type Props = {
    circuits: ListCircuitsResponse[];
};

export const SORTS: { desc: boolean; key: SortKey; label: string }[] = [
    { desc: true, key: 'name', label: 'Name' },
    { desc: true, key: 'country', label: 'Country' },
    { desc: false, key: 'first_race_year', label: 'First Race' },
    { desc: true, key: 'last_race_year', label: 'Last Race' },
];

export const CircuitsTable = ({ circuits }: Props) => {
    const { sort = 'last_race_year' } = route.useSearch();
    const navigate = route.useNavigate();

    const setSort = (next: SortKey) => void navigate({ search: () => ({ sort: next }) });

    const sorting = useMemo<SortingState>(
        () => [{ desc: SORTS.find(s => s.key === sort)?.desc ?? true, id: sort }],
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
