import type { Props as FlagProps } from 'country-flag-icons/react/3x2';
import type { ComponentProps, JSX, LazyExoticComponent } from 'react';

import { lazy, Suspense } from 'react';

type FlagComponent = (props: FlagProps) => JSX.Element;
type FlagLoader = () => Promise<{ default: FlagComponent }>;

const flagLoaders: Partial<Record<string, FlagLoader>> = {
    AR: () => import('country-flag-icons/react/3x2/AR'),
    AT: () => import('country-flag-icons/react/3x2/AT'),
    AU: () => import('country-flag-icons/react/3x2/AU'),
    BE: () => import('country-flag-icons/react/3x2/BE'),
    BR: () => import('country-flag-icons/react/3x2/BR'),
    CA: () => import('country-flag-icons/react/3x2/CA'),
    CH: () => import('country-flag-icons/react/3x2/CH'),
    CL: () => import('country-flag-icons/react/3x2/CL'),
    CN: () => import('country-flag-icons/react/3x2/CN'),
    CO: () => import('country-flag-icons/react/3x2/CO'),
    CZ: () => import('country-flag-icons/react/3x2/CZ'),
    DE: () => import('country-flag-icons/react/3x2/DE'),
    DK: () => import('country-flag-icons/react/3x2/DK'),
    EE: () => import('country-flag-icons/react/3x2/EE'),
    ES: () => import('country-flag-icons/react/3x2/ES'),
    FI: () => import('country-flag-icons/react/3x2/FI'),
    FR: () => import('country-flag-icons/react/3x2/FR'),
    GB: () => import('country-flag-icons/react/3x2/GB'),
    HK: () => import('country-flag-icons/react/3x2/HK'),
    HU: () => import('country-flag-icons/react/3x2/HU'),
    ID: () => import('country-flag-icons/react/3x2/ID'),
    IE: () => import('country-flag-icons/react/3x2/IE'),
    IL: () => import('country-flag-icons/react/3x2/IL'),
    IN: () => import('country-flag-icons/react/3x2/IN'),
    IT: () => import('country-flag-icons/react/3x2/IT'),
    JP: () => import('country-flag-icons/react/3x2/JP'),
    LI: () => import('country-flag-icons/react/3x2/LI'),
    MA: () => import('country-flag-icons/react/3x2/MA'),
    MC: () => import('country-flag-icons/react/3x2/MC'),
    MX: () => import('country-flag-icons/react/3x2/MX'),
    MY: () => import('country-flag-icons/react/3x2/MY'),
    NL: () => import('country-flag-icons/react/3x2/NL'),
    NZ: () => import('country-flag-icons/react/3x2/NZ'),
    PL: () => import('country-flag-icons/react/3x2/PL'),
    PT: () => import('country-flag-icons/react/3x2/PT'),
    RU: () => import('country-flag-icons/react/3x2/RU'),
    SE: () => import('country-flag-icons/react/3x2/SE'),
    TH: () => import('country-flag-icons/react/3x2/TH'),
    US: () => import('country-flag-icons/react/3x2/US'),
    UY: () => import('country-flag-icons/react/3x2/UY'),
    VE: () => import('country-flag-icons/react/3x2/VE'),
    ZA: () => import('country-flag-icons/react/3x2/ZA'),
    ZW: () => import('country-flag-icons/react/3x2/ZW'),
};

const cache = new Map<string, LazyExoticComponent<FlagComponent>>();

type Props = Omit<ComponentProps<FlagComponent>, 'title'> & {
    code: string;
};

export function CountryFlag({ code, ...props }: Props) {
    // eslint-disable-next-line @eslint-react/static-components -- flag components are memoized in the module-level cache, not recreated per render
    const Flag = getFlag(code.toUpperCase());

    if (!Flag) {
        return null;
    }

    return (
        <Suspense fallback={null}>
            {/* eslint-disable-next-line @eslint-react/static-components -- see above: Flag is a cached module-level component */}
            <Flag {...props} />
        </Suspense>
    );
}

function getFlag(code: string): LazyExoticComponent<FlagComponent> | null {
    const loader = flagLoaders[code];
    if (!loader) return null;

    let Flag = cache.get(code);

    if (!Flag) {
        Flag = lazy(loader);
        cache.set(code, Flag);
    }
    return Flag;
}
