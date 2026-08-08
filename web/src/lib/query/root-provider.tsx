import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 300_000,
            staleTime: 60_000,
        },
    },
});
