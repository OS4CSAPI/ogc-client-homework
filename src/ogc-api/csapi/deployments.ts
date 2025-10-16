/**
 * OGC API – Connected Systems: Deployments Client
 * Implements client logic for CSAPI Deployments resources (Part 2 §10–11)
 *
 * Mirrors Systems client structure to ensure consistent design.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getDeploymentsUrl } from "./url_builder";

/**
 * Deployment interface
 * Represents a deployed configuration of Systems and Procedures.
 */
export interface Deployment {
  id: string;
  type: "Feature";
  geometry?: any;
  properties: {
    name?: string;
    description?: string;
    system?: {
      id: string;
      href?: string;
    };
    procedure?: {
      id: string;
      href?: string;
    };
    [key: string]: any;
  };
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
}

/**
 * Retrieve the list of all Deployments (FeatureCollection).
 */
export async function listDeployments(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: Deployment[] }> {
  const url = getDeploymentsUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific Deployment by ID.
 */
export async function getDeploymentById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<Deployment> {
  const url = `${getDeploymentsUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const DeploymentsClient = {
  list: listDeployments,
  get: getDeploymentById,
};
