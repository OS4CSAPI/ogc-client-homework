/**
 * OGC API – Connected Systems Part 2: Events Client
 * Implements client-side access for the /events collection.
 *
 * Traces to:
 *   - /req/event/collection-endpoint  (23-002 §11.1)
 *   - /req/event/items-endpoint       (23-002 §11.2)
 *   - /req/event/canonical-url        (23-002 §7.4)
 */

import { CSAPICollection } from "./model";
import { maybeFetchOrLoad } from "./helpers";
import { getEventsUrl } from "./url_builder";

/**
 * EventsClient
 * Provides typed access to the /events collection and its items.
 */
export class EventsClient {
  readonly apiRoot: string;

  constructor(apiRoot: string) {
    this.apiRoot = apiRoot;
  }

  /** Retrieves the events collection. */
  async list(): Promise<CSAPICollection> {
    const url = getEventsUrl(this.apiRoot);
    const data = await maybeFetchOrLoad("events", url);
    return data as CSAPICollection;
  }

  /** Retrieves a single event by ID. */
  async get(id: string): Promise<any> {
    const url = `${getEventsUrl(this.apiRoot)}/${id}`;
    const data = await maybeFetchOrLoad(`event_${id}`, url);
    return data;
  }
}
