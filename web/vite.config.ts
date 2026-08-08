import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig({
    plugins: [
        devtools(),
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
});

export default config;
