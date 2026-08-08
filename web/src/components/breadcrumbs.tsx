import { CaretRightIcon } from '@phosphor-icons/react';
import { Link, useMatches } from '@tanstack/react-router';

export type Crumb = {
    label: string;
    params?: Record<string, string>;
    to?: string;
};

export const Breadcrumbs = () => {
    const matches = useMatches();

    const deepest = matches.findLast(
        (m): m is typeof m & { loaderData: { crumbs: Crumb[] } } =>
            !!(m.loaderData as undefined | { crumbs?: Crumb[] })?.crumbs,
    );

    const crumbs = deepest?.loaderData.crumbs ?? [];

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', fontSize: 13.5, gap: 8, minWidth: 0 }}>
            {crumbs.map((c: Crumb, i: number) => {
                const isLast = i === crumbs.length - 1;
                return (
                    <div key={c.to ?? c.label} style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 8 }}>
                        {c.to && !isLast
                            ? (
                                    <Link
                                        params={c.params}
                                        style={{
                                            color: 'var(--color-primary)',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            whiteSpace: 'nowrap',
                                        }}
                                        to={c.to}
                                    >
                                        {c.label}
                                    </Link>
                                )
                            : (
                                    <span style={{ fontWeight: isLast ? 700 : 600, whiteSpace: 'nowrap' }}>
                                        {c.label}
                                    </span>
                                )}
                        {isLast
                            ? null
                            : (
                                    <CaretRightIcon color="var(--neutral-400)" size={11} />
                                )}
                    </div>
                );
            })}
        </div>
    );
};
