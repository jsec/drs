import type { ReactNode } from 'react';

import { Button, Card, Group, Text } from '@mantine/core';
import { TrophyIcon } from '@phosphor-icons/react';

import './f1-ui.css';

export const GOLD = 'var(--gold-500)';

const AVATAR_SIZE = { lg: 44, md: 30 } as const;
const BAR_HEIGHT = { lg: 26, md: 24, sm: 20 } as const;
const SQUARE_SIZE = { bar: { height: 30, width: 10 }, dot: { height: 14, width: 14 } } as const;

export const DriverAvatar = ({
    code,
    color,
    size = 'md',
}: {
    code: string;
    color: string;
    size?: keyof typeof AVATAR_SIZE;
}) => {
    const px = AVATAR_SIZE[size];
    return (
        <div
            style={{
                alignItems: 'center',
                background: color,
                borderRadius: '50%',
                color: '#fff',
                display: 'flex',
                flexShrink: 0,
                fontSize: px * 0.36,
                fontWeight: 700,
                height: px,
                justifyContent: 'center',
                width: px,
            }}
        >
            {code}
        </div>
    );
};

export const GridHeader = ({
    children,
    columns,
}: {
    children: ReactNode;
    columns: string;
}) => {
    return (
        <div
            style={{
                color: 'var(--mantine-color-dimmed)',
                display: 'grid',
                fontSize: 10.5,
                fontWeight: 700,
                gridTemplateColumns: columns,
                letterSpacing: '0.5px',
                padding: '0 18px 8px',
                textTransform: 'uppercase',
            }}
        >
            {children}
        </div>
    );
};

export const MiniStat = ({ label, value }: { label: string; value: ReactNode }) => {
    return (
        <Card className="f1-mini-stat">
            <div className="f1-num f1-display f1-mini-stat-value">
                {value}
            </div>
            <div className="f1-mini-stat-label">
                {label}
            </div>
        </Card>
    );
};

export const Pill = ({
    active,
    children,
    onClick,
    variant = 'solid',
}: {
    active: boolean;
    children: ReactNode;
    onClick: () => void;
    variant?: 'solid' | 'subtle';
}) => {
    return (
        <Button
            aria-pressed={active}
            className="f1-pill"
            data-active={active}
            onClick={onClick}
            size={variant === 'solid' ? 'sm' : 'xs'}
            type="button"
            variant={variant === 'solid' ? 'default' : 'subtle'}
        >
            {children}
        </Button>
    );
};

export const SectionCard = ({
    action,
    children,
    padded = true,
    subtitle,
    title,
}: {
    action?: ReactNode;
    children: ReactNode;
    padded?: boolean;
    subtitle?: string;
    title: string;
}) => {
    return (
        <Card>
            <Group align="flex-start" gap="md" justify="space-between" px={18} py={15} wrap="nowrap">
                <div>
                    <Text fw={700} fz={15}>{title}</Text>
                    {subtitle
                        ? <Text c="dimmed" fz={12} mt={2}>{subtitle}</Text>
                        : null}
                </div>
                {action}
            </Group>
            <div className="f1-section-card-body" data-flush={!padded}>
                {children}
            </div>
        </Card>
    );
};

export const StatCard = ({
    accent,
    icon,
    label,
    sub,
    value,
}: {
    accent: string;
    icon: ReactNode;
    label: string;
    sub: string;
    value: ReactNode;
}) => {
    return (
        <Card className="f1-stat-card">
            <div className="f1-stat-card-label-row">
                <span className="f1-stat-card-icon" style={{ color: accent }}>{icon}</span>
                <span className="f1-stat-card-label">
                    {label}
                </span>
            </div>
            <div className="f1-num f1-display f1-stat-card-value">
                {value}
            </div>
            <div className="f1-stat-card-sub">
                {sub}
            </div>
        </Card>
    );
};

export const TeamBar = ({
    color,
    size = 'lg',
}: {
    color: string;
    size?: keyof typeof BAR_HEIGHT;
}) => {
    return (
        <div
            style={{
                background: color,
                borderRadius: 4,
                flexShrink: 0,
                height: BAR_HEIGHT[size],
                width: 4,
            }}
        />
    );
};

export const TeamSquare = ({
    color,
    size = 'dot',
}: {
    color: string;
    size?: keyof typeof SQUARE_SIZE;
}) => {
    return (
        <div
            style={{
                background: color,
                borderRadius: 3,
                flexShrink: 0,
                height: SQUARE_SIZE[size].height,
                width: SQUARE_SIZE[size].width,
            }}
        />
    );
};

export const TrophyCount = ({ count }: { count: number }) => {
    if (count <= 0) {
        return null;
    }

    return (
        <span className="f1-trophy-count" style={{ fontSize: 13 }}>
            <TrophyIcon size={12} weight="fill" />
            {count}
        </span>
    );
};
