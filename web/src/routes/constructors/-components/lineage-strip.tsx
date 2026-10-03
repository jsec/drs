import { Group, Text } from '@mantine/core';
import { CaretRightIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';

import type { ConstructorSummary } from '#/lib/api/constructors';

type LineageStripProps = {
    currentId: string;
    lineage: ConstructorSummary['lineage'];
};

export const LineageStrip = ({ currentId, lineage }: LineageStripProps) => {
    if (lineage.length < 2) {
        return null;
    }

    return (
        <Group className="f1-card" gap={8} px={20} py={12}>
            <Text c="dimmed" fw={700} fz={11} inherit lts="0.06em" mr={4} span>LINEAGE</Text>
            {lineage.map((entry, i) => {
                const years = `${entry.yearFrom}–${entry.yearTo ?? ''}`;
                return (
                    <Fragment key={entry.order}>
                        {i > 0 ? <CaretRightIcon color="var(--neutral-400)" size={12} /> : null}
                        {entry.id === currentId
                            ? (
                                    <Text fw={700} fz={13} inherit span>
                                        {entry.name}
                                        <Text c="dimmed" className="f1-num" fz={12} inherit ml={6} span>{years}</Text>
                                    </Text>
                                )
                            : (
                                    <Link params={{ constructorId: entry.id }} style={{ color: 'inherit', textDecoration: 'none' }} to="/constructors/$constructorId">
                                        <Text c="dimmed" fw={600} fz={13} inherit span>
                                            {entry.name}
                                            <Text className="f1-num" fz={12} inherit ml={6} span>{years}</Text>
                                        </Text>
                                    </Link>
                                )}
                    </Fragment>
                );
            })}
        </Group>
    );
};
