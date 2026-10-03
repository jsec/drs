import type { ComponentProps } from 'react';

const flagUrls = import.meta.glob<string>('/node_modules/country-flag-icons/3x2/*.svg', {
    eager: true,
    import: 'default',
    query: '?url&no-inline',
});

type Props = Omit<ComponentProps<'img'>, 'alt' | 'src'> & {
    code: string;
};

export function CountryFlag({ code, ...props }: Props) {
    const src = flagUrls[`/node_modules/country-flag-icons/3x2/${code.toUpperCase()}.svg`];

    if (!src) {
        return null;
    }

    return <img alt={`${code.toUpperCase()} flag`} src={src} {...props} />;
}
