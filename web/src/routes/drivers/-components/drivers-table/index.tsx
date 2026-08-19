import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import type { AllTimeDriver } from '#/data/types';

import { DataTable, useDataTable, useUrlSorting } from '#/components/data-table';
import { Pill } from '#/components/f1-ui';
import { Card } from '#/components/ui/card';
import { Input, InputGroup } from '#/components/ui/input';

import { columns, fuzzy } from './columns';

export type Category = 'active' | 'all' | 'champions';

export const CATEGORIES: { key: Category; label: string }[] = [
    { key: 'all', label: 'All drivers' },
    { key: 'champions', label: 'World Champions' },
    { key: 'active', label: 'Active' },
];

const route = getRouteApi('/drivers/');

type Props = {
    drivers: AllTimeDriver[];
};

export const DriversTable = ({ drivers }: Props) => {
    const { category = 'all' } = route.useSearch();
    const navigate = route.useNavigate();

    const setCategory = (next: Category) =>
        void navigate({ search: prev => ({ ...prev, category: next }) });

    const data = useMemo(
        () =>
            drivers.filter(
                d =>
                    category === 'all'
                    || (category === 'champions' ? d.titles > 0 : d.active),
            ),
        [drivers, category],
    );

    const { onSortingChange, sorting } = useUrlSorting(route);

    const { search, setSearch, table } = useDataTable({
        columns,
        data,
        filter: fuzzy,
        onSortingChange,
        sorting,
    });

    const shown = table.getRowModel().rows.length;

    return (
        <div className="f1-page-stack">
            <div>
                <h1 className="f1-page-title">
                    Drivers
                </h1>
                <div className="f1-page-description">
                    {'All-time index · career statistics across every season · '}
                    <strong>{shown}</strong>
                    {` of ${drivers.length} shown`}
                </div>
            </div>

            <div className="f1-toolbar">
                <InputGroup>
                    <MagnifyingGlassIcon color="var(--color-muted-foreground)" data-icon="inline-start" size={15} />
                    <Input
                        onChange={e => setSearch(e.currentTarget.value)}
                        placeholder="Search name or nationality…"
                        value={search}
                    />
                </InputGroup>

                <div className="f1-control-group">
                    {CATEGORIES.map(c => (
                        <Pill active={category === c.key} key={c.key} onClick={() => setCategory(c.key)}>
                            {c.label}
                        </Pill>
                    ))}
                </div>
            </div>

            <Card className="f1-table-card">
                <DataTable table={table} />
            </Card>
        </div>
    );
};
