/**
 * Tests for OGC API – Connected Systems Part 1/2: Systems Client
 *
 * Traces to:
 *   - /req/system/resources-endpoint     (Systems collection endpoint)
 *   - /req/system/canonical-endpoint     (Individual system item endpoint)
 *   - /req/system/canonical-url          (Canonical URL pattern for item)
 *   - /req/system/collections            (Collection structure semantics)
 *   - /req/system/ref-to-events          (Nested system events)
 *
 * Strategy:
 *   - Hybrid fixture/live testing (maybeFetchOrLoad)
 *   - Validates SystemsClient list/get/listEvents/link resolution
 */

import { SystemsClient } from "../systems";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers";
import { getSystemsUrl, getSystemEventsUrl } from "../url_builder";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";
const client = new SystemsClient(apiRoot);

/* -------------------------------------------------------------------------- */
/*                          /req/system/resources-endpoint                    */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/resources-endpoint
 * The /systems endpoint SHALL expose a canonical listing endpoint.
 */
test("GET /systems is exposed as systems resources endpoint", async () => {
  const url = getSystemsUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("systems", url);

  expectFeatureCollection(data, "System");
  expect(Array.isArray(data.features)).toBe(true);
});

/* -------------------------------------------------------------------------- */
/*                           /req/system/collections                          */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/collections
 * The Systems collection SHALL be a valid FeatureCollection with >=1 features.
 */
test("Systems collection conforms to /req/system/collections semantics", async () => {
  const url = getSystemsUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("systems", url);
  expect(data.type).toBe("FeatureCollection");
  expect(data.itemType).toBe("System");
  expect(data.features.length).toBeGreaterThan(0);
});

/* -------------------------------------------------------------------------- */
/*                          /req/system/canonical-endpoint                    */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/canonical-endpoint
 * Each /systems/{id} SHALL return a valid System resource.
 */
test("GET /systems/{id} returns a valid System", async () => {
  const system = await client.get("sys-001");
  expect(system).toBeDefined();
  expect(system.id).toBe("sys-001");
  expect(system.type).toBeDefined();
  expect(Array.isArray(system.links)).toBe(true);
});

/* -------------------------------------------------------------------------- */
/*                             /req/system/canonical-url                      */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/canonical-url
 * Each System SHALL have a canonical URL at /systems/{id}.
 */
test("System items have canonical URL pattern /systems/{id}", async () => {
  const system = await client.get("sys-001");
  const url = `${apiRoot}/systems/${system.id}`;
  expectCanonicalUrl(url, /^https?:\/\/.+\/systems\/[^/]+$/);
});

/* -------------------------------------------------------------------------- */
/*                             /req/system/ref-to-events                      */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/system/ref-to-events
 * Systems SHALL expose nested events at /systems/{systemId}/events.
 */
test("GET /systems/{id}/events lists events for a System", async () => {
  const events: any = await client.listEvents("sys-001");
  expectFeatureCollection(events, "SystemEvent");
  expect(Array.isArray(events.features)).toBe(true);
});

/* -------------------------------------------------------------------------- */
/*                          Link Resolution Convenience                       */
/* -------------------------------------------------------------------------- */

/**
 * Client convenience: resolve link relations for a System (non-normative helper).
 */
test("getLinkedResources() returns rel→href mapping for a System", async () => {
  const links = await client.getLinkedResources("sys-001");
  expect(links).toBeDefined();
  expect(Object.keys(links)).toContain("self");
  expect(Object.keys(links)).toContain("events");
  expect(links.events).toMatch(/\/systems\/sys-001\/events/);
});
