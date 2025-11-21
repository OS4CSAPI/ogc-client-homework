/**
 * @file model.spec.ts
 * Basic type validation for CSAPI model definitions.
 *
 * ## Scope and Purpose
 *
 * This file contains **minimal smoke tests** for CSAPI model interfaces defined in `model.ts`.
 * It is intentionally narrow in scope:
 *
 * - Tests basic instantiation of model types with representative data
 * - Verifies that TypeScript strict mode type checking works as expected
 * - Does NOT attempt to exhaustively validate all model interfaces
 *
 * ## Validation Strategy
 *
 * The CSAPI model layer (`CSAPIResource`, `CSAPICollection`, `CSAPISystem*`, etc.) is primarily
 * validated through:
 *
 * 1. **TypeScript Static Type Checking**: The type system enforces model contracts at compile time
 * 2. **Resource-Level Tests**: Domain-specific specs (systems.spec.ts, deployments.spec.ts, etc.)
 *    exercise model types with fixtures and API responses
 * 3. **This File**: Provides lightweight runtime smoke tests only
 *
 * ## Meta Requirements Coverage
 *
 * Per CSAPI Test Design Matrix v2.4:
 *
 * - **`part1/overview`** (all Part 1 resources share a common base model):
 *   Validated via TypeScript types and resource-level tests, not here
 *
 * - **`part1/collections-meta`** (CS collections extend Features semantics with `itemType`):
 *   Validated via TypeScript types and collection tests in resource specs, not here
 *
 * See Test Design Matrix v2.4 "Notes on Model Semantics Testing" for full rationale.
 */

import { CSAPIParameter } from '../model';

test('CSAPIParameter structure is valid', () => {
  const param: CSAPIParameter = {
    name: 'Elevation',
    description: 'Height above mean sea level',
    required: false,
    schema: {
      type: 'number',
      unit: 'ft',
      minimum: 0,
    },
  };

  expect(param.name).toBe('Elevation');
  expect(param.schema).toHaveProperty('type', 'number');
});
