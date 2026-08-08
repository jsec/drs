/*
 * Public API response types.
 *
 * Re-exports the tygo-generated interfaces (source of truth: the Go DTOs in
 * internal/seasons and internal/constructors) and adds the list aliases that
 * the app imports, preserving the names the former @drs/contracts package used.
 */

export type { ConstructorResponse } from './constructors.gen';
export type { WCC, WDC } from './seasons.gen';

import type { ConstructorResponse } from './constructors.gen';
import type { SeasonResponse as SeasonResponseGen, WCC } from './seasons.gen';

export type ListConstructorsResponse = ConstructorResponse[];

export type ListSeasonsResponse = SeasonResponse[];
/*
 * tygo types the nullable `wcc` pointer as optional; the wire value is null, not
 * undefined (the Go field has no omitempty). Corrected here to match the runtime.
 */
export type SeasonResponse = Omit<SeasonResponseGen, 'wcc'> & { wcc: null | WCC };
