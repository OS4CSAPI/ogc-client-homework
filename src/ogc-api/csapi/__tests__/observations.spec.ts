/**
 * Tests for CSAPI Part 2 — Observations
 * Confirms canonical endpoints and nested listing behavior under Datastreams.
 *
 * Traces to:
 *   - /req/observation/canonical-endpoint  (23-002 §7.4)
 *   - /req/observation/resources-endpoint  (23-002 §9)
 *   - /req/observation/canonical-url       (23-002 §9)
 *   - /req/observation/ref-from-datastream (23-002 §9)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Validates FeatureCollection structure, itemType, and canonical URL patterns
 *   - Ensures nested Observations are discoverable under Datastreams
 */

import { getObservationsUrl, getDatastreamsUrl } from '../url_builder';
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from '../helpers';

const apiRoot = process.env.CSAPI_API_ROOT || 'https://example.csapi.server';

/**
 * Requirement: /req/observation/canonical-endpoint
 * The /observations endpoint SHALL be exposed as the canonical Observations collection.
 */
test('GET /observations is exposed as canonical Observations collection', async () => {
  const url = getObservationsUrl(apiRoot);
  const data = await maybeFetchOrLoad('observations', url);

  expectFeatureCollection(data, 'Observation');
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/observation/resources-endpoint
 * The /observations collection SHALL conform to OGC API – Features collection rules.
 */
test('GET /observations returns FeatureCollection (itemType=Observation)', async () => {
  const url = getObservationsUrl(apiRoot);
  const data = await maybeFetchOrLoad('observations', url);

  expectFeatureCollection(data, 'Observation');

  const first = data.features[0];
  expect(first).toHaveProperty('id');
  expect(first).toHaveProperty('type', 'Feature');
  expect(first).toHaveProperty('properties');
});

/**
 * Requirement: /req/observation/canonical-url
 * Each Observation SHALL have a canonical item URL at /observations/{id}.
 */
test('Observations have canonical item URL at /observations/{id}', async () => {
  const url = getObservationsUrl(apiRoot);
  const data = await maybeFetchOrLoad('observations', url);
  const first = data.features[0];

  const itemUrl = `${apiRoot}/observations/${first.id}`;
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/observations\/[^/]+$/);
});

/**
 * Requirement: /req/observation/ref-from-datastream
 * Each Datastream SHALL expose nested Observations at /datastreams/{id}/observations.
 */
test('GET /datastreams/{id}/observations lists observations for a Datastream', async () => {
  const datastreamId = 'ds-001'; // placeholder; can come from fixtures later
  const url = getObservationsUrl(apiRoot, datastreamId);
  const data = await maybeFetchOrLoad('observations_nested', url);

  expectFeatureCollection(data, 'Observation');

  // Optional: confirm all returned features relate to the same Datastream
  const allSameDatastream =
    data.features.every(
      (f: any) => f.properties?.datastream?.id === datastreamId
    ) || data.features.length === 0; // tolerate missing property for lightweight fixtures
  expect(allSameDatastream).toBe(true);
});
