/**
 * OGC API – Connected Systems (CSAPI)
 * URL Builder Utilities (canonical endpoint patterns)
 *
 * Provides canonical URL construction helpers for all CSAPI resource collections.
 * Aligned with tests under __tests__/endpoints.part2.canonical.spec.ts.
 */

const DEFAULT_API_ROOT = process.env.CSAPI_API_ROOT ?? "https://example.csapi.server";

/* -------------------------------------------------------------------------- */
/*                               Core Utilities                               */
/* -------------------------------------------------------------------------- */

export const buildCsapiUrl = (collection: string, id?: string): string => {
  const path = id ? `/${collection}/${id}` : `/${collection}`;
  return `${DEFAULT_API_ROOT}${path}`;
};

/* -------------------------------------------------------------------------- */
/*                         Canonical Endpoint Exports                         */
/* -------------------------------------------------------------------------- */

export const CANONICAL_ENDPOINTS = [
  "systems",
  "deployments",
  "procedures",
  "samplingFeatures",
  "properties",
  "datastreams",
  "observations",
  "controlStreams",
  "commands",
  "feasibility",
  "systemEvents",
];

/**
 * Convenience wrappers (expected by tests)
 * e.g. getSystemsUrl(apiRoot?) → returns canonical /systems URL.
 */

export const getSystemsUrl          = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("systems", id);
export const getDeploymentsUrl      = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("deployments", id);
export const getProceduresUrl       = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("procedures", id);
export const getSamplingFeaturesUrl = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("samplingFeatures", id);
export const getPropertiesUrl       = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("properties", id);
export const getDatastreamsUrl      = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("datastreams", id);
export const getObservationsUrl     = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("observations", id);
export const getControlStreamsUrl   = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("controlStreams", id);
export const getCommandsUrl         = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("commands", id);
export const getFeasibilityUrl      = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("feasibility", id);
export const getSystemEventsUrl     = (apiRoot: string = DEFAULT_API_ROOT, id?: string) => buildCsapiUrl("systemEvents", id);

/**
 * Nested and alias helpers for tests that call e.g. getSystemEventsForSystemUrl()
 */
export const getSystemEventsForSystemUrl = (apiRoot: string = DEFAULT_API_ROOT, systemId: string) =>
  `${buildCsapiUrl("systems", systemId)}/events`;

/* -------------------------------------------------------------------------- */
/*                              Aggregate Helpers                              */
/* -------------------------------------------------------------------------- */

export const allCsapiCollections = (): string[] => [...CANONICAL_ENDPOINTS];
export const allCsapiUrls = (): string[] => CANONICAL_ENDPOINTS.map((c) => buildCsapiUrl(c));
