import { Card } from '@mantine/core';
import { getRouteApi } from '@tanstack/react-router';

import type { ListCircuitsResponse } from '#/lib/api/circuits.gen';

import { DataTable, useDataTable, useUrlSorting } from '#/components/data-table';

import { columns } from './columns';

const route = getRouteApi(('/circuits/'));

type Props = {
    circuits: ListCircuitsResponse[];
};

export const CircuitsTable = ({ circuits }: Props) => {
    const { onSortingChange, sorting } = useUrlSorting(route);

    const { table } = useDataTable({ columns, data: circuits, onSortingChange, sorting });

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
            </div>

            <Card className="f1-table-card">
                <DataTable px={20} table={table} />
            </Card>
        </div>
    );
};
