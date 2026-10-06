import type { ComponentPropsWithRef, ReactNode } from 'react';

import { Text } from '@mantine/core';
import { CaretRightIcon } from '@phosphor-icons/react';
import { createLink } from '@tanstack/react-router';

import { GridHeader, SectionCard } from './f1-ui';

export const SeasonsCard = ({
    children,
    columns,
    header,
}: {
    children: ReactNode;
    columns: string;
    header: ReactNode;
}) => {
    return (
        <SectionCard
            action={<Text c="dimmed" fz={12}>Select a season to open its full dashboard</Text>}
            padded={false}
            title="Seasons"
        >
            <GridHeader columns={columns} px={20}>
                {header}
                <span />
            </GridHeader>
            {children}
        </SectionCard>
    );
};

type SeasonRowAnchorProps = ComponentPropsWithRef<'a'> & {
    columns: string;
    isChampion: boolean;
    season: number;
};

const SeasonRowAnchor = ({ children, columns, isChampion, season, ...props }: SeasonRowAnchorProps) => {
    return (
        <div
            className="f1-row f1-grid-row f1-stretched-row"
            style={{
                '--cols': columns,
                'background': isChampion ? 'color-mix(in srgb, var(--gold-500) 7%, transparent)' : undefined,
                'padding': '11px 20px',
            }}
        >
            <a {...props} className="f1-stretched-link">
                <Text className="f1-num f1-display" fw={700} fz={16} inherit lts="-0.4px" span>{season}</Text>
            </a>
            {children}
            <CaretRightIcon color="var(--neutral-400)" size={14} />
        </div>
    );
};

export const SeasonRow = createLink(SeasonRowAnchor);
