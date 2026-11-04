import { describe, expect, it } from 'vitest';

import type { DriverLaps } from '#/lib/api/races';

import { paceChart } from './race-charts';

const BUTTON_2011_CANADA_S = [
    144, 126.6, 125.4, 123.3, 100.6, 98, 98.2, 117.8, 111.8, 130.7,
    125.6, 119.7, 102.2, 96.6, 96.6, 92.9, 96.1, 96.3, 122.7, 111.2,
    110.8, 105.5, 121.4, 137, 7503.8, 141.7, 127, 122.5, 122.3, 122.1,
    120.8, 122.5, 121.6, 119.8, 109.9, 95.5, 185.6, 103.8, 94.7, 91.6,
    95.1, 93.2, 91.7, 89.9, 89.5, 89.1, 90, 90.2, 89.2, 87.2,
    103.3, 90.2, 82.8, 83.9, 80.5, 80.2, 99.8, 106.6, 120.3, 120.3,
    80.7, 81.3, 80.4, 81.4, 78.9, 78, 77.5, 77.2, 77, 78.2,
];

const driver: DriverLaps = {
    color: '#ff8000',
    driver: { code: 'BUT', id: 'jenson-button' },
    laps: BUTTON_2011_CANADA_S.map((s, i) => ({ lap: i + 1, position: null, timeMs: Math.round(s * 1000) })),
};

const shownLaps = () =>
    paceChart([driver], true).data.filter(row => 'BUT' in row).map(row => row.lap);

describe('paceChart', () => {
    it('keeps wet laps when the race finishes on a dry track', () => {
        expect(shownLaps()).toEqual(expect.arrayContaining(['L5', 'L14', 'L40', 'L46', 'L50', 'L55', 'L65']));
    });

    it('hides safety car, red flag and pit laps', () => {
        for (const lap of ['L1', 'L20', 'L25', 'L29', 'L30', 'L37', 'L51', 'L59']) {
            expect(shownLaps()).not.toContain(lap);
        }
    });
});
