/**
 * OGC API – Connected Systems: Datastreams Client
 * Implements client logic for CSAPI Datastream resources (Part 2 §10–11)
 *
 * Consistent with Systems, Procedures, and Properties clients.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getDatastreamsUrl } from "./url_builder";

/**
 * Datastream interface
 * Represents a stream of Observations associated with a System,
 * Property, and SamplingFeature.
 */
export interface Datastream {
  id: string;
  type: "Feature";
  properties: {
    name?: string;
    description?: string;
    observedProperty?: {
      id: string;
      href?: string;
    };
    procedure?: {
      id: string;
      href?: string;
    };
    featureOfInterest?: {
      id: string;
      href?: string;
    };
    unitOfMeasurement?: string;
    [key: string]: any;
  };
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
  [key: string]: any;
}

/**
 * Retrieve all Datastreams (FeatureCollection).
 */
export async function listDatastreams(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: Datastream[] }> {
  const url = getDatastreamsUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific Datastream by ID.
 */
export async function getDatastreamById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<Datastream> {
  const url = `${getDatastreamsUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const DatastreamsClient = {
  list: listDatastreams,
  get: getDatastreamById,
};
