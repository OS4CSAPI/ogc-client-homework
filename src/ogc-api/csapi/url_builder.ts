/**
 * url_builder.ts
 * 
 * URL builder for OGC API – Common Standards API (CSAPI)
 *
 * This module provides utility methods for constructing valid URLs
 * targeting CSAPI endpoints, consistent with the ogc-client design
 * pattern used for OGC API - EDR and other standards.
 *
 * -------------------------------------------------------------------
 * CSAPI Part 1 – Core (Collections and Parameters)
 * CSAPI Part 2 – Dynamic Data
 * -------------------------------------------------------------------
 */

import { CSAPIParameter } from './model.js';
import { extractParameters } from './helpers.js';

/**
 * Main URL builder for OGC API – Common Standards API (CSAPI)
 */
export class CSAPIUrlBuilder {
  constructor(private baseUrl: string) {}

  /**
   * ------------------------------------------------------------
   * 🧩 CSAPI Part 1 – Core
   * ------------------------------------------------------------
   */

  /**
   * Get the base landing page URL.
   * Equivalent to `/` in most OGC API implementations.
   */
  landingPage(): string {
    return `${this.baseUrl}/`;
  }

  /**
   * Get the conformance URL.
   * Used to retrieve which parts/requirements of the CSAPI the server supports.
   */
  conformance(): string {
    return `${this.baseUrl}/conformance`;
  }

  /**
   * Get the collections URL.
   * Represents the entry point to all available collections.
   */
  collections(): string {
    return `${this.baseUrl}/collections`;
  }

  /**
   * Get the URL for a specific collection by ID.
   * @param collectionId - The identifier of the collection.
   */
  collection(collectionId: string): string {
    return `${this.collections()}/${collectionId}`;
  }

  /**
   * Get the URL for a collection’s parameter definitions.
   * Part 1 defines “parameters” as descriptive metadata for each collection.
   * @param collectionId - The identifier of the collection.
   */
  collectionParameters(collectionId: string): string {
    return `${this.collection(collectionId)}/parameters`;
  }

  /**
   * Build a URL for querying the data queries advertised by a collection.
   * Typically exposed in the collection’s metadata under `data_queries`.
   * @param collectionId - The identifier of the collection.
   * @param queryType - A named data query (e.g., "position", "area", etc.)
   */
  collectionDataQuery(collectionId: string, queryType: string): string {
    return `${this.collection(collectionId)}/${queryType}`;
  }

  /**
   * ------------------------------------------------------------
   * ⚙️ CSAPI Part 2 – Dynamic Data
   * ------------------------------------------------------------
   */

  /**
   * Build a URL for dynamic data resources within a collection.
   * Dynamic data provides access to real-time or frequently updated datasets.
   *
   * @param collectionId - The collection identifier.
   * @param parameterId - The specific parameter or data variable identifier.
   */
  dynamicData(collectionId: string, parameterId: string): string {
    return `${this.collection(collectionId)}/dynamic-data/${parameterId}`;
  }

  /**
   * Build a URL for accessing all available dynamic data endpoints for a collection.
   * Useful for discovering available variables or dynamic data types.
   * @param collectionId - The collection identifier.
   */
  dynamicDataRoot(collectionId: string): string {
    return `${this.collection(collectionId)}/dynamic-data`;
  }

  /**
   * ------------------------------------------------------------
   * 🔧 Utility Methods
   * ------------------------------------------------------------
   */

  /**
   * Attach query parameters to a given URL.
   * @param url - The base URL (e.g., from one of the above methods)
   * @param query - Key/value pairs to append as query parameters
   */
  withQuery(
    url: string,
    query: Record<string, string | number | boolean | undefined | null>
  ): string {
    const u = new URL(url);

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        u.searchParams.append(key, String(value));
      }
    });

    return u.toString();
  }

  /**
   * Convenience method to generate parameter metadata URLs
   * directly from a CSAPI collection object.
   * This leverages the `extractParameters()` helper.
   *
   * @param collectionId - The collection identifier
   * @param parameterBlock - The parameter metadata block from a collection
   */
  fromCollectionParameters(
    collectionId: string,
    parameterBlock: Record<string, any>
  ): string[] {
    const params = extractParameters(parameterBlock) as CSAPIParameter[];
    return params.map((p) =>
      this.collectionParameters(collectionId) + `#${p.id}`
    );
  }
}
export function buildQueryUrl(baseHref: string, queryType: string, format = 'json'): string {
  return `${baseHref}/${queryType}?f=${format}`;
}

