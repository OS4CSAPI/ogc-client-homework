/**
 * @file helpers.spec.ts
 * Unit tests for extractParameters() in CSAPI helpers.ts.
 *
 * Validates parameter extraction for structured inputs and ensures
 * graceful handling of empty, null, or undefined input.
 *
 * (Note: Updated import path after moving file into __tests__/)
 */

import { extractParameters } from '../helpers';

describe("CSAPI Helper Utilities", () => {
  test("extractParameters returns correct array for Elevation parameter", () => {
    const input = {
      Elevation: {
        id: 'Elevation',
        name: 'Elevation',
        observedProperty: { label: { id: 'Elevation', en: 'Elevation' } },
        unit: {
          label: { en: 'Elevation' },
          symbol: { value: 'ft', type: 'http://www.opengis.net/def/uom/UCUM/' },
        },
      },
    };
    const result = extractParameters(input);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('Elevation');
  });

  test("extractParameters returns correct array for flat object", () => {
    const input = { a: 1, b: 2, c: 3 };
    const result = extractParameters(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
  });

  test("extractParameters handles empty object gracefully", () => {
    const input = {};
    const result = extractParameters(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test("extractParameters handles null or undefined safely", () => {
    expect(extractParameters(null as any)).toEqual([]);
    expect(extractParameters(undefined as any)).toEqual([]);
  });
});
