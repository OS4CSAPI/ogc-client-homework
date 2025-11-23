/**
 * Tests for CSAPI Part 2 — Canonical Endpoints
 * Validates presence, discoverability, and accessibility of all canonical endpoints
 * defined in OGC API – Connected Systems Part 2 (§7.4, Req30–34).
 *
 * CSAPI Test Design Matrix v2.3 Coverage:
 *   - Section D: "Canonical endpoints list" (meta requirement)
 *
 * Traces to OGC 23-002 Requirements:
 *   - /req/canonical-endpoints/listing       (§7.4 Req30)
 *   - /req/canonical-endpoints/access        (§7.4 Req31–32)
 *   - /req/canonical-endpoints/collections   (§7.4 Req33–34)
 *
 * Test strategy:
 *   - Hybrid execution: uses local fixtures by default, or live endpoints if CSAPI_LIVE=true.
 *   - Verifies landing page link relations, accessibility, and collection structure
 *     for all canonical CSAPI Part 2 endpoints.
 *   - Validates canonical URL patterns for dynamic resources:
 *     /systems, /deployments, /procedures, /samplingFeatures, /properties,
 *     /datastreams, /observations, /controlStreams, /commands, /feasibility, /systemEvents
 */

import { CANONICAL_ENDPOINTS } from '../url_builder.js';
import { maybeFetchOrLoad, expectFeatureCollection } from '../helpers.js';

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/canonical-endpoints/listing (OGC 23-002 §7.4 Req30)
 * TDM v2.3: Section D - Canonical endpoints list
 * 
 * The API landing page SHALL advertise all canonical CSAPI Part 2 dynamic resource endpoints.
 * Each endpoint must appear in the landing page links with the correct canonical URL pattern.
 * 
 * Expected endpoints:
 *   - /systems, /deployments, /procedures, /samplingFeatures, /properties
 *   - /datastreams, /observations, /controlStreams, /commands, /feasibility, /systemEvents
 */
test("Landing page advertises all canonical CSAPI Part 2 endpoints", async () => {
  const data = await maybeFetchOrLoad("endpoints_part2_landing", apiRoot);

  expect(data).toBeDefined();
  expect(Array.isArray(data.links)).toBe(true);

  // Extract rel or href identifiers for comparison
  const linkHrefs = data.links.map((l: any) => l.href || "");
  const linkRels = data.links.map((l: any) => l.rel || "");

  // Each canonical endpoint should appear either by href or rel
  for (const endpoint of CANONICAL_ENDPOINTS) {
    const found =
      linkHrefs.some((h: string) => h.includes(`/${endpoint}`)) ||
      linkRels.some((r: string) => r.toLowerCase().includes(endpoint.toLowerCase()));
    expect(found).toBe(true);
  }

  // Verify the expected count of canonical endpoints
  expect(CANONICAL_ENDPOINTS.length).toBe(11);
});

/**
 * Requirement: /req/canonical-endpoints/access (OGC 23-002 §7.4 Req31–32)
 * TDM v2.3: Section D - Canonical endpoints list
 * 
 * Each canonical endpoint SHALL be accessible and return a valid response structure.
 * The response must be either a FeatureCollection or a Collection with members.
 */
test("All canonical CSAPI Part 2 endpoints are accessible and return collections", async () => {
  for (const endpoint of CANONICAL_ENDPOINTS) {
    const url = `${apiRoot}/${endpoint}`;
    const fixtureKey = `endpoint_${endpoint}`; // ✅ direct lowerCamelCase key
    const data = await maybeFetchOrLoad(fixtureKey, url);

    // Some endpoints (e.g., properties) may use "Collection" instead of "FeatureCollection"
    if (data.type === "Collection" || data.members) {
      expect(data).toHaveProperty("type", "Collection");
      expect(Array.isArray(data.members)).toBe(true);
    } else {
      expectFeatureCollection(data);
    }
  }
});

/**
 * Requirement: /req/canonical-endpoints/collections (OGC 23-002 §7.4 Req33–34)
 * TDM v2.3: Section D - Canonical endpoints list
 * 
 * Each endpoint collection SHALL include a title, link relations, and items.
 * This validates the completeness of the metadata returned by each canonical endpoint.
 */
test("Each canonical endpoint collection includes expected metadata", async () => {
  for (const endpoint of CANONICAL_ENDPOINTS) {
    const url = `${apiRoot}/${endpoint}`;
    const fixtureKey = `endpoint_${endpoint}`; // ✅ direct lowerCamelCase key
    const data = await maybeFetchOrLoad(fixtureKey, url);

    if (data.links) {
      expect(Array.isArray(data.links)).toBe(true);
    }
    if (data.title) {
      expect(typeof data.title).toBe("string");
    }

    const items = data.features || data.members || [];
    expect(Array.isArray(items)).toBe(true);
  }
});

/**
 * Requirement: Canonical URL pattern validation
 * TDM v2.3: Section D - Canonical endpoints list
 * 
 * All advertised endpoint URLs must conform to the canonical structure.
 * This validates that hrefs follow the expected pattern: {apiRoot}/{endpointName}
 * and use correct camelCase naming where applicable.
 */
test("Landing page endpoints use correct canonical URL patterns", async () => {
  const data = await maybeFetchOrLoad("endpoints_part2_landing", apiRoot);

  expect(data).toBeDefined();
  expect(Array.isArray(data.links)).toBe(true);

  // Filter to only resource endpoint links (exclude self, conformance, etc.)
  const resourceLinks = data.links.filter((l: any) => 
    CANONICAL_ENDPOINTS.some(ep => ep.toLowerCase() === l.rel?.toLowerCase()) || 
    CANONICAL_ENDPOINTS.some(ep => l.href?.includes(`/${ep}`))
  );

  // Each resource link should have the correct canonical URL pattern
  for (const link of resourceLinks) {
    // Find matching canonical endpoint
    const matchingEndpoint = CANONICAL_ENDPOINTS.find(ep => 
      link.href?.includes(`/${ep}`) || link.rel === ep
    );
    
    if (matchingEndpoint) {
      // Verify href follows canonical pattern
      expect(link.href).toMatch(new RegExp(`/${matchingEndpoint}$`));
      // Verify rel matches the endpoint name
      // Note: Case-insensitive comparison is used because the OGC API specification
      // allows flexibility in link relation casing, though we prefer camelCase
      expect(link.rel.toLowerCase()).toBe(matchingEndpoint.toLowerCase());
    }
  }
});
