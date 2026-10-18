import { notFound } from '@tanstack/react-router';
import ky from 'ky';

export const api = ky.create({
    baseUrl: '/api/',
    hooks: {
        afterResponse: [
            ({ response }) => {
                if (response.status === 404) {
                    throw notFound();
                }
            },
        ],
    },
    timeout: 10_000,
});
