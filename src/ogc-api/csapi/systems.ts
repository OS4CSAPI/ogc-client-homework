/**
 * OGC API – Connected Systems Part 2: Systems Client
 * Implements client-side access for the /systems collection.
 *
 * Traces to:
 *   - /req/system/collection-endpoint  (23-002 §10.1)
 *   - /req/system/items-endpoint       (23-002 §10.2)
 *   - /req/canonical-endpoints/systems (23-002 §7.4)
 *
 * Exports:
 *   - SystemsClient: main API client class
 */

import { CSAPICollection } from "./model";
import { maybeFetchOrLoad } from "./helpers";
import { getSystemsUrl } from "./url_builder";

/**
 * SystemsClient
 * Provides typed access to the /systems collection and its items.
 */
export class SystemsClient {
  readonly apiRoot: string;

  constructor(apiRoot: string) {
    this.apiRoot = apiRoot;
  }

  /**
   * Retrieves the systems collection.
   * Uses fixture "systems" by default, or fetches live data when CSAPI_LIVE=true.
   */
  async list(): Promise<CSAPICollection> {
    const url = getSystemsUrl(this.apiRoot);
    const data = await maybeFetchOrLoad("systems", url);
    return data as CSAPICollection;
  }

  /**
   * Retrieves a single system by ID.
   * Example canonical path: /systems/{systemId}
   */
  async get(id: string): Promise<any> {
    const url = `${getSystemsUrl(this.apiRoot)}/${id}`;
    const data = await maybeFetchOrLoad(`system_${id}`, url);
    return data;
  }
}
