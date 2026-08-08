import type { ReactNode } from 'react';

import { TrophyIcon } from '@phosphor-icons/react';

import {
    Button,
} from './ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import './f1-ui.css';

export const GOLD = 'var(--gold-500)';

export const DriverAvatar = ({
    code,
    color,
    size = 30,
}: {
    code: string;
    color: string;
    size?: number;
}) => {
    return (
        <div
            style={{
                alignItems: 'center',
                background: color,
                borderRadius: '50%',
                color: '#fff',
                display: 'flex',
                flexShrink: 0,
                fontSize: size * 0.36,
                fontWeight: 700,
                height: size,
                justifyContent: 'center',
                width: size,
            }}
        >
            {code}
        </div>
    );
};

export const GridHeader = ({
    children,
    columns,
    px = 18,
}: {
    children: ReactNode;
    columns: string;
    px?: number;
}) => {
    return (
        <div
            style={{
                color: 'var(--color-muted-foreground)',
                display: 'grid',
                fontSize: 10.5,
                fontWeight: 700,
                gridTemplateColumns: columns,
                letterSpacing: '0.5px',
                padding: `0 ${px}px 8px`,
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
            data-active={active}
            onClick={onClick}
            size={variant === 'solid' ? 'default' : 'sm'}
            type="button"
            variant={variant === 'solid' ? 'outline' : 'subtle'}
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
            <CardHeader>
                <div>
                    <CardTitle>{title}</CardTitle>
                    {subtitle
                        ? <CardDescription>{subtitle}</CardDescription>
                        : null}
                </div>
                {action}
            </CardHeader>
            <CardContent data-flush={!padded}>
                {children}
            </CardContent>
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
    height = 26,
    width = 4,
}: {
    color: string;
    height?: number;
    width?: number;
}) => {
    return (
        <div
            style={{
                background: color,
                borderRadius: width,
                flexShrink: 0,
                height,
                width,
            }}
        />
    );
};

export const TeamSquare = ({
    color,
    height = 14,
    width = 14,
}: {
    color: string;
    height?: number;
    width?: number;
}) => {
    return (
        <div
            style={{
                background: color,
                borderRadius: 3,
                flexShrink: 0,
                height,
                width,
            }}
        />
    );
};

export const TrophyCount = ({ count, size = 12 }: { count: number; size?: number }) => {
    if (count <= 0) {
        return null;
    }

    return (
        <span className="f1-trophy-count" style={{ fontSize: size + 1 }}>
            <TrophyIcon size={size} weight="fill" />
            {count}
        </span>
    );
};
