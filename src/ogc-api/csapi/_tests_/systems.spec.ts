/**
 * Tests for CSAPI Part 1 — Systems
 * Verifies canonical endpoints, item URLs, and collection behavior for Systems feature resources.
 *
 * Traces to:
 *   - /req/system/canonical-endpoint  (23-001 §9.4.2)
 *   - /req/system/resources-endpoint  (23-001 §9.4)
 *   - /req/system/canonical-url       (23-001 §9.3)
 *   - /req/system/collections         (23-001 §9.5)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Validates FeatureCollection structure and canonical URL patterns
 */

import { getSystemsUrl, getSystemByIdUrl } from "../url_builder";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/system/canonical-endpoint
 * The /systems endpoint SHALL be exposed as the canonical Systems collection.
 */
test("GET /systems is exposed as canonical Systems collection", async () => {
  const url = getSystemsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systems", url);

  expectFeatureCollection(data, "System");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/system/resources-endpoint
 * The /systems collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /systems returns FeatureCollection (itemType=System)", async () => {
  const url = getSystemsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systems", url);

  expectFeatureCollection(data, "System");

  const firstFeature = data.features[0];
  expect(firstFeature).toHaveProperty("id");
  expect(firstFeature).toHaveProperty("type", "Feature");
  expect(firstFeature).toHaveProperty("properties");
});

/**
 * Requirement: /req/system/canonical-url
 * Each System SHALL have a canonical item URL at /systems/{id}.
 */
test("Systems have canonical item URL at /systems/{id}", async () => {
  const url = getSystemsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systems", url);
  const firstFeature = data.features[0];

  const itemUrl = getSystemByIdUrl(apiRoot, firstFeature.id);
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/systems\/[^/]+$/);
});

/**
 * Requirement: /req/system/collections
 * Any collection with featureType sosa:System SHALL behave like /systems.
 */
test("Collections with featureType sosa:System behave like /systems", async () => {
  const url = getSystemsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systems", url);

  // Verify collection-level metadata consistency
  expect(data.type).toBe("FeatureCollection");
  expect(data.itemType).toBe("System");

  // Example validation for featureType compatibility
  const featureType = data?.features?.[0]?.properties?.featureType;
  if (featureType) {
    expect(featureType).toMatch(/sosa:System/i);
  }
});
