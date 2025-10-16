/**
 * OGC API – Connected Systems: SystemEvents Client
 * Implements client logic for CSAPI SystemEvents resources (Part 2 §14–15)
 *
 * Provides access to system-level events and operational logs.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getSystemEventsUrl } from "./url_builder";

/**
 * SystemEvent interface
 * Represents a system-level event such as a state change, deployment update,
 * anomaly detection, or control/observation lifecycle notification.
 */
export interface SystemEvent {
  id: string;
  type: "Feature";
  properties: {
    time?: string;
    eventType?: string;
    description?: string;
    severity?: "info" | "warning" | "error" | "critical";
    relatedSystem?: { id: string; href?: string };
    relatedDeployment?: { id: string; href?: string };
    relatedProcedure?: { id: string; href?: string };
    [key: string]: any;
  };
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
  [key: string]: any;
}

/**
 * Retrieve all SystemEvents (FeatureCollection).
 */
export async function listSystemEvents(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: SystemEvent[] }> {
  const url = getSystemEventsUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific SystemEvent by ID.
 */
export async function getSystemEventById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<SystemEvent> {
  const url = `${getSystemEventsUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const SystemEventsClient = {
  list: listSystemEvents,
  get: getSystemEventById,
};
