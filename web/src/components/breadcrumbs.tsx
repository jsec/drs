import { CaretRightIcon } from '@phosphor-icons/react';
import { Link, useMatches } from '@tanstack/react-router';

type Crumb = {
    label: string;
    params?: Record<string, string | undefined>;
    to?: string;
};

export const Breadcrumbs = () => {
    const matches = useMatches();

    const crumbs: Crumb[] = matches.findLast(match => match.loaderData && 'crumbs' in match.loaderData)?.loaderData?.crumbs ?? [];

    return (
        <div style={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'nowrap',
            fontSize: 13.5,
            gap: 8,
            minWidth: 0,
        }}
        >
            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                const fontWeight = isLast ? 700 : 600;

                return (
                    <div
                        key={crumb.to ?? crumb.label}
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            flexWrap: 'nowrap',
                            gap: 8,
                        }}
                    >
                        {!isLast && crumb.to
                            ? (
                                    <Link
                                        params={crumb.params}
                                        style={{
                                            color: 'var(--mantine-primary-color-filled)',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            whiteSpace: 'nowrap',
                                        }}
                                        to={crumb.to}
                                    >
                                        {crumb.label}
                                    </Link>
                                )
                            : (
                                    <span style={{ fontWeight, whiteSpace: 'nowrap' }}>
                                        {crumb.label}
                                    </span>
                                )}
                        {!isLast && <CaretRightIcon color="var(--neutral-400)" size={11} />}
                    </div>
                );
            })}
        </div>
    );
};
