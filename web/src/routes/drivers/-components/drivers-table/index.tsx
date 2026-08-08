import type { SortingState } from '@tanstack/react-table';

import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import type { AllTimeDriver } from '#/data/types';

import { DataTable, useDataTable } from '#/components/data-table';
import { Pill } from '#/components/f1-ui';
import { Card } from '#/components/ui/card';
import { Input, InputGroup } from '#/components/ui/input';

import { columns, fuzzy } from './columns';

export type Category = 'active' | 'all' | 'champions';
export type Sort = 'name' | 'poles' | 'starts' | 'titles' | 'wins';

export const CATEGORIES: { key: Category; label: string }[] = [
    { key: 'all', label: 'All drivers' },
    { key: 'champions', label: 'World Champions' },
    { key: 'active', label: 'Active' },
];

export const SORTS: { key: Sort; label: string }[] = [
    { key: 'titles', label: 'Titles' },
    { key: 'wins', label: 'Wins' },
    { key: 'poles', label: 'Poles' },
    { key: 'starts', label: 'Starts' },
    { key: 'name', label: 'Name' },
];

const route = getRouteApi('/drivers/');

type Props = {
    drivers: AllTimeDriver[];
};

export const DriversTable = ({ drivers }: Props) => {
    const { category = 'all', sort = 'titles' } = route.useSearch();
    const navigate = route.useNavigate();

    const setCategory = (next: Category) =>
        void navigate({ search: prev => ({ ...prev, category: next }) });
    const setSort = (next: Sort) =>
        void navigate({ search: prev => ({ ...prev, sort: next }) });

    const data = useMemo(
        () =>
            drivers.filter(
                d =>
                    category === 'all'
                    || (category === 'champions' ? d.titles > 0 : d.active),
            ),
        [drivers, category],
    );

    const sorting: SortingState = useMemo(
        () => [{ desc: sort !== 'name', id: sort }],
        [sort],
    );

    const { search, setSearch, table } = useDataTable({ columns, data, filter: fuzzy, sorting });

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

                <div className="f1-toolbar-spacer" />

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
                <DataTable table={table} />
            </Card>
        </div>
    );
};
