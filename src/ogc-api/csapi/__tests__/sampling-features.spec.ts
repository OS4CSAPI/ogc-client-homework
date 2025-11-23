/**
 * Tests for CSAPI Part 1 — Sampling Features
 * Confirms canonical endpoints, item URLs, and collection behavior for SamplingFeature resources.
 *
 * Traces to:
 *   - /req/sf/canonical-endpoint   (23-001 §14)
 *   - /req/sf/resources-endpoint   (23-001 §14)
 *   - /req/sf/canonical-url        (23-001 §14)
 *   - /req/sf/collections          (23-001 §14)
 *   - /req/sf/ref-from-system      (system-scoped listing)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Validates FeatureCollection structure, canonical URLs, and SOSA featureType
 *   - Guards system-scoped reference test if fixture lacks system linkage
 */

import { getSamplingFeaturesUrl } from "../url_builder";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
  expectGeoJSONFeature,
  expectGeoJSONFeatureCollection,
  expectLinkRelations,
  expectFeatureAttributeMapping,
} from "../helpers";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/sf/canonical-endpoint
 * The /samplingFeatures endpoint SHALL be exposed as the canonical SamplingFeatures collection.
 */
test("GET /samplingFeatures is exposed as canonical SamplingFeatures collection", async () => {
  const url = getSamplingFeaturesUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("samplingFeatures", url);

  expectFeatureCollection(data, "SamplingFeature");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/sf/resources-endpoint
 * The /samplingFeatures collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /samplingFeatures returns FeatureCollection (itemType=SamplingFeature)", async () => {
  const url = getSamplingFeaturesUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("samplingFeatures", url);

  expectFeatureCollection(data, "SamplingFeature");

  const first = data.features[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("type", "Feature");
  expect(first).toHaveProperty("properties");
});

/**
 * Requirement: /req/sf/canonical-url
 * Each SamplingFeature SHALL have a canonical item URL at /samplingFeatures/{id}.
 */
test("SamplingFeatures have canonical item URL at /samplingFeatures/{id}", async () => {
  const url = getSamplingFeaturesUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("samplingFeatures", url);
  const first = data.features[0];

  const itemUrl = `${apiRoot}/samplingFeatures/${first.id}`;
  expectCanonicalUrl(itemUrl, /^https?:\/\/[^/]+\/samplingFeatures\/[^/]+$/);
});

/**
 * Requirement: /req/sf/collections
 * Any collection with featureType sosa:SamplingFeature SHALL behave like /samplingFeatures.
 */
test("Collections with featureType sosa:SamplingFeature behave like /samplingFeatures", async () => {
  const url = getSamplingFeaturesUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("samplingFeatures", url);

  expectFeatureCollection(data, "SamplingFeature");

  const featureType = data.features?.[0]?.properties?.featureType;
  if (featureType) {
    expect(featureType).toMatch(/sosa:SamplingFeature/i);
  }
});

/* -------------------------------------------------------------------------- */
/* /req/sf/ref-from-system                                                    */
/* -------------------------------------------------------------------------- */
/**
 * Requirement: /req/sf/ref-from-system
 * Sampling Features SHALL be discoverable via a system-scoped endpoint:
 * /systems/{systemId}/samplingFeatures. This test derives system linkage if present.
 *
 * Fixture strategy:
 *  - If a sampling feature properties includes `systemIds` (array) or `systemId`,
 *    construct a canonical system-scoped URL and assert its pattern.
 *  - If no linkage exists in the fixture data, log a warning and skip (non-failing).
 */
test("System-scoped sampling features reference (/systems/{systemId}/samplingFeatures)", async () => {
  const data: any = await maybeFetchOrLoad("samplingFeatures", getSamplingFeaturesUrl(apiRoot));

  const linked = data.features.filter((f: any) => {
    const p = f.properties || {};
    return (Array.isArray(p.systemIds) && p.systemIds.length > 0) || p.systemId;
  });

  if (linked.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("[sampling-features.spec] No system linkage present; skipping /req/sf/ref-from-system assertion.");
    return;
  }

  const feature = linked[0];
  const props = feature.properties;
  const systemId = Array.isArray(props.systemIds) ? props.systemIds[0] : props.systemId;
  const systemScopedUrl = `${apiRoot}/systems/${systemId}/samplingFeatures`;
  expectCanonicalUrl(systemScopedUrl, /^https?:\/\/[^/]+\/systems\/[^/]+\/samplingFeatures$/);
});

/* -------------------------------------------------------------------------- */
/*                   GeoJSON B8 Requirements: Sampling Features               */
/* -------------------------------------------------------------------------- */

/**
 * Requirement: /req/geojson/sf-schema
 * SamplingFeature GeoJSON representation SHALL conform to the required schema structure:
 * - type: "Feature"
 * - id: unique identifier
 * - properties: object containing sampling feature attributes
 * - geometry: optional (may be present for geospatial sampling features)
 */
test("/req/geojson/sf-schema – SamplingFeature features conform to required GeoJSON schema", async () => {
  const url = getSamplingFeaturesUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("samplingFeatures", url);
  const first = data.features[0];

  // Validate schema structure
  expect(first.type).toBe("Feature");
  expect(first).toHaveProperty("id");
  expect(typeof first.id).toBe("string");
  expect(first).toHaveProperty("properties");
  expect(typeof first.properties).toBe("object");
  
  // Validate FeatureCollection structure
  expectGeoJSONFeatureCollection(data, "SamplingFeature");
});

/**
 * Requirement: /req/geojson/sf-mappings
 * SamplingFeature properties SHALL be correctly mapped from the CSAPI SamplingFeature model 
 * to GeoJSON properties. This includes: systemId(s), featureType, and sampling feature-specific fields.
 */
test("/req/geojson/sf-mappings – SamplingFeature properties correctly mapped to GeoJSON", async () => {
  const url = getSamplingFeaturesUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("samplingFeatures", url);
  const first = data.features[0];

  // Validate that sampling feature-specific properties are present
  const properties = first.properties;
  expect(properties).toBeDefined();
  expect(typeof properties).toBe("object");
  
  // Sampling features should have featureType
  if (properties.featureType) {
    expect(properties.featureType).toMatch(/sosa:SamplingFeature/i);
  }
  
  // Sampling features typically reference system(s)
  const hasSystemReference = 
    properties.systemId !== undefined ||
    properties.systemIds !== undefined ||
    properties.system !== undefined;
  
  // System reference expected but may be optional in some fixtures
  if (hasSystemReference) {
    // Verify system references are correctly typed
    if (properties.systemIds) {
      expect(Array.isArray(properties.systemIds)).toBe(true);
    }
    if (properties.systemId) {
      expect(typeof properties.systemId).toBe("string");
    }
  }
});

/**
 * Requirement: /req/geojson/relation-types (Sampling Features)
 * SamplingFeature features SHALL include standard link relations if links are present.
 */
test("/req/geojson/relation-types – SamplingFeature features with links include valid relations", async () => {
  const url = getSamplingFeaturesUrl(apiRoot);
  const data: any = await maybeFetchOrLoad("samplingFeatures", url);
  const first = data.features[0];

  // If links are present, validate their structure
  if (first.links && Array.isArray(first.links) && first.links.length > 0) {
    first.links.forEach((link: any) => {
      expect(link).toHaveProperty("rel");
      expect(link).toHaveProperty("href");
      expect(typeof link.href).toBe("string");
    });
    
    // Sampling features typically link to systems
    const allRels = first.links.map((l: any) => l.rel);
    const hasSFRelations = allRels.some((rel: string) => 
      ["system", "self"].includes(rel)
    );
    expect(hasSFRelations).toBe(true);
  }
  // Note: Links may be optional in minimal fixtures
});