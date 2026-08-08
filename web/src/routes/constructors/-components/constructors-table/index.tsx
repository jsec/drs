import type { SortingState } from '@tanstack/react-table';

import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import type { ListConstructorsResponse } from '#/lib/api/types';

import { DataTable, useDataTable } from '#/components/data-table';
import { Pill } from '#/components/f1-ui';
import { Card } from '#/components/ui/card';

import { makeConstructorColumns } from './columns';

export type Sort = 'podiums' | 'titles' | 'wins';

export const SORTS: { key: Sort; label: string }[] = [
    { key: 'titles', label: 'Titles' },
    { key: 'wins', label: 'Wins' },
    { key: 'podiums', label: 'Podiums' },
];

const route = getRouteApi('/constructors/');

type Props = {
    constructors: ListConstructorsResponse;
};

export const ConstructorsTable = ({ constructors }: Props) => {
    const { sort = 'titles' } = route.useSearch();
    const navigate = route.useNavigate();
    const setSort = (next: Sort) =>
        void navigate({ search: () => ({ sort: next }) });

    const maxWins = useMemo(() => Math.max(...constructors.map(c => c.wins)), [constructors]);
    const columns = useMemo(() => makeConstructorColumns(maxWins), [maxWins]);

    const sorting = useMemo<SortingState>(
        () => [{ desc: true, id: sort }],
        [sort],
    );

    const { table } = useDataTable({ columns, data: constructors, sorting });

    return (
        <div className="f1-page-stack">
            <div className="f1-page-header">
                <div>
                    <h1 className="f1-page-title">
                        Constructors
                    </h1>
                    <div className="f1-page-description">
                        All-time index · Constructors&apos; Championships and records since 1958
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
