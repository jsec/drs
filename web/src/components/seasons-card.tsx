import type { ComponentPropsWithRef, ReactNode } from 'react';

import { Box, Group, Text } from '@mantine/core';
import { CaretRightIcon } from '@phosphor-icons/react';
import { createLink } from '@tanstack/react-router';

import { GridHeader } from './f1-ui';

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
        <Box className="f1-card" p={0}>
            <Group justify="space-between" px={20} py={15} wrap="nowrap">
                <Text fw={700} fz={15} inherit span>Seasons</Text>
                <Text c="dimmed" fz={12} inherit span>
                    Select a season to open its full dashboard
                </Text>
            </Group>
            <GridHeader columns={columns} px={20}>
                {header}
                <span />
            </GridHeader>
            {children}
        </Box>
    );
};

type SeasonRowAnchorProps = ComponentPropsWithRef<'a'> & {
    columns: string;
    isChampion: boolean;
    season: ReactNode;
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
            <a {...props} className="f1-stretched-link">{season}</a>
            {children}
            <CaretRightIcon color="var(--neutral-400)" size={14} />
        </div>
    );
};

export const SeasonRow = createLink(SeasonRowAnchor);
