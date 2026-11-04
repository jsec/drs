import { createRouter } from '@tanstack/react-router';

import { RouteError } from './components/route-error';
import { RouteNotFound } from './components/route-not-found';
import { queryClient, STALE_TIME } from './lib/query/root-provider';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
    context: { queryClient },
    defaultErrorComponent: RouteError,
    defaultNotFoundComponent: RouteNotFound,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: STALE_TIME,
    routeTree,
    scrollRestoration: true,
});

declare module '@tanstack/react-router' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Register {
        router: typeof router;
    }
}
