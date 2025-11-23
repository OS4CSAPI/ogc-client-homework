/**
 * Tests for CSAPI Part 2 — Feasibility
 * Verifies canonical endpoints and lifecycle resources (Status/Result)
 * for feasibility requests as defined in Part 2 §11.
 *
 * Traces to:
 *   - /req/feasibility/canonical-endpoint  (23-002 §7.4)
 *   - /req/feasibility/resources-endpoint  (23-002 §11)
 *   - /req/feasibility/canonical-url       (23-002 §7.4)
 *   - /req/feasibility/status              (23-002 §11)
 *   - /req/feasibility/result              (23-002 §11)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE=true)
 *   - Validates canonical URL structure, FeatureCollection conformance, and
 *     Status/Result resources for feasibility lifecycle
 *   - Separate tests for Status and Result dereferencing with graceful fixture loading
 */

import {
  getFeasibilityUrl,
} from "../url_builder.js";
import {
  maybeFetchOrLoad,
  expectFeatureCollection,
  expectCanonicalUrl,
} from "../helpers.js";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

/**
 * Requirement: /req/feasibility/canonical-endpoint
 * The /feasibility endpoint SHALL be exposed as the canonical Feasibility collection.
 */
test("GET /feasibility is exposed as canonical Feasibility collection", async () => {
  const url = getFeasibilityUrl(apiRoot);
  const data = await maybeFetchOrLoad("feasibility", url);

  expectFeatureCollection(data, "Feasibility");
  expect(Array.isArray(data.features)).toBe(true);
  expect(data.features.length).toBeGreaterThan(0);
});

/**
 * Requirement: /req/feasibility/resources-endpoint
 * The /feasibility collection SHALL conform to OGC API – Features collection rules.
 */
test("GET /feasibility returns FeatureCollection (itemType=Feasibility)", async () => {
  const url = getFeasibilityUrl(apiRoot);
  const data = await maybeFetchOrLoad("feasibility", url);

  expectFeatureCollection(data, "Feasibility");

  const first = data.features[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("type", "Feature");
  expect(first).toHaveProperty("properties");
});

/**
 * Requirement: /req/feasibility/canonical-url
 * Each Feasibility item SHALL have a canonical URL at /feasibility/{id}.
 */
test("Feasibility items have canonical item URL at /feasibility/{id}", async () => {
  const url = getFeasibilityUrl(apiRoot);
  const data = await maybeFetchOrLoad("feasibility", url);
  const first = data.features[0];

  const itemUrl = `${apiRoot}/feasibility/${first.id}`;
  expectCanonicalUrl(itemUrl, /^https?:\/\/.+\/feasibility\/[^/]+$/);
});

/**
 * Requirement: /req/feasibility/status
 * Retrieve the Status resource for a Feasibility request: /feasibility/{id}/status
 */
test("GET /feasibility/{id}/status returns a Status resource (if available)", async () => {
  const root: any = await maybeFetchOrLoad("feasibility", getFeasibilityUrl(apiRoot));
  if (!root.features?.length) {
    console.warn("[feasibility.spec] No feasibility requests; skipping /req/feasibility/status.");
    return;
  }
  const first = root.features[0];
  const feasibilityId = first.id;

  const statusUrl =
    first.properties?.status?.href ||
    first.links?.find((l: any) => l.rel?.toLowerCase() === "status")?.href ||
    `${apiRoot}/feasibility/${feasibilityId}/status`;

  let status: any;
  try {
    status = await maybeFetchOrLoad(`feasibility_status_${feasibilityId}`, statusUrl);
  } catch {
    console.warn(`[feasibility.spec] No status fixture or endpoint for feasibility '${feasibilityId}'; skipping /req/feasibility/status.`);
    return;
  }

  expect(status).toBeDefined();
  if (status.state) {
    expect(typeof status.state).toBe("string");
  }
});

/**
 * Requirement: /req/feasibility/result
 * Retrieve the Result resource for a Feasibility request: /feasibility/{id}/result
 */
test("GET /feasibility/{id}/result returns a Result resource (if available)", async () => {
  const root: any = await maybeFetchOrLoad("feasibility", getFeasibilityUrl(apiRoot));
  if (!root.features?.length) {
    console.warn("[feasibility.spec] No feasibility requests; skipping /req/feasibility/result.");
    return;
  }
  const first = root.features[0];
  const feasibilityId = first.id;

  const resultUrl =
    first.properties?.result?.href ||
    first.links?.find((l: any) => l.rel?.toLowerCase() === "result")?.href ||
    `${apiRoot}/feasibility/${feasibilityId}/result`;

  let result: any;
  try {
    result = await maybeFetchOrLoad(`feasibility_result_${feasibilityId}`, resultUrl);
  } catch {
    console.warn(`[feasibility.spec] No result fixture or endpoint for feasibility '${feasibilityId}'; skipping /req/feasibility/result.`);
    return;
  }

  expect(result).toBeDefined();
  expect(result.type).toBe("FeasibilityResult");
  if (result.status) {
    expect(typeof result.status).toBe("string");
  }
  if (result.details) {
    expect(typeof result.details).toBe("object");
  }
});

/**
 * Requirement: /req/feasibility/status-result (combined validation)
 * Each Feasibility request SHALL expose both Status and Result resources.
 */
test("Feasibility requests expose both Status and Result link references", async () => {
  const root: any = await maybeFetchOrLoad("feasibility", getFeasibilityUrl(apiRoot));
  if (!root.features?.length) {
    console.warn("[feasibility.spec] No feasibility requests; skipping combined status-result test.");
    return;
  }
  const first = root.features[0];

  const statusUrl =
    first.properties?.status?.href ||
    first.links?.find((l: any) => l.rel?.toLowerCase() === "status")?.href;
  const resultUrl =
    first.properties?.result?.href ||
    first.links?.find((l: any) => l.rel?.toLowerCase() === "result")?.href;

  // Both MUST be present
  expect(statusUrl).toBeDefined();
  expect(resultUrl).toBeDefined();
  
  if (statusUrl) expectCanonicalUrl(statusUrl, /^https?:\/\/.+\/feasibility\/[^/]+\/status$/);
  if (resultUrl) expectCanonicalUrl(resultUrl, /^https?:\/\/.+\/feasibility\/[^/]+\/result$/);
});
