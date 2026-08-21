import type { ReactNode } from 'react';

import { MantineProvider } from '@mantine/core';
import {
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
    RouterProvider,
    useNavigate,
    useSearch,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';

import type { SortingRoute } from '#/components/data-table';

import { theme } from '#/lib/mantine-theme';

export async function renderWithRouter(ui: ReactNode, initialUrl = '/') {
    const rootRoute = createRootRoute();

    const indexRoute = createRoute({
        component: () => ui,
        getParentRoute: () => rootRoute,
        path: '/',
        validateSearch: (search: Record<string, unknown>) => search,
    });

    const router = createRouter({
        history: createMemoryHistory({ initialEntries: [initialUrl] }),
        routeTree: rootRoute.addChildren([indexRoute]),
    });

    await router.load();

    const result = render(
        <MantineProvider env="test" theme={theme}>
            <RouterProvider router={router as never} />
        </MantineProvider>,
    );

    return { ...result, router };
}

export function searchOf(router: { state: { location: { searchStr: string } } }) {
    return router.state.location.searchStr.replace(/^\?/, '');
}

export const testRoute: SortingRoute = {
    useNavigate: () => useNavigate() as ReturnType<SortingRoute['useNavigate']>,
    useSearch: () => useSearch({ strict: false }) as ReturnType<SortingRoute['useSearch']>,
};
