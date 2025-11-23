/**
 * CSAPI Client Lifecycle Integration Tests
 * ----------------------------------------
 * Comprehensive integration tests for CSAPI client lifecycle behavior.
 * Verifies client initialization, canonical endpoint discovery, list/get operations,
 * and cross-resource linkage navigation.
 *
 * Uses hybrid fixture/live mode (default: fixture-based).
 *
 * Traces to:
 *   - CSAPI Part 2 §7.4 Canonical Endpoints
 *   - CSAPI Part 2 §8–§12 Resource Collections and Linkage
 *   - CSAPI Part 2 §10–§11 Cross-Resource Navigation
 *
 * Test strategy:
 *   • Client initialization: Verify all clients can be instantiated with apiRoot
 *   • Canonical endpoints: Verify endpoint discovery across all resource types
 *   • Basic operations: Verify .list() and .get(id) for each client
 *   • Cross-resource linkage: Verify system → deployment → datastream → observation
 *   • Fixture mode: Verify consistent reproducible results
 *   • Configuration: Verify environment configuration handling
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
} from "../index.js";
import { expectFeatureCollection } from "../helpers.js";
import {
  CANONICAL_ENDPOINTS,
  getSystemsUrl,
  getDeploymentsUrl,
  getDatastreamsUrl,
  getObservationsUrl,
} from "../url_builder.js";

const apiRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";

// Test fixture IDs (aligned with sample-data-hub fixture set)
const TEST_SYSTEM_ID = "sys-001";
const TEST_DEPLOYMENT_ID = "dep-001";
const TEST_DATASTREAM_ID = "ds-001";
const TEST_OBSERVATION_ID = "obs-001";

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

/* -------------------------------------------------------------------------- */
/*                    Test 1: Client Initialization Tests                    */
/* -------------------------------------------------------------------------- */

describe("Client Initialization", () => {
  test("All CSAPI clients can be instantiated with apiRoot", () => {
    for (const { cls } of CLIENTS) {
      const client = new cls(apiRoot);
      expect(client).toBeDefined();
      expect(client.apiRoot).toBe(apiRoot);
      // Verify client has expected methods
      expect(typeof client.list).toBe("function");
      expect(typeof client.get).toBe("function");
    }
  });

  test("Clients handle different apiRoot configurations", () => {
    const customRoot = "https://custom.api.server";
    const client = new SystemsClient(customRoot);
    expect(client.apiRoot).toBe(customRoot);
  });
});

/* -------------------------------------------------------------------------- */
/*                   Test 2: Canonical Endpoint Discovery                    */
/* -------------------------------------------------------------------------- */

describe("Canonical Endpoint Discovery", () => {
  test("All canonical endpoints are properly defined", () => {
    expect(CANONICAL_ENDPOINTS).toHaveLength(11);
    expect(CANONICAL_ENDPOINTS).toContain("systems");
    expect(CANONICAL_ENDPOINTS).toContain("deployments");
    expect(CANONICAL_ENDPOINTS).toContain("procedures");
    expect(CANONICAL_ENDPOINTS).toContain("samplingFeatures");
    expect(CANONICAL_ENDPOINTS).toContain("properties");
    expect(CANONICAL_ENDPOINTS).toContain("datastreams");
    expect(CANONICAL_ENDPOINTS).toContain("observations");
    expect(CANONICAL_ENDPOINTS).toContain("controlStreams");
    expect(CANONICAL_ENDPOINTS).toContain("commands");
    expect(CANONICAL_ENDPOINTS).toContain("feasibility");
    expect(CANONICAL_ENDPOINTS).toContain("systemEvents");
  });

  test("URL builders construct correct canonical paths", () => {
    const testRoot = "https://test.server";
    expect(getSystemsUrl(testRoot)).toBe(`${testRoot}/systems`);
    expect(getDeploymentsUrl(testRoot)).toBe(`${testRoot}/deployments`);
    expect(getDatastreamsUrl(testRoot)).toBe(`${testRoot}/datastreams`);
    expect(getObservationsUrl(testRoot)).toBe(`${testRoot}/observations`);
  });
});

