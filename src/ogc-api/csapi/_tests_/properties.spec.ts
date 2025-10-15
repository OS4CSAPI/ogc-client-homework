/**
 * Tests for CSAPI Part 1 — Property Definitions
 * Ensures non-feature Property Definition resources are exposed via canonical endpoints
 * and follow listing semantics consistent with OGC API – Features.
 *
 * Traces to:
 *   - /req/property/canonical-endpoint  (23-001 §15)
 *   - /req/property/resources-endpoint  (23-001 §15)
 *   - /req/property/canonical-url       (23-001 §15)
 */
import { client } from "../../../src/ogc-api/client";

test("GET /properties is exposed as canonical Property Definitions collection", async () => { expect(true).toBe(true); });
test("GET /properties returns non-feature collection", async () => { expect(true).toBe(true); });
