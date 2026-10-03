import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const config = defineConfig({
    plugins: [
        tanstackRouter({
            autoCodeSplitting: true,
        }),
        viteReact(),
    ],
    resolve: {
        dedupe: ['react', 'react-dom'],
        tsconfigPaths: true,
    },
    server: {
        proxy: {
            '/api': {
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
                target: 'http://localhost:3000',
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.ts',
    },
});

export default config;
