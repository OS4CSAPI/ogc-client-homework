/**
 * OGC API – Connected Systems (CSAPI)
 * Central module export entry point.
 *
 * This file exposes all client classes for dynamic import by the test harness
 * (see helpers.ts: CSAPI_CLIENT_MODE support).
 *
 * Conforms to OGC API – Connected Systems Parts 1 and 2 (OGC 23-001, 23-002)
 * and preserves naming conventions consistent with ogc-client patterns.
 */

export * from "./model";
export * from "./helpers";
export * from "./url_builder";

/* -------------------------------------------------------------------------- */
/*                         Individual Client Class Exports                    */
/* -------------------------------------------------------------------------- */
/**
 * Each client corresponds to a canonical CSAPI resource collection.
 * These clients are progressively implemented as part of the CSAPI
 * client module buildout.
 *
 * Example naming convention:
 *   - /systems              → SystemsClient
 *   - /deployments          → DeploymentsClient
 *   - /procedures           → ProceduresClient
 *   - /samplingFeatures     → SamplingFeaturesClient
 *   - /properties           → PropertiesClient
 *   - /datastreams          → DatastreamsClient
 *   - /observations         → ObservationsClient
 *   - /controlStreams       → ControlStreamsClient
 *   - /commands             → CommandsClient
 *   - /feasibility          → FeasibilityClient
 *   - /systemEvents         → SystemEventsClient
 *
 * All names are exported in PascalCase for automatic discovery by the
 * test harness via helpers.ts → maybeFetchOrLoad().
 */

export { SystemsClient } from "./systems";
export { DeploymentsClient } from "./deployments";
export { ProceduresClient } from "./procedures";
export { SamplingFeaturesClient } from "./samplingFeatures";
export { PropertiesClient } from "./properties";
export { DatastreamsClient } from "./datastreams";
export { ObservationsClient } from "./observations";
export { ControlStreamsClient } from "./controlStreams";
export { CommandsClient } from "./commands";
export { FeasibilityClient } from "./feasibility";
export { SystemEventsClient } from "./systemEvents";

/* -------------------------------------------------------------------------- */
/*                      Aggregate Export for Harness Discovery                 */
/* -------------------------------------------------------------------------- */
/**
 * Provides a unified export of all client classes for the test harness or
 * dynamic runtime discovery via helpers.ts (CSAPI_CLIENT_MODE).
 */
export const CSAPIClients = {
  SystemsClient,
  DeploymentsClient,
  ProceduresClient,
  SamplingFeaturesClient,
  PropertiesClient,
  DatastreamsClient,
  ObservationsClient,
  ControlStreamsClient,
  CommandsClient,
  FeasibilityClient,
  SystemEventsClient,
};
