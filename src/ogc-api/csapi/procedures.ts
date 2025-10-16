/**
 * OGC API – Connected Systems: Procedures Client
 * Implements client logic for CSAPI Procedures resources (Part 2 § 10–11)
 *
 * Follows the same design as Systems and Deployments clients.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getProceduresUrl } from "./url_builder";

/**
 * Procedure interface
 * Represents a process or operation definition executed by a System or Deployment.
 */
export interface Procedure {
  id: string;
  type: "Feature";
  geometry?: any;
  properties: {
    name?: string;
    description?: string;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    linkedSystem?: {
      id: string;
      href?: string;
    };
    [key: string]: any;
  };
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
}

/**
 * Retrieve the list of all Procedures (FeatureCollection).
 */
export async function listProcedures(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: Procedure[] }> {
  const url = getProceduresUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific Procedure by ID.
 */
export async function getProcedureById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<Procedure> {
  const url = `${getProceduresUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const ProceduresClient = {
  list: listProcedures,
  get: getProcedureById,
};
