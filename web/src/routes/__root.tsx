import type { Icon } from '@phosphor-icons/react';
import type { QueryClient } from '@tanstack/react-query';

import {
    ActionIcon,
    AppShell,
    Burger,
    NavLink,
    useComputedColorScheme,
    useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    ChartPieSliceIcon,
    ClockCounterClockwiseIcon,
    FlagCheckeredIcon,
    MapTrifoldIcon,
    MoonIcon,
    SunIcon,
    UserListIcon,
    WrenchIcon,
} from '@phosphor-icons/react';
import {
    createRootRouteWithContext,
    Link,
    Outlet,
    useMatchRoute,
} from '@tanstack/react-router';

import { Breadcrumbs } from '#/components/breadcrumbs';
import { COMPLETED, CURRENT_YEAR, TOTAL_ROUNDS } from '#/data/fixtures';

type MyRouterContext = {
    queryClient: QueryClient;
};

type NavItem = {
    icon: Icon;
    label: string;
    to: string;
};

const navItems: NavItem[] = [
    {
        icon: ChartPieSliceIcon,
        label: 'Overview',
        to: '/',
    },
    {
        icon: ClockCounterClockwiseIcon,
        label: 'Seasons',
        to: '/seasons',
    },
    {
        icon: UserListIcon,
        label: 'Drivers',
        to: '/drivers',
    },
    {
        icon: WrenchIcon,
        label: 'Constructors',
        to: '/constructors',
    },
    {
        icon: MapTrifoldIcon,
        label: 'Circuits',
        to: '/circuits',
    },
];

const progressPct = Math.round((COMPLETED / TOTAL_ROUNDS) * 100);

const NAV_CLASS_NAMES = { body: 'f1-nav-body', label: 'f1-nav-label', root: 'f1-nav-item' };

const RootLayout = () => {
    const [isMobileOpen, { toggle: toggleMobile }] = useDisclosure(false);
    const [isCollapsed, { toggle: toggleCollapsed }] = useDisclosure(false);
    const { toggleColorScheme } = useMantineColorScheme();
    const colorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: false });
    const matchRoute = useMatchRoute();

    return (
        <AppShell
            header={{ height: 60 }}
            layout="alt"
            navbar={{
                breakpoint: 'sm',
                collapsed: { mobile: !isMobileOpen },
                width: isCollapsed ? 60 : 232,
            }}
            padding={28}
            transitionDuration={280}
            transitionTimingFunction="var(--ease-out)"
        >
            <AppShell.Navbar className="f1-sidebar" data-collapsed={isCollapsed} withBorder={false}>
                <div className="f1-brand">
                    <div className="f1-brand-mark">
                        <FlagCheckeredIcon color="#fff" size={19} weight="bold" />
                    </div>
                    <div className="f1-brand-text">
                        <div className="f1-brand-title">
                            DRS
                        </div>
                        <div className="f1-brand-subtitle">
                            F1 ANALYTICS
                        </div>
                    </div>
                </div>

                <AppShell.Section className="f1-nav-list" grow>
                    {navItems.map((item) => {
                        const isActive = !!matchRoute({
                            fuzzy: item.to !== '/',
                            to: item.to,
                        });
                        return (
                            <NavLink
                                active={isActive}
                                classNames={NAV_CLASS_NAMES}
                                component={Link}
                                key={item.label}
                                label={item.label}
                                leftSection={<item.icon size={18} weight={isActive ? 'fill' : 'regular'} />}
                                title={isCollapsed ? item.label : undefined}
                                to={item.to}
                            />
                        );
                    })}
                </AppShell.Section>

                <div className="f1-season-progress">
                    <div className="f1-season-progress-label">
                        {`${CURRENT_YEAR} SEASON`}
                    </div>
                    <div className="f1-season-progress-value">
                        <span className="f1-num f1-display f1-season-progress-count">
                            {COMPLETED}
                        </span>
                        <span className="f1-season-progress-total">
                            {`/ ${TOTAL_ROUNDS} rounds`}
                        </span>
                    </div>
                    <div className="f1-progress-track">
                        <div className="f1-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                </div>
            </AppShell.Navbar>

            <AppShell.Header className="f1-header">
                <Burger
                    aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}
                    hiddenFrom="sm"
                    onClick={toggleMobile}
                    opened={isMobileOpen}
                    size="sm"
                />
                <Burger
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    onClick={toggleCollapsed}
                    opened={!isCollapsed}
                    size="sm"
                    visibleFrom="sm"
                />
                <Breadcrumbs />
                <div className="f1-toolbar-spacer" />
                <ActionIcon
                    aria-label="Toggle color scheme"
                    onClick={toggleColorScheme}
                    size={36}
                    variant="default"
                >
                    {colorScheme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                </ActionIcon>
            </AppShell.Header>

            <AppShell.Main>
                <div className="f1-content-inner">
                    <Outlet />
                </div>
            </AppShell.Main>
        </AppShell>
    );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootLayout,
});
