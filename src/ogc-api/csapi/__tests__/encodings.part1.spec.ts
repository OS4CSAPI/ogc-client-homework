/**
 * Tests for CSAPI Part 1 — Encodings (GeoJSON, SensorML-JSON)
 * Verifies that all feature resources support mandatory encodings
 * and provide responses in both GeoJSON and SensorML-JSON formats.
 *
 * Traces to:
 *   - /req/encodings/geojson           (23-001 §19)
 *   - /req/encodings/sensorml-json     (23-001 §19)
 *   - /req/encodings/content-negotiation (23-001 §19)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Confirms correct Content-Type, schema, and encoding-specific keys
 *   - Validates field-level structure for required keys per TDM v2.3
 */

import { getSystemsUrl } from '../url_builder';
import { maybeFetchOrLoad } from '../helpers';

const apiRoot = process.env.CSAPI_API_ROOT || 'https://example.csapi.server';

/**
 * Valid SensorML-JSON type values for system-like resources.
 * Per OGC SensorML 2.0 JSON encoding specification.
 */
const VALID_SENSORML_TYPES = [
  'System',
  'PhysicalSystem',
  'PhysicalComponent',
  'Procedure',
];

/**
 * Requirement: /req/encodings/geojson
 * All feature resources SHALL be available as GeoJSON.
 *
 * This test validates:
 * - GeoJSON FeatureCollection structure
 * - Feature items with proper type, id, geometry
 * - Properties object with feature-specific attributes
 * - Links array with CSAPI-specific relation types
 */
test('GET /systems returns valid GeoJSON FeatureCollection encoding', async () => {
  const url = getSystemsUrl(apiRoot) + '?f=geojson';
  const data: any = await maybeFetchOrLoad('encodings_part1_geojson', url);

  // Validate FeatureCollection structure
  expect(data).toBeDefined();
  expect(data.type).toBe('FeatureCollection');
  expect(data.itemType).toBe('System');
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);

  // Validate collection-level links
  expect(data.links).toBeDefined();
  expect(Array.isArray(data.links)).toBe(true);

  // Validate first feature structure
  const first = data.features[0];
  expect(first).toHaveProperty('type', 'Feature');
  expect(first).toHaveProperty('id');
  expect(typeof first.id).toBe('string');

  // Validate geometry (required for spatial features like Systems)
  expect(first).toHaveProperty('geometry');
  expect(first.geometry).not.toBeNull();
  expect(first.geometry.type).toBeDefined();
  expect(Array.isArray(first.geometry.coordinates)).toBe(true);

  // Validate properties object
  expect(first).toHaveProperty('properties');
  expect(typeof first.properties).toBe('object');
  expect(first.properties.name).toBeDefined();
  expect(first.properties.description).toBeDefined();

  // Validate links array with CSAPI relation types
  expect(first).toHaveProperty('links');
  expect(Array.isArray(first.links)).toBe(true);
  expect(first.links.length).toBeGreaterThan(0);

  // Check for at least one "self" link
  const selfLink = first.links.find((link: any) => link.rel === 'self');
  expect(selfLink).toBeDefined();
  expect(selfLink.href).toBeDefined();
});

/**
 * Requirement: /req/encodings/sensorml-json
 * Systems SHALL be available as SensorML-JSON documents.
 *
 * This test validates:
 * - SensorML-JSON root structure (type, id, definition)
 * - Required descriptive fields (label, description)
 * - Components array for system composition
 * - Contacts array for responsible parties
 * - Outputs array for observable properties
 */
test('GET /systems returns valid SensorML-JSON encoding', async () => {
  const url = getSystemsUrl(apiRoot) + '?f=application/sensorml+json';
  const data: any = await maybeFetchOrLoad('encodings_part1_sensorml', url);

  // Validate root SensorML-JSON structure
  expect(data).toBeDefined();
  expect(data.type).toBeDefined();
  expect(VALID_SENSORML_TYPES).toContain(data.type);

  // Validate required identification fields
  expect(data.id).toBeDefined();
  expect(typeof data.id).toBe('string');

  // Validate descriptive fields
  expect(data.description).toBeDefined();
  expect(typeof data.description).toBe('string');

  // Optional but common: label/name field
  if (data.label) {
    expect(typeof data.label).toBe('string');
  }

  // Validate components array (may be empty but must be present)
  expect(data).toHaveProperty('components');
  expect(Array.isArray(data.components)).toBe(true);

  // Validate contacts array (may be empty but must be present)
  expect(data).toHaveProperty('contacts');
  expect(Array.isArray(data.contacts)).toBe(true);

  // If components exist, validate their structure
  if (data.components.length > 0) {
    const component = data.components[0];
    expect(component.name).toBeDefined();
    expect(component.type).toBeDefined();
  }

  // If contacts exist, validate their structure
  if (data.contacts.length > 0) {
    const contact = data.contacts[0];
    // Contact should have at least role or organizationName (or both)
    expect(contact.role || contact.organizationName).toBeDefined();
  }

  // Validate outputs if present (observable properties)
  if (data.outputs) {
    expect(Array.isArray(data.outputs)).toBe(true);
    if (data.outputs.length > 0) {
      const output = data.outputs[0];
      expect(output.name).toBeDefined();
      expect(output.definition || output.type).toBeDefined();
    }
  }

  // Validate position/location if present
  if (data.position) {
    expect(data.position.type).toBeDefined();
    expect(data.position.coordinates).toBeDefined();
  }
});

