import { CSAPIParameter } from './model';

/**
 * Extracts CSAPIParameter definitions from a parameter block.
 * Retained from original implementation.
 */
export function extractParameters(parameterBlock: Record<string, any>): CSAPIParameter[] {
  return Object.values(parameterBlock) as CSAPIParameter[];
}

/* -------------------------------------------------------------------------- */
/*         Additional Helpers for Hybrid Fixture / Live Data Access           */
/* -------------------------------------------------------------------------- */

/**
 * OGC API – Connected Systems Helpers
 * Provides hybrid data-access utilities for tests and client modules.
 * Uses local fixtures by default, or live fetches when CSAPI_LIVE=true.
 */

import fs from "fs";
import path from "path";

/**
 * Fetch JSON from a live CSAPI endpoint.
 */
export async function fetchCollection(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  return response.json();
}

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

/**
 * Hybrid accessor: if CSAPI_LIVE=true, fetch live data;
 * otherwise load from local fixture.
 */
export async function maybeFetchOrLoad(
  fixtureName: string,
  liveUrl?: string
): Promise<any> {
  const useLive = process.env.CSAPI_LIVE === "true";
  if (useLive && liveUrl) {
    return fetchCollection(liveUrl);
  }
  return loadFixture(fixtureName);
}

/**
 * Simple validator utilities to help standardize test assertions.
 */
export function expectFeatureCollection(data: any, itemType?: string) {
  expect(data).toBeDefined();
  expect(data.type).toBe("FeatureCollection");
  expect(Array.isArray(data.features)).toBe(true);
  if (itemType) expect(data.itemType).toBe(itemType);
}

export function expectCanonicalUrl(url: string, pattern: string) {
  expect(url).toMatch(pattern);
}
