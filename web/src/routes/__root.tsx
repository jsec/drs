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

const NAV_CLASS_NAMES = {
    body: 'f1-nav-body',
    label: 'f1-nav-label',
    root: 'f1-nav-item',
};

const NAVBAR_WIDTH = 232;
const NAVBAR_WIDTH_COLLAPSED = 60;

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
                width: isCollapsed ? NAVBAR_WIDTH_COLLAPSED : NAVBAR_WIDTH,
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
                            RACE ANALYTICS
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
                    <footer className="f1-footer">
                        This website is unofficial and is not associated in any way with the Formula 1 companies.
                        F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks
                        are trade marks of Formula One Licensing B.V.
                    </footer>
                </div>
            </AppShell.Main>
        </AppShell>
    );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootLayout,
});
