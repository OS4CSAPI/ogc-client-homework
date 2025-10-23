/**
 * @file model.spec.ts
 * Basic type validation for CSAPI model definitions.
 *
 * Ensures CSAPIParameter and related interfaces can be instantiated
 * with representative example data under strict mode.
 */

import { CSAPIParameter } from "../model";

test("CSAPIParameter structure is valid", () => {
  const param: CSAPIParameter = {
    name: "Elevation",
    description: "Height above mean sea level",
    required: false,
    schema: {
      type: "number",
      unit: "ft",
      minimum: 0,
    },
  };

  expect(param.name).toBe("Elevation");
  expect(param.schema).toHaveProperty("type", "number");
});
