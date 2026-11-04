import { describe, expect, it } from 'vitest';

import type { DriverLaps } from '#/lib/api/races';

import { paceChart } from './race-charts';

const BUTTON_2011_CANADA_LAP_SECONDS = [
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
    laps: BUTTON_2011_CANADA_LAP_SECONDS.map((seconds, index) => ({
        isPitLap: false,
        lap: index + 1,
        position: null,
        timeMs: Math.round(seconds * 1000),
    })),
};

describe('paceChart', () => {
    it('should plot every lap', () => {
        const result = paceChart([driver]);
        const plottedLaps = result.data.filter(row => 'BUT' in row);

        expect(plottedLaps).toHaveLength(70);
    });

    it('should set the axis ceiling above safety car laps and below the red flag lap', () => {
        const result = paceChart([driver]);

        expect(result.ceiling).toBeGreaterThan(144);
        expect(result.ceiling).toBeLessThan(185.6);
    });
});
