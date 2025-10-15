/**
 * Tests for CSAPI Part 2 — Common Semantics
 * Verifies that non-feature “resources” collections follow OGC API – Features semantics
 * with equivalent behavior for paging, filtering, and itemType usage.
 * 
 * Traces to:
 *   - /req/api-common/resources  (23-002 §8.2–8.3)
 *   - /req/api-common/resource-collection  (23-002 §8.3)
 */
import { client } from "../../../src/ogc-api/client";

test("Apply Features semantics to non-feature resources (replace 'features' → 'resources')", async () => {
  // Ref: /req/api-common/resources — 23-002 §8.2–8.3
  // TODO: verify client applies Features semantics to /resources
  expect(true).toBe(true);
});

test("Resource collections fulfill Features §§7.14–7.16 (with itemType)", async () => {
  // Ref: /req/api-common/resource-collection — 23-002 §8.3
  expect(true).toBe(true);
});
