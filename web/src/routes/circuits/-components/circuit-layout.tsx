import type { CSSProperties } from 'react';

import './circuit-layout.css';

type Props = {
    layoutId: string;
    name: string;
    size?: number;
};

export const CircuitLayout = ({ layoutId, name, size = 160 }: Props) => {
    return (
        <div
            aria-label={`${name} circuit layout`}
            className="circuit-layout"
            role="img"
            style={{
                '--circuit-layout-size': `${size}px`,
                '--circuit-layout-src': `url(/circuits/${layoutId}.svg)`,
            } as CSSProperties}
        />
    );
};
