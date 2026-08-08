import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import TanStackQueryDevtools from './lib/query/devtools';
import { queryClient } from './lib/query/root-provider';
import { ThemeProvider } from './lib/theme';
import { router } from './router';
import './styles/index.css';

const rootElement = document.querySelector('#app');

if (!rootElement) {
    throw new Error('Root element #app was not found.');
}

createRoot(rootElement).render(
    <StrictMode>
        <ThemeProvider>
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
                            TanStackQueryDevtools,
                        ]}
                    />
                )}
            </QueryClientProvider>
        </ThemeProvider>
    </StrictMode>,
);
