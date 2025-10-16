/**
 * OGC API – Connected Systems: ControlStreams Client
 * Implements client logic for CSAPI ControlStream resources (Part 2 §10–11)
 *
 * Mirrors Datastreams client for consistent pattern, adapted for actuation context.
 */

import { fetchJson } from "../../shared/http-utils";
import { expandUrl } from "../../shared/url-utils";
import { getControlStreamsUrl } from "./url_builder";

/**
 * ControlStream interface
 * Represents a stream of commands or actuation directives
 * issued to a System via a defined Procedure and Property.
 */
export interface ControlStream {
  id: string;
  type: "Feature";
  properties: {
    name?: string;
    description?: string;
    controlledProperty?: {
      id: string;
      href?: string;
    };
    procedure?: {
      id: string;
      href?: string;
    };
    system?: {
      id: string;
      href?: string;
    };
    commandType?: string;
    [key: string]: any;
  };
  links?: Array<{ href: string; rel: string; type?: string; title?: string }>;
  [key: string]: any;
}

/**
 * Retrieve all ControlStreams (FeatureCollection).
 */
export async function listControlStreams(
  apiRoot: string,
  options?: { fetchFn?: typeof fetch }
): Promise<{ type: string; features: ControlStream[] }> {
  const url = getControlStreamsUrl(apiRoot);
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Retrieve a specific ControlStream by ID.
 */
export async function getControlStreamById(
  apiRoot: string,
  id: string,
  options?: { fetchFn?: typeof fetch }
): Promise<ControlStream> {
  const url = `${getControlStreamsUrl(apiRoot)}/${encodeURIComponent(id)}`;
  const expanded = expandUrl(url);
  return fetchJson(expanded, options);
}

/**
 * Convenience export
 */
export const ControlStreamsClient = {
  list: listControlStreams,
  get: getControlStreamById,
};
