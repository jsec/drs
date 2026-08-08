import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import { DataTable, useDataTable } from '#/components/data-table';
import { Pill } from '#/components/f1-ui';
import { Card } from '#/components/ui/card';
import { TOTAL_ROUNDS } from '#/data/fixtures';
import { standingsQuery } from '#/data/queries';
import { parseYear } from '#/lib/route-params';

import { makeConstructorColumns, makeDriverColumns } from './-components/standings-table/columns';

const Standings = () => {
    const { year } = Route.useParams();
    const { data } = useSuspenseQuery(standingsQuery(Number(year)));
    const [tab, setTab] = useState<'constructors' | 'drivers'>('drivers');

    const driverColumns = useMemo(() => makeDriverColumns(year), [year]);
    const constructorColumns = useMemo(() => makeConstructorColumns(data.maxConstructor), [data.maxConstructor]);

    const driverTable = useDataTable({ columns: driverColumns, data: data.drivers });
    const constructorTable = useDataTable({ columns: constructorColumns, data: data.constructors });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <h1 className="f1-page-title">Championship Standings</h1>
                <div className="f1-page-description">
                    {`After Round ${data.completed} of ${TOTAL_ROUNDS} · ${year} season`}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <Pill active={tab === 'drivers'} onClick={() => setTab('drivers')}>Drivers</Pill>
                <Pill active={tab === 'constructors'} onClick={() => setTab('constructors')}>Constructors</Pill>
            </div>

            <Card className="f1-table-card">
                {tab === 'drivers'
                    ? <DataTable table={driverTable.table} />
                    : <DataTable table={constructorTable.table} />}
            </Card>
        </div>
    );
};

export const Route = createFileRoute('/seasons/$year/standings')({
    component: Standings,
    loader: async ({ context, params }) => {
        await context.queryClient.ensureQueryData(standingsQuery(parseYear(params.year)));
        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: 'Standings' },
            ],
        };
    },
});