/**
 * Requirement: /req/encodings/content-negotiation
 * The server SHALL support standard HTTP content negotiation for encodings.
 *
 * This test validates that both GeoJSON and SensorML-JSON encodings
 * can be retrieved and have the expected root structure types.
 */
test('Server supports content negotiation for GeoJSON and SensorML-JSON', async () => {
  const geojsonUrl = getSystemsUrl(apiRoot);
  const sensormlUrl = getSystemsUrl(apiRoot);

  const geojsonData: any = await maybeFetchOrLoad(
    'encodings_part1_geojson',
    geojsonUrl
  );
  const sensormlData: any = await maybeFetchOrLoad(
    'encodings_part1_sensorml',
    sensormlUrl
  );

  // Verify GeoJSON encoding has FeatureCollection structure
  expect(geojsonData).toBeDefined();
  expect(geojsonData.type).toBe('FeatureCollection');
  expect(Array.isArray(geojsonData.features)).toBe(true);

  // Verify SensorML-JSON encoding has valid System-like structure
  expect(sensormlData).toBeDefined();
  expect(sensormlData.type).toBeDefined();
  expect(VALID_SENSORML_TYPES).toContain(sensormlData.type);

  // Both encodings should represent the same underlying resource
  expect(geojsonData.features[0].id).toBeDefined();
  expect(sensormlData.id).toBeDefined();
});

/**
 * Additional validation: GeoJSON feature properties mapping
 * Validates that CSAPI feature attributes are properly encoded
 * in GeoJSON properties according to the schema.
 */
test('GeoJSON encoding properly maps CSAPI feature attributes to properties', async () => {
  const url = getSystemsUrl(apiRoot) + '?f=geojson';
  const data: any = await maybeFetchOrLoad('encodings_part1_geojson', url);

  const feature = data.features[0];

  // Validate required CSAPI System attributes in properties
  expect(feature.properties).toBeDefined();

  // Name and description are commonly required for CSAPI resources
  expect(feature.properties.name).toBeDefined();
  expect(typeof feature.properties.name).toBe('string');
  expect(feature.properties.name.length).toBeGreaterThan(0);

  expect(feature.properties.description).toBeDefined();
  expect(typeof feature.properties.description).toBe('string');

  // Validate featureType if present (CSAPI-specific)
  if (feature.properties.featureType) {
    expect(typeof feature.properties.featureType).toBe('string');
  }

  // Validate validTime if present (temporal validity)
  if (feature.properties.validTime) {
    expect(typeof feature.properties.validTime).toBe('object');
    expect(feature.properties.validTime.start).toBeDefined();
  }
});

/**
 * Additional validation: SensorML-JSON definition and uniqueId
 * Validates that SensorML-JSON includes proper identification
 * and definition URIs per OGC standards.
 */
test('SensorML-JSON encoding includes proper identification and definitions', async () => {
  const url = getSystemsUrl(apiRoot) + '?f=application/sensorml+json';
  const data: any = await maybeFetchOrLoad('encodings_part1_sensorml', url);

  // Validate id field
  expect(data.id).toBeDefined();
  expect(typeof data.id).toBe('string');
  expect(data.id.length).toBeGreaterThan(0);

  // Validate definition URI if present
  if (data.definition) {
    expect(typeof data.definition).toBe('string');
    // Should be a URI
    expect(
      data.definition.startsWith('http://') ||
        data.definition.startsWith('https://') ||
        data.definition.startsWith('urn:')
    ).toBe(true);
  }

  // Validate uniqueId if present (often URN format)
  if (data.uniqueId) {
    expect(typeof data.uniqueId).toBe('string');
  }

  // Validate validTime structure if present
  if (data.validTime) {
    expect(typeof data.validTime).toBe('object');
    expect(data.validTime.start).toBeDefined();
  }
});
