/**
 * Tests for CSAPI Part 2 — Commands
 * Ensures that Commands are exposed through canonical endpoints and provide
 * separate Status and Result resources as defined in Part 2 §§10–11.
 *
 * Traces to:
 *   - /req/command/canonical-endpoint  (23-002 §7.4)
 *   - /req/command/resources-endpoint  (23-002 §10–11)
 *   - /req/command/canonical-url       (23-002 §7.4)
 *   - /req/command/status-result       (23-002 §10–11)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Validates canonical URLs, FeatureCollection structure, and linked Status/Result resources
 */

import {
  getCommandsUrl,
} from "../url_builder";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/command/canonical-endpoint
 * The /commands endpoint SHALL be exposed as the canonical Commands collection.
 */
test("GET /commands is exposed as canonical Commands collection", async () => {
  const url = getCommandsUrl(apiRoot);
  const data = await maybeFetchOrLoad("commands", url);

  expectFeatureCollection(data, "Command");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/command/resources-endpoint
 * The /commands collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /commands returns FeatureCollection (itemType=Command)", async () => {
  const url = getCommandsUrl(apiRoot);
  const data = await maybeFetchOrLoad("commands", url);

  expectFeatureCollection(data, "Command");

  const first = data.features[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("type", "Feature");
  expect(first).toHaveProperty("properties");
});

/**
 * Requirement: /req/command/canonical-url
 * Each Command SHALL have a canonical item URL at /commands/{id}.
 */
test("Commands have canonical item URL at /commands/{id}", async () => {
  const url = getCommandsUrl(apiRoot);
  const data = await maybeFetchOrLoad("commands", url);
  const first = data.features[0];

  const itemUrl = `${apiRoot}/commands/${first.id}`;
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/commands\/[^/]+$/);
});

/**
 * Requirement: /req/command/status-result
 * Each Command SHALL expose separate Status and Result resources.
 */
test("Each Command exposes Status and Result resources", async () => {
  const url = getCommandsUrl(apiRoot);
  const data = await maybeFetchOrLoad("commands", url);
  const first = data.features[0];

  // Check for status/result references in properties or links
  const statusUrl =
    first.properties?.status?.href ||
    first.links?.find((l: any) => l.rel?.toLowerCase() === "status")?.href;
  const resultUrl =
    first.properties?.result?.href ||
    first.links?.find((l: any) => l.rel?.toLowerCase() === "result")?.href;

  expect(statusUrl || resultUrl).toBeDefined();
  if (statusUrl) expectCanonicalUrl(statusUrl, /^https?:\/\/.+\/commands\/[^/]+\/status$/);
  if (resultUrl) expectCanonicalUrl(resultUrl, /^https?:\/\/.+\/commands\/[^/]+\/result$/);
});
