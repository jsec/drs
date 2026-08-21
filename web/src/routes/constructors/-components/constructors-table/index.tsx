import { Card } from '@mantine/core';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import type { ListConstructorsResponse } from '#/lib/api/types';

import { DataTable, useDataTable, useUrlSorting } from '#/components/data-table';

import { makeConstructorColumns } from './columns';

const route = getRouteApi('/constructors/');

type Props = {
    constructors: ListConstructorsResponse;
};

export const ConstructorsTable = ({ constructors }: Props) => {
    const maxWins = useMemo(() => Math.max(...constructors.map(c => c.wins)), [constructors]);
    const columns = useMemo(() => makeConstructorColumns(maxWins), [maxWins]);

    const { onSortingChange, sorting } = useUrlSorting(route);

    const { table } = useDataTable({ columns, data: constructors, onSortingChange, sorting });

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
            </div>

            <Card className="f1-table-card">
                <DataTable px={20} table={table} />
            </Card>
        </div>
    );
};
