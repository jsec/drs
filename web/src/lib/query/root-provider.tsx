import { QueryClient } from '@tanstack/react-query';

export const STALE_TIME = 60_000;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 300_000,
            staleTime: STALE_TIME,
        },
    },
});
