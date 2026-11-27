import { Breadcrumbs as MantineBreadcrumbs } from '@mantine/core';
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
        <MantineBreadcrumbs
            fz={13.5}
            miw={0}
            separator={<CaretRightIcon color="var(--neutral-400)" size={11} />}
            style={{ flexWrap: 'nowrap' }}
        >
            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;

                if (!isLast && crumb.to) {
                    return (
                        <Link
                            key={crumb.to}
                            params={crumb.params}
                            style={{
                                color: 'var(--mantine-primary-color-filled)',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                            to={crumb.to}
                        >
                            {crumb.label}
                        </Link>
                    );
                }

                return (
                    <span key={crumb.to ?? crumb.label} style={{ fontWeight: isLast ? 700 : 600 }}>
                        {crumb.label}
                    </span>
                );
            })}
        </MantineBreadcrumbs>
    );
};
