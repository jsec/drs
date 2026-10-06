import { CaretRightIcon } from '@phosphor-icons/react';
import { Link, useMatches } from '@tanstack/react-router';

type Crumb = {
    label: string;
    params?: Record<string, string | undefined>;
    to?: string;
};

export const Breadcrumbs = () => {
    const matches = useMatches();

    const crumbs: Crumb[] = matches.findLast(m => m.loaderData && 'crumbs' in m.loaderData)?.loaderData?.crumbs ?? [];

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', fontSize: 13.5, gap: 8, minWidth: 0 }}>
            {crumbs.map((c, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                    <div key={c.to ?? c.label} style={{ alignItems: 'center', display: 'flex', flexWrap: 'nowrap', gap: 8 }}>
                        {!isLast && c.to
                            ? (
                                    <Link
                                        params={c.params}
                                        style={{
                                            color: 'var(--mantine-primary-color-filled)',
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
                        {!isLast && <CaretRightIcon color="var(--neutral-400)" size={11} />}
                    </div>
                );
            })}
        </div>
    );
};
