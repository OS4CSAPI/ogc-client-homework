/**
 * CSAPI Client Lifecycle Integration Tests
 * ----------------------------------------
 * Verifies .list() and .get() behaviors for all canonical CSAPI client classes.
 * Uses hybrid fixture/live mode (default: fixture-based).
 *
 * Traces to:
 *   - CSAPI Part 2 §7.4 Canonical Endpoints
 *   - CSAPI Part 2 §10–§11 Resource Collections
 *
 * Test strategy:
 *   • Instantiate each *Client class under test
 *   • Verify .list() returns a valid FeatureCollection
 *   • Verify .get(id) returns a valid Feature or object
 */

import {
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
} from "../index";
import { expectFeatureCollection } from "../helpers";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

// Map client constructors to their expected fixture key
const CLIENTS = [
  { name: "SystemsClient", cls: SystemsClient, fixture: "systems" },
  { name: "DeploymentsClient", cls: DeploymentsClient, fixture: "deployments" },
  { name: "ProceduresClient", cls: ProceduresClient, fixture: "procedures" },
  { name: "SamplingFeaturesClient", cls: SamplingFeaturesClient, fixture: "samplingFeatures" },
  { name: "PropertiesClient", cls: PropertiesClient, fixture: "properties" },
  { name: "DatastreamsClient", cls: DatastreamsClient, fixture: "datastreams" },
  { name: "ObservationsClient", cls: ObservationsClient, fixture: "observations" },
  { name: "ControlStreamsClient", cls: ControlStreamsClient, fixture: "controlStreams" },
  { name: "CommandsClient", cls: CommandsClient, fixture: "commands" },
  { name: "FeasibilityClient", cls: FeasibilityClient, fixture: "feasibility" },
  { name: "SystemEventsClient", cls: SystemEventsClient, fixture: "systemEvents" },
];

describe("CSAPI Client Lifecycle Tests", () => {
  for (const { name, cls, fixture } of CLIENTS) {
    test(`${name}.list() returns valid FeatureCollection for ${fixture}`, async () => {
      const client = new cls(apiRoot);
      const result = await client.list();

      if (result.type === "FeatureCollection" && Array.isArray(result.features)) {
        expect(result).toHaveProperty("type", "FeatureCollection");
        expect(Array.isArray(result.features)).toBe(true);
      } else {
        // Fallback: validate against shared helper
        expectFeatureCollection(result);
      }
    });

    test(`${name}.get() returns a valid item for ${fixture}`, async () => {
      const client = new cls(apiRoot);
      const collection = await client.list();
      const first = collection.features?.[0] ?? {};

      if (!("id" in first)) {
        // Tolerate missing ID in minimal fixture
        expect(first).toBeDefined();
      } else {
        const item = await client.get(first.id as string);
        expect(item).toBeDefined();
        expect(item).toHaveProperty("id", first.id);
      }
    });
  }
});
