import { describe, expect, it } from 'vitest';

import { formatYears } from './columns';

describe('formatYears', () => {
    it('renders an open range for an active driver', () => {
        expect(formatYears({ firstYear: 2007, isActive: true, lastYear: 2026 })).toBe('2007–');
    });

    it('renders a closed range for an inactive driver', () => {
        expect(formatYears({ firstYear: 1991, isActive: false, lastYear: 2012 })).toBe('1991–2012');
    });
});
