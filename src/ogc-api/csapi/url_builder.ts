/**
 * @license BSD-3-Clause
 * Copyright (c) 2024 OS4CSAPI contributors
 */

/**
 * OGC API – Connected Systems (CSAPI)
 * URL Builder Utilities (canonical endpoint patterns)
 *
 * Provides canonical URL construction helpers for all CSAPI resource collections.
 * Aligned with tests under __tests__/endpoints.part2.canonical.spec.ts.
 */

const DEFAULT_API_ROOT =
  process.env.CSAPI_API_ROOT ?? 'https://example.csapi.server';

/* -------------------------------------------------------------------------- */
/*                               Core Utilities                               */
/* -------------------------------------------------------------------------- */

export const buildCsapiUrl = (
  collection: string,
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
): string => {
  const path = id ? `/${collection}/${id}` : `/${collection}`;
  return `${apiRoot}${path}`;
};

/* -------------------------------------------------------------------------- */
/*                         Canonical Endpoint Exports                         */
/* -------------------------------------------------------------------------- */

export const CANONICAL_ENDPOINTS = [
  'systems',
  'deployments',
  'procedures',
  'samplingFeatures',
  'properties',
  'datastreams',
  'observations',
  'controlStreams',
  'commands',
  'feasibility',
  'systemEvents',
  'systemHistory',
];

/**
 * Convenience wrappers (expected by tests)
 * e.g. getSystemsUrl(apiRoot?) → returns canonical /systems URL.
 */

export const getSystemsUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('systems', apiRoot, id);

export const getDeploymentsUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('deployments', apiRoot, id);

export const getProceduresUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('procedures', apiRoot, id);

export const getSamplingFeaturesUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('samplingFeatures', apiRoot, id);

export const getPropertiesUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('properties', apiRoot, id);

export const getDatastreamsUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('datastreams', apiRoot, id);

export const getDatastreamByIdUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  datastreamId: string
) => buildCsapiUrl('datastreams', apiRoot, datastreamId);

export const getObservationsUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('observations', apiRoot, id);

export const getControlStreamsUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('controlStreams', apiRoot, id);

export const getCommandsUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('commands', apiRoot, id);

export const getFeasibilityUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('feasibility', apiRoot, id);

export const getSystemEventsUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('systemEvents', apiRoot, id);

export const getSystemHistoryUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  id?: string
) => buildCsapiUrl('systemHistory', apiRoot, id);

/**
 * Nested and alias helpers for tests that call e.g. getSystemEventsForSystemUrl()
 */
export const getSystemEventsForSystemUrl = (
  apiRoot: string = DEFAULT_API_ROOT,
  systemId: string
) => `${buildCsapiUrl('systems', apiRoot, systemId)}/events`;

/* -------------------------------------------------------------------------- */
/*                              Aggregate Helpers                             */
/* -------------------------------------------------------------------------- */

export const allCsapiCollections = (): string[] => [...CANONICAL_ENDPOINTS];

export const allCsapiUrls = (apiRoot: string = DEFAULT_API_ROOT): string[] =>
  CANONICAL_ENDPOINTS.map((c) => buildCsapiUrl(c, apiRoot));
