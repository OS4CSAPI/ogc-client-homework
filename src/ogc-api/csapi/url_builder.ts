/**
 * OGC API – Connected Systems (CSAPI)
 * URL Builder Utilities
 *
 * Provides canonical URL construction for all CSAPI resource collections
 * and entities. Designed to align with endpoints tested in
 * `__tests__/endpoints.part2.canonical.spec.ts`.
 *
 * Conforms to OGC API – Connected Systems Part 2: Command and Control (OGC 23-002).
 */

const DEFAULT_API_ROOT = process.env.CSAPI_API_ROOT ?? "https://example.csapi.server";

/* -------------------------------------------------------------------------- */
/*                                Core Builder                                */
/* -------------------------------------------------------------------------- */

/**
 * Constructs a canonical CSAPI URL for a given collection and optional identifier.
 * @param collection Name of the CSAPI resource collection (e.g., "systems")
 * @param id Optional identifier for a specific resource
 * @returns Fully-qualified URL
 */
export const buildCsapiUrl = (collection: string, id?: string): string => {
  const path = id ? `/${collection}/${id}` : `/${collection}`;
  return `${DEFAULT_API_ROOT}${path}`;
};

/* -------------------------------------------------------------------------- */
/*                         Collection URL Convenience                         */
/* -------------------------------------------------------------------------- */

export const systemsUrl = (id?: string) => buildCsapiUrl("systems", id);
export const deploymentsUrl = (id?: string) => buildCsapiUrl("deployments", id);
export const proceduresUrl = (id?: string) => buildCsapiUrl("procedures", id);
export const samplingFeaturesUrl = (id?: string) => buildCsapiUrl("samplingFeatures", id);
export const propertiesUrl = (id?: string) => buildCsapiUrl("properties", id);
export const datastreamsUrl = (id?: string) => buildCsapiUrl("datastreams", id);
export const observationsUrl = (id?: string) => buildCsapiUrl("observations", id);
export const controlStreamsUrl = (id?: string) => buildCsapiUrl("controlStreams", id);
export const commandsUrl = (id?: string) => buildCsapiUrl("commands", id);
export const feasibilityUrl = (id?: string) => buildCsapiUrl("feasibility", id);
export const systemEventsUrl = (id?: string) => buildCsapiUrl("systemEvents", id);

/* -------------------------------------------------------------------------- */
/*                              Helper Utilities                              */
/* -------------------------------------------------------------------------- */

/**
 * Returns all known CSAPI collection names (useful for iterating in tests).
 */
export const allCsapiCollections = (): string[] => [
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
 * Utility: returns all canonical URLs for available collections.
 */
export const allCsapiUrls = (): string[] =>
  allCsapiCollections().map((c) => buildCsapiUrl(c));
