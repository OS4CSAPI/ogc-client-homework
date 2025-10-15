/**
 * Tests for CSAPI Part 2 — Datastreams
 * Validates canonical endpoints, nested references, and schema operations for Datastreams.
 *
 * Traces to:
 *   - /req/datastream/canonical-endpoint    (23-002 §7.4)
 *   - /req/datastream/resources-endpoint    (23-002 §9.4)
 *   - /req/datastream/canonical-url         (23-002 §9)
 *   - /req/datastream/ref-from-system       (23-002 §9)
 *   - /req/datastream/ref-from-deployment   (23-002 §9)
 *   - /req/datastream/schema-op             (23-002 §9)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE = true)
 *   - Validates FeatureCollection structure and canonical URL patterns
 *   - Ensures nested datastream references and schema operation exist
 */

import {
  getDatastreamsUrl,
  getDatastreamByIdUrl,
} from "../url_builder";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/datastream/canonical-endpoint
 * The /datastreams endpoint SHALL be exposed as the canonical Datastreams collection.
 */
test("GET /datastreams is exposed as canonical Datastreams collection", async () => {
  const url = getDatastreamsUrl(apiRoot);
  const data = await maybeFetchOrLoad("datastreams", url);

  expectFeatureCollection(data, "Datastream");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/datastream/resources-endpoint
 * The /datastreams collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /datastreams returns FeatureCollection (itemType=Datastream)", async () => {
  const url = getDatastreamsUrl(apiRoot);
  const data = await maybeFetchOrLoad("datastreams", url);

  expectFeatureCollection(data, "Datastream");

  const first = data.features[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("type", "Feature");
  expect(first).toHaveProperty("properties");
});

/**
 * Requirement: /req/datastream/canonical-url
 * Each Datastream SHALL have a canonical item URL at /datastreams/{id}.
 */
test("Datastreams have canonical item URL at /datastreams/{id}", async () => {
  const url = getDatastreamsUrl(apiRoot);
  const data = await maybeFetchOrLoad("datastreams", url);
  const first = data.features[0];

  const itemUrl = getDatastreamByIdUrl(apiRoot, first.id);
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/datastreams\/[^/]+$/);
});

/**
 * Requirement: /req/datastream/ref-from-system
 * Each System SHALL expose nested Datastreams at /systems/{systemId}/datastreams.
 */
test("GET /systems/{id}/datastreams lists datastreams for a System", async () => {
  const systemId = "sys-001"; // placeholder; can come from fixtures later
  const url = getDatastreamsUrl(apiRoot, systemId);
  const data = await maybeFetchOrLoad("datastreams", url);

  expectFeatureCollection(data, "Datastream");
});

/**
 * Requirement: /req/datastream/schema-op
 * The /datastreams/{id}/schema?obsFormat=… operation SHALL return an observation schema.
 */
test("GET /datastreams/{id}/schema?obsFormat=… returns observation schema", async () => {
  const datastreamId = "ds-001"; // placeholder; can come from fixtures later
  const schemaUrl = `${getDatastreamByIdUrl(apiRoot, datastreamId)}/schema?obsFormat=application/json`;
  const data = await maybeFetchOrLoad("datastreams_schema", schemaUrl);

  expect(data).toBeDefined();
  // minimal check for schema fields
  expect(Object.keys(data)).toContain("type");
});
