import { vi } from 'vitest';

Object.defineProperties(globalThis, {
    matchMedia: {
        value: vi.fn().mockImplementation((query: string) => ({
            addEventListener: vi.fn(),
            addListener: vi.fn(),
            dispatchEvent: vi.fn(),
            matches: false,
            media: query,
            onchange: null,
            removeEventListener: vi.fn(),
            removeListener: vi.fn(),
        })),
        writable: true,
    },
    ResizeObserver: {
        value: class ResizeObserverStub {
            disconnect = vi.fn();
            observe = vi.fn();
            unobserve = vi.fn();
        },
        writable: true,
    },
    scrollTo: {
        value: vi.fn(),
        writable: true,
    },
});
