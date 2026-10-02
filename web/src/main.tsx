import { MantineProvider } from '@mantine/core';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { theme } from './lib/mantine-theme';
import { queryClient } from './lib/query/root-provider';
import { router } from './router';
import './styles/index.css';

const rootElement = document.querySelector('#app');

if (!rootElement) {
    throw new Error('Root element #app was not found.');
}

createRoot(rootElement).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                {import.meta.env.DEV && (
                    <TanStackDevtools
                        config={{
                            position: 'bottom-right',
                        }}
                        plugins={[
                            {
                                name: 'Tanstack Router',
                                render: <TanStackRouterDevtoolsPanel />,
                            },
                            {
                                name: 'Tanstack Query',
                                render: <ReactQueryDevtoolsPanel />,
                            },
                        ]}
                    />
                )}
            </QueryClientProvider>
        </MantineProvider>
    </StrictMode>,
);
