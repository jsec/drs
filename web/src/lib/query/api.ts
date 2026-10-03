import { notFound } from '@tanstack/react-router';
import ky from 'ky';

export const api = ky.create({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/',
    hooks: {
        afterResponse: [
            ({ response }) => {
                if (response.status === 404) {
                    throw notFound();
                }
            },
        ],
    },
    retry: {
        limit: 1,
    },
    timeout: 10_000,
});
