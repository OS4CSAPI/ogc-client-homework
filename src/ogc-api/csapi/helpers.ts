import { CSAPIParameter } from "./model";
import fs from "fs";
import path from "path";

/* -------------------------------------------------------------------------- */
/*                Core Parameter Extraction Utility (Unchanged)               */
/* -------------------------------------------------------------------------- */

/**
 * Extracts CSAPIParameter definitions from a parameter block.
 * Retained from original implementation.
 */
export function extractParameters(parameterBlock: Record<string, any>): CSAPIParameter[] {
  return Object.values(parameterBlock) as CSAPIParameter[];
}

/* -------------------------------------------------------------------------- */
/*         Hybrid Fixture / Live / Client Integration Helper Functions        */
/* -------------------------------------------------------------------------- */

/**
 * OGC API – Connected Systems Helpers
 * Provides hybrid data-access utilities for tests and client modules.
 * Modes:
 *   - Default: load from local fixtures
 *   - CSAPI_LIVE=true: fetch from live remote endpoint
 *   - CSAPI_CLIENT_MODE=true: call actual CSAPI client modules
 */

/* -------------------------------------------------------------------------- */
/*                               JSON Fetching                                */
/* -------------------------------------------------------------------------- */

/**
 * Fetch JSON from a live CSAPI endpoint.
 */
export async function fetchCollection(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/* -------------------------------------------------------------------------- */
/*                           Fixture Loading Utility                          */
/* -------------------------------------------------------------------------- */

/**
 * Load JSON from a local fixture path.
 * Example: fixtures/ogc-api/csapi/sample-data-hub/systems.json
 */
export function loadFixture(fixtureName: string): any {
  const fixturePath = path.resolve(
    process.cwd(),
    `fixtures/ogc-api/csapi/sample-data-hub/${fixtureName}.json`
  );

  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Fixture not found: ${fixturePath}`);
  }

  const raw = fs.readFileSync(fixturePath, "utf-8");
  return JSON.parse(raw);
}

/* -------------------------------------------------------------------------- */
/*                          Hybrid Accessor / Mode Switch                     */
/* -------------------------------------------------------------------------- */

/**
 * maybeFetchOrLoad
 * Unified entry point for test data.
 *
 * Resolution order:
 *   1. If CSAPI_CLIENT_MODE=true → call corresponding *Client module
 *   2. Else if CSAPI_LIVE=true → fetch from remote URL
 *   3. Else → load local fixture JSON
 */
export async function maybeFetchOrLoad(
  fixtureName: string,
  liveUrl?: string
): Promise<any> {
  const USE_CLIENT_MODE = process.env.CSAPI_CLIENT_MODE === "true";
  const USE_LIVE_MODE = process.env.CSAPI_LIVE === "true";

  // --- Mode 1: Dynamic client invocation ---
  if (USE_CLIENT_MODE) {
    try {
      const module = await import("./index");

      // Normalize fixture name (e.g., endpoint_systemEvents → SystemEventsClient)
      const base = fixtureName.replace(/^endpoint_/, "");
      const parts = base.split(/[^a-zA-Z0-9]/).filter(Boolean);
      const clientKey = parts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");
      const clientName = `${clientKey}Client`;

      const client = (module as any)[clientName];
      if (client?.list) {
        const apiRoot =
          process.env.CSAPI_API_ROOT || "https://example.csapi.server";
        return await client.list(apiRoot);
      } else if (client?.get) {
        const apiRoot =
          process.env.CSAPI_API_ROOT || "https://example.csapi.server";
        return await client.get(apiRoot);
      } else {
        console.warn(`[csapi:helpers] No callable client found for ${clientName}`);
      }
    } catch (err: any) {
      console.error(`[csapi:helpers] Client invocation failed: ${err.message}`);
    }
  }

  // --- Mode 2: Live fetch mode ---
  if (USE_LIVE_MODE && liveUrl) {
    return fetchCollection(liveUrl);
  }

  // --- Mode 3: Fixture fallback (default) ---
  return loadFixture(fixtureName);
}

/* -------------------------------------------------------------------------- */
/*                              Assertion Helpers                             */
/* -------------------------------------------------------------------------- */

/**
 * Validates that an object conforms to OGC FeatureCollection semantics.
 */
export function expectFeatureCollection(data: any, itemType?: string) {
  expect(data).toBeDefined();
  expect(data.type).toBe("FeatureCollection");
  expect(Array.isArray(data.features)).toBe(true);
  if (itemType) expect(data.itemType).toBe(itemType);
}

/**
 * Validates that a URL matches a canonical CSAPI pattern.
 */
export function expectCanonicalUrl(url: string, pattern: string | RegExp) {
  expect(url).toMatch(pattern);
}