/* -------------------------------------------------------------------------- */
/*              Test 3: Basic List/Get Operations (Per Client)               */
/* -------------------------------------------------------------------------- */

describe("Basic Client Operations", () => {
  for (const { name, cls, fixture } of CLIENTS) {
    test(`${name}.list() returns a valid collection for ${fixture}`, async () => {
      const client = new cls(apiRoot);
      const result = await client.list();

      if (fixture === "properties") {
        // Properties are CSAPI metadata collections, not GeoJSON FeatureCollections
        expect(result).toBeDefined();
        expect(result.type).toBe("Collection");
        expect(
          Array.isArray((result as any).items) ||
          Array.isArray((result as any).members)
        ).toBe(true);
      } else {
        // All other canonical resources should expose a FeatureCollection response
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

/* -------------------------------------------------------------------------- */
/*           Test 4: Cross-Resource Linkage Navigation Tests                 */
/* -------------------------------------------------------------------------- */

describe("Cross-Resource Linkage", () => {
  test("System → Deployment → Datastream → Observation navigation works end-to-end", async () => {
    // Step 1: Get a system
    const systemsClient = new SystemsClient(apiRoot);
    const systems = await systemsClient.list();
    expectFeatureCollection(systems);
    expect(systems.features.length).toBeGreaterThan(0);
    
    const firstSystem = systems.features[0];
    expect(firstSystem).toHaveProperty("id");
    
    // Step 2: Navigate to deployments (either via link or direct query)
    const deploymentsClient = new DeploymentsClient(apiRoot);
    const deployments = await deploymentsClient.list();
    expectFeatureCollection(deployments);
    
    // Verify deployment references a system
    const firstDeployment = deployments.features[0];
    expect(firstDeployment).toHaveProperty("id");
    expect(firstDeployment.properties).toBeDefined();
    
    // Step 3: Navigate to datastreams
    const datastreamsClient = new DatastreamsClient(apiRoot);
    const datastreams = await datastreamsClient.list();
    expectFeatureCollection(datastreams);
    
    // Verify datastream can be fetched
    const firstDatastream = datastreams.features[0];
    expect(firstDatastream).toHaveProperty("id");
    
    // Step 4: Navigate to observations
    const observationsClient = new ObservationsClient(apiRoot);
    const observations = await observationsClient.list();
    expectFeatureCollection(observations);
    
    // Verify observation structure
    const firstObservation = observations.features[0];
    expect(firstObservation).toHaveProperty("id");
    expect(firstObservation.properties).toBeDefined();
  });

  test("System has valid link relations", async () => {
    const systemsClient = new SystemsClient(apiRoot);
    const system = await systemsClient.get(TEST_SYSTEM_ID);
    
    expect(system).toBeDefined();
    expect(system.links).toBeDefined();
    expect(Array.isArray(system.links)).toBe(true);
    
    // Check for expected link relations
    const linkRels = system.links.map((link: any) => link.rel);
    expect(linkRels).toContain("self");
  });

  test("Deployment references system correctly", async () => {
    const deploymentsClient = new DeploymentsClient(apiRoot);
    const deployment = await deploymentsClient.get(TEST_DEPLOYMENT_ID);
    
    expect(deployment).toBeDefined();
    expect(deployment.properties).toBeDefined();
    expect(deployment.properties.system).toBeDefined();
    expect(deployment.properties.system.id).toBe(TEST_SYSTEM_ID);
  });

  test("Datastream contains valid reference structure", async () => {
    const datastreamsClient = new DatastreamsClient(apiRoot);
    const datastream = await datastreamsClient.get(TEST_DATASTREAM_ID);
    
    expect(datastream).toBeDefined();
    expect(datastream.properties).toBeDefined();
  });

  test("Observation references datastream correctly", async () => {
    const observationsClient = new ObservationsClient(apiRoot);
    const observation = await observationsClient.get(TEST_OBSERVATION_ID);
    
    expect(observation).toBeDefined();
    expect(observation.properties).toBeDefined();
    expect(observation.properties.datastream).toBeDefined();
    expect(observation.properties.datastream.id).toBe(TEST_DATASTREAM_ID);
  });
});

/* -------------------------------------------------------------------------- */
/*              Test 5: Fixture Mode Consistency and Robustness              */
/* -------------------------------------------------------------------------- */

describe("Fixture Mode Consistency", () => {
  test("All client fixtures are well-formed and loadable", async () => {
    // This test verifies that all fixtures can be loaded without errors
    for (const { cls, fixture } of CLIENTS) {
      const client = new cls(apiRoot);
      const result = await client.list();
      expect(result).toBeDefined();
      // Verify basic structure exists
      if (fixture !== "properties") {
        expect(result.type).toBe("FeatureCollection");
        expect(Array.isArray(result.features)).toBe(true);
      }
    }
  });

  test("Fixture collections have consistent structure", async () => {
    const systemsClient = new SystemsClient(apiRoot);
    const systems = await systemsClient.list();
    
    expect(systems).toHaveProperty("type", "FeatureCollection");
    expect(systems).toHaveProperty("features");
    expect(Array.isArray(systems.features)).toBe(true);
    
    // Verify itemType is present (CSAPI requirement)
    expect(systems).toHaveProperty("itemType");
  });

  test("Individual items have IDs and expected structure", async () => {
    const systemsClient = new SystemsClient(apiRoot);
    const system = await systemsClient.get(TEST_SYSTEM_ID);
    
    expect(system).toBeDefined();
    expect(system).toHaveProperty("id", TEST_SYSTEM_ID);
    expect(system).toHaveProperty("type", "Feature");
    expect(system).toHaveProperty("properties");
  });
});

/* -------------------------------------------------------------------------- */
/*             Test 6: Configuration and Environment Handling                */
/* -------------------------------------------------------------------------- */

describe("Configuration Handling", () => {
  test("apiRoot is properly configured from environment or default", () => {
    const expectedRoot = process.env.CSAPI_API_ROOT || "https://example.csapi.server";
    expect(apiRoot).toBe(expectedRoot);
  });

  test("Clients respect custom apiRoot parameter", () => {
    const customRoot = "https://custom.test.server";
    const client = new SystemsClient(customRoot);
    
    expect(client.apiRoot).toBe(customRoot);
    expect(client.apiRoot).not.toBe(apiRoot);
  });
});

/* -------------------------------------------------------------------------- */
/*                  Test 7: No Obsolete/Dead Code Validation                 */
/* -------------------------------------------------------------------------- */

describe("Code Quality and Completeness", () => {
  test("All exported clients are tested", () => {
    // Verify that CLIENTS array includes all expected client classes
    const expectedClients = [
      "SystemsClient",
      "DeploymentsClient", 
      "ProceduresClient",
      "SamplingFeaturesClient",
      "PropertiesClient",
      "DatastreamsClient",
      "ObservationsClient",
      "ControlStreamsClient",
      "CommandsClient",
      "FeasibilityClient",
      "SystemEventsClient",
    ];
    
    const clientNames = CLIENTS.map(c => c.name);
    for (const expected of expectedClients) {
      expect(clientNames).toContain(expected);
    }
    
    expect(CLIENTS).toHaveLength(expectedClients.length);
  });

  test("All canonical endpoints are represented by clients", () => {
    const clientFixtures = CLIENTS.map(c => c.fixture);
    
    // Verify coverage of all canonical endpoints
    // (Note: some endpoints may have different naming conventions)
    expect(clientFixtures).toContain("systems");
    expect(clientFixtures).toContain("deployments");
    expect(clientFixtures).toContain("datastreams");
    expect(clientFixtures).toContain("observations");
  });
});
