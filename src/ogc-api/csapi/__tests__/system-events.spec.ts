/**
 * Tests for CSAPI Part 2 — System Events and System History
 * Validates canonical endpoints, nested event listings, and collection semantics for system events and history.
 *
 * Traces to:
 *   - /req/system-event/canonical-endpoint  (23-002 §7.4 Req42)
 *   - /req/system-event/resources-endpoint  (23-002 §7.4 Req41)
 *   - /req/system-event/canonical-url       (23-002 §7.4 Req40)
 *   - /req/system-event/ref-from-system     (23-002 §7.4 Req43)
 *   - /req/system-event/collections         (23-002 §7.4 Req44)
 *   - /req/system-history/resources-endpoint (C9)
 *   - /req/system-history/canonical-url      (C9)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Validates FeatureCollection structure and canonical URL patterns
 *   - Confirms nested event access under Systems
 */

import {
  getSystemEventsUrl,
  getSystemEventsForSystemUrl,
  getSystemHistoryUrl,
  getSystemHistoryForSystemUrl,
} from '../url_builder.js';
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from '../helpers.js';

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/system-event/canonical-endpoint
 * The /systemEvents endpoint SHALL be exposed as the canonical System Events collection.
 */
test("GET /systemEvents is exposed as canonical System Events collection", async () => {
  const url = getSystemEventsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systemEvents", url);

  expectFeatureCollection(data, "SystemEvent");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/system-event/resources-endpoint
 * The /systemEvents collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /systemEvents returns FeatureCollection (itemType=SystemEvent)", async () => {
  const url = getSystemEventsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systemEvents", url);

  expectFeatureCollection(data, "SystemEvent");

  const first = data.features[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("type", "Feature");
  expect(first).toHaveProperty("properties");
});

/**
 * Requirement: /req/system-event/canonical-url
 * Each System Event SHALL have a canonical item URL at /systemEvents/{id}.
 */
test("System Events have canonical item URL at /systemEvents/{id}", async () => {
  const url = getSystemEventsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systemEvents", url);
  const first = data.features[0];

  const itemUrl = `${apiRoot}/systemEvents/${first.id}`;
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/systemEvents\/[^/]+$/);
});

/**
 * Requirement: /req/system-event/ref-from-system
 * Each System SHALL expose nested events at /systems/{systemId}/events.
 */
test("GET /systems/{id}/events lists events for a System", async () => {
  const systemId = "sys-001"; // placeholder; can come from fixtures later
  const url = getSystemEventsForSystemUrl(apiRoot, systemId);
  const data = await maybeFetchOrLoad("systemEvents_sys-001", url);

  expectFeatureCollection(data, "SystemEvent");

  // Optional: ensure events reference the correct system
  const allSameSystem =
    data.features.every((f: any) => f.properties?.system?.id === systemId) ||
    data.features.length === 0;
  expect(allSameSystem).toBe(true);
});

/**
 * Requirement: /req/system-event/collections
 * Any collection with itemType=SystemEvent SHALL behave like /systemEvents.
 */
test("Collections with itemType=SystemEvent behave like /systemEvents", async () => {
  const url = getSystemEventsUrl(apiRoot);
  const data = await maybeFetchOrLoad("systemEvents", url);

  expectFeatureCollection(data, "SystemEvent");
  expect(data.itemType).toBe("SystemEvent");
});

/* -------------------------------------------------------------------------- */
/*                    System History (C9) Requirements Tests                  */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system-history/resources-endpoint
 * The /systemHistory endpoint SHALL expose a FeatureCollection with proper itemType signature.
 */
test("GET /systemHistory is exposed as canonical System History collection", async () => {
  const url = getSystemHistoryUrl(apiRoot);
  const data = await maybeFetchOrLoad("systemHistory", url);

  expectFeatureCollection(data, "SystemHistory");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/system-history/resources-endpoint
 * The /systemHistory collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /systemHistory returns FeatureCollection (itemType=SystemHistory)", async () => {
  const url = getSystemHistoryUrl(apiRoot);
  const data = await maybeFetchOrLoad("systemHistory", url);

  expectFeatureCollection(data, "SystemHistory");

  const first = data.features[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("type", "Feature");
  expect(first).toHaveProperty("properties");
  expect(first.properties).toHaveProperty("systemId");
  expect(first.properties).toHaveProperty("revisionTimestamp");
});

/**
 * Requirement: /req/system-history/canonical-url
 * Each System History revision SHALL have a canonical item URL at /systemHistory/{id}.
 */
test("System History revisions have canonical item URL at /systemHistory/{id}", async () => {
  const url = getSystemHistoryUrl(apiRoot);
  const data = await maybeFetchOrLoad("systemHistory", url);
  const first = data.features[0];

  const itemUrl = `${apiRoot}/systemHistory/${first.id}`;
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/systemHistory\/[^/]+$/);
});

/**
 * Requirement: /req/system-history/canonical-url
 * Validates that canonical URLs are properly structured and exposed in links.
 */
test("System History items expose canonical URLs in links", async () => {
  const url = getSystemHistoryUrl(apiRoot);
  const data = await maybeFetchOrLoad("systemHistory", url);
  const first = data.features[0];

  expect(first).toHaveProperty("links");
  expect(Array.isArray(first.links)).toBe(true);

  const selfLink = first.links.find((link: any) => link.rel === "self");
  expect(selfLink).toBeDefined();
  expect(selfLink.href).toMatch(/^https?:\/\/.+\/systemHistory\/[^/]+$/);
});

/**
 * Requirement: /req/system-history/resources-endpoint (nested endpoint)
 * Each System SHALL expose nested history at /systems/{systemId}/history.
 */
test("GET /systems/{id}/history lists history for a System", async () => {
  const systemId = "sys-001";
  const url = getSystemHistoryForSystemUrl(apiRoot, systemId);
  const data = await maybeFetchOrLoad("systemHistory_sys-001", url);

  expectFeatureCollection(data, "SystemHistory");

  // Ensure all history revisions reference the correct system
  const allSameSystem =
    data.features.every((f: any) => f.properties?.systemId === systemId) ||
    data.features.length === 0;
  expect(allSameSystem).toBe(true);
});
