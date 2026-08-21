//  @ts-check

import reactConfig from '@jarsec/eslint-config/react';
import onlyWarn from 'eslint-plugin-only-warn';

export default [
    ...reactConfig,
    {
        plugins: {
            onlyWarn,
        },
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/array-type': 'off',
            '@typescript-eslint/require-await': 'off',
            'unicorn/filename-case': 'off',
        },
    },
    {
        ignores: [
            'eslint.config.js',
            'postcss.config.cjs',
            'src/routeTree.gen.ts', 
            'dist/**',
            '*.gen.ts'
        ],
    },
];
