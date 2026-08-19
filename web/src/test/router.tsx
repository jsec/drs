import type { ReactNode } from 'react';

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

    const result = render(<RouterProvider router={router as never} />);

    return { ...result, router };
}

export function searchOf(router: { state: { location: { searchStr: string } } }) {
    return router.state.location.searchStr.replace(/^\?/, '');
}

export const testRoute: SortingRoute = {
    useNavigate: () => useNavigate() as ReturnType<SortingRoute['useNavigate']>,
    useSearch: () => useSearch({ strict: false }) as ReturnType<SortingRoute['useSearch']>,
};
