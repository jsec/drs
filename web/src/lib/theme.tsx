import type { ReactNode } from 'react';

import { createContext, use, useEffect, useMemo, useState } from 'react';

type ResolvedTheme = 'dark' | 'light';
type Theme = 'dark' | 'light' | 'system';

type ThemeContextValue = {
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    theme: Theme;
    toggleTheme: () => void;
};

const STORAGE_KEY = 'drs-theme';
const ThemeContext = createContext<null | ThemeContextValue>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // eslint-disable-next-line @eslint-react/use-state -- public setter is the wrapped `setTheme` in the context value below
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);
    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

    useEffect(() => {
        const media = matchMedia('(prefers-color-scheme: dark)');
        const updateSystemTheme = () => setSystemTheme(media.matches ? 'dark' : 'light');

        media.addEventListener('change', updateSystemTheme);
        return () => media.removeEventListener('change', updateSystemTheme);
    }, []);

    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    useEffect(() => {
        document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    }, [resolvedTheme]);

    const value = useMemo<ThemeContextValue>(() => ({
        resolvedTheme,
        setTheme: (nextTheme) => {
            setThemeState(nextTheme);
            localStorage.setItem(STORAGE_KEY, nextTheme);
        },
        theme,
        toggleTheme: () => {
            const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
            setThemeState(nextTheme);
            localStorage.setItem(STORAGE_KEY, nextTheme);
        },
    }), [resolvedTheme, theme]);

    return (
        <ThemeContext value={value}>
            {children}
        </ThemeContext>
    );
};

export const useTheme = () => {
    const context = use(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider.');
    }
    return context;
};

const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line unicorn/prefer-includes-over-repeated-comparisons -- the equality chain narrows `stored` to Theme; includes() would not
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system';
};

const getSystemTheme = (): ResolvedTheme => {
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
