import 'react';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface CSSProperties {
        '--circuit-layout-size'?: string;
        '--circuit-layout-src'?: string;
        '--cols'?: string;
        '--driver-color'?: string;
    }
}
