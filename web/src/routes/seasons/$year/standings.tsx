import { Card, Group, Stack } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import { DataTable, useDataTable } from '#/components/data-table';
import { Pill } from '#/components/f1-ui';
import { calendarQuery, seasonStandingsQuery } from '#/data/queries';
import { parseYear } from '#/lib/route-params';

import { makeConstructorColumns, makeDriverColumns } from './-components/standings-table/columns';

const Standings = () => {
    const { year } = Route.useParams();
    const { data } = useSuspenseQuery(seasonStandingsQuery(Number(year)));
    const { data: calendar } = useSuspenseQuery(calendarQuery(Number(year)));
    const [tab, setTab] = useState<'constructors' | 'drivers'>('drivers');

    const driverColumns = useMemo(() => makeDriverColumns(year), [year]);
    const constructorColumns = useMemo(
        () => makeConstructorColumns(data.maxConstructorPoints),
        [data.maxConstructorPoints],
    );

    const driverTable = useDataTable({ columns: driverColumns, data: data.drivers });
    const constructorTable = useDataTable({ columns: constructorColumns, data: data.constructors });

    return (
        <Stack gap={16}>
            <div>
                <h1 className="f1-page-title">Championship Standings</h1>
                <div className="f1-page-description">
                    {`After Round ${calendar.completed} of ${calendar.calendar.length} · ${year} season`}
                </div>
            </div>

            <Group gap={8} wrap="nowrap">
                <Pill active={tab === 'drivers'} onClick={() => setTab('drivers')}>Drivers</Pill>
                <Pill active={tab === 'constructors'} onClick={() => setTab('constructors')}>Constructors</Pill>
            </Group>

            <Card className="f1-table-card">
                {tab === 'drivers'
                    ? <DataTable table={driverTable.table} />
                    : <DataTable table={constructorTable.table} />}
            </Card>
        </Stack>
    );
};

export const Route = createFileRoute('/seasons/$year/standings')({
    component: Standings,
    loader: async ({ context, params }) => {
        const year = parseYear(params.year);
        await Promise.all([
            context.queryClient.ensureQueryData(seasonStandingsQuery(year)),
            context.queryClient.ensureQueryData(calendarQuery(year)),
        ]);
        return {
            crumbs: [
                { label: params.year, params: { year: params.year }, to: '/seasons/$year' },
                { label: 'Standings' },
            ],
        };
    },
});
