import type { CSSProperties } from 'react';

import { cn } from '#/lib/utils';

import './circuit-layout.css';

type Props = {
    className?: string;
    layoutId: string;
    name: string;
    size?: number;
};

export const CircuitLayout = ({ className, layoutId, name, size = 160 }: Props) => {
    return (
        <div
            aria-label={`${name} circuit layout`}
            className={cn('circuit-layout', className)}
            role="img"
            style={{
                '--circuit-layout-size': `${size}px`,
                '--circuit-layout-src': `url(/circuits/${layoutId}.svg)`,
            } as CSSProperties}
        />
    );
};
