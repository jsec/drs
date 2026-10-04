import type { ReactNode } from 'react';

import { Box, Group, Text } from '@mantine/core';
import { TrophyIcon } from '@phosphor-icons/react';

import { CountryFlag } from './country-flag';
import './career-hero.css';

export const CareerHero = ({
    badge,
    color,
    countryCode,
    fullName,
    mark,
    subtitle,
    title,
}: {
    badge?: string;
    color: string;
    countryCode: string;
    fullName?: string;
    mark?: ReactNode;
    subtitle: string;
    title: ReactNode;
}) => {
    return (
        <div className="career-hero" style={{ '--hero-color': color }}>
            <CountryFlag aria-hidden className="career-hero-flag" code={countryCode} />
            <div className="career-hero-content">
                {mark ? <div className="career-hero-mark">{mark}</div> : null}
                <div>
                    <Group gap={10} wrap="nowrap">
                        <Text className="f1-display" ff="var(--font-display)" fw={700} fz={30} inherit lts="-0.02em" span>
                            {title}
                        </Text>
                        {badge
                            ? (
                                    <Group className="career-hero-badge" gap={4} wrap="nowrap">
                                        <TrophyIcon size={13} weight="fill" />
                                        {badge}
                                    </Group>
                                )
                            : null}
                    </Group>
                    {fullName ? <div className="career-hero-full-name">{fullName}</div> : null}
                    <Box fz={13} mt={5} opacity={0.9}>
                        {subtitle}
                    </Box>
                </div>
            </div>
        </div>
    );
};
