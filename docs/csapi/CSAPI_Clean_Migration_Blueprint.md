# CSAPI Clean Migration Blueprint

**Date:** 2024-11-25  
**Source Repository:** OS4CSAPI/ogc-client-homework  
**Target Repository:** New fork of camptocamp/ogc-client (main branch)  
**Purpose:** Step-by-step plan for rebuilding the CSAPI implementation with clean, reviewable commits

---

## Table of Contents

- [A. File-by-file Listing](#a-file-by-file-listing)
- [B. Commit Plan](#b-commit-plan)
- [C. Architectural Overview](#c-architectural-overview)
- [D. Documentation Guidance](#d-documentation-guidance)
- [E. Review/PR Notes](#e-reviewpr-notes)

---

## A. File-by-file Listing

This section catalogs all **118 KEEP files** organized by subsystem, with rationale and purpose for each.

### A.1 Core CSAPI Client Module (18 files)

**Location:** `src/ogc-api/csapi/`

| File | Purpose | OGC Spec Reference |
|------|---------|-------------------|
| `index.ts` | Module entry point; exports all clients and CSAPIClients map | N/A |
| `model.ts` | TypeScript interfaces: `CSAPIResource`, `CSAPICollection`, `CSAPISystem`, `CSAPIParameter` | 23-001 §7.2, 23-002 §8 |
| `helpers.ts` | Fetch utilities, fixture loading, assertion helpers (`maybeFetchOrLoad`, `csapiFetch`) | N/A |
| `url_builder.ts` | Canonical URL construction for all endpoints | 23-002 §7.4 |
| `advanced_filtering_helpers.ts` | Query parameter building for temporal, bbox, keyword filters | 23-002 §7.3 |
| `fixture_loader.ts` | Environment-aware fixture loading for tests | N/A |
| `systems.ts` | Systems client with `list()`, `get()`, `listEvents()`, `getLinkedResources()` | 23-002 §8 |
| `deployments.ts` | Deployments client | 23-002 §9 |
| `procedures.ts` | Procedures client | 23-002 §10 |
| `samplingFeatures.ts` | Sampling Features client | 23-002 §11 |
| `properties.ts` | Properties client | 23-002 §12 |
| `datastreams.ts` | Datastreams client | 23-002 §13 |
| `observations.ts` | Observations client | 23-002 §14 |
| `controlStreams.ts` | Control Streams client | 23-002 §15 |
| `commands.ts` | Commands client | 23-002 §16 |
| `feasibility.ts` | Feasibility client | 23-002 §17 |
| `systemEvents.ts` | System Events client | 23-002 §7.4 Req43 |
| `systemHistory.ts` | System History client | 23-002 §7.4 |

**Rationale:** These are the core implementation files. Each resource client provides typed access to a CSAPI collection endpoint following the OGC API – Connected Systems standard (Parts 1 & 2).

### A.2 OgcApiEndpoint Integration (4 files)

**Location:** `src/ogc-api/`

| File | Changes Made | Purpose |
|------|--------------|---------|
| `endpoint.ts` | Added `hasConnectedSystemsApi`, `csapiCapabilities` properties | Extends OgcApiEndpoint with CSAPI detection |
| `info.ts` | Added `checkHasConnectedSystemsApi`, `parseCSAPICapabilities` functions | Conformance checking for CSAPI support |
| `model.ts` | Added `CSAPICapabilities`, `CSAPIResourceTypes` interfaces | Type definitions for capabilities |
| `endpoint.spec.ts` | Added CSAPI integration tests | Tests for `hasConnectedSystemsApi`, capabilities detection |

**Rationale:** These integrate CSAPI detection into the existing `OgcApiEndpoint` class, following the same pattern as EDR (Environmental Data Retrieval).

### A.3 Main Library Export (2 files)

**Location:** `src/`

| File | Changes Made | Purpose |
|------|--------------|---------|
| `index.ts` | Added `export * from './ogc-api/csapi/index.js'` | Exposes CSAPI clients from main package |
| `index.spec.ts` | Added tests for CSAPI exports | Verifies exports work correctly |

**Rationale:** Essential for making CSAPI available to library consumers.

### A.4 Test Files (20 files)

**Location:** `src/ogc-api/csapi/__tests__/`

| File | Coverage | Purpose |
|------|----------|---------|
| `systems.spec.ts` | 100% | Systems client tests (~30 tests) |
| `deployments.spec.ts` | 100% | Deployments client tests (~45 tests) |
| `procedures.spec.ts` | 100% | Procedures client tests (~25 tests) |
| `sampling-features.spec.ts` | 100% | Sampling features tests (~25 tests) |
| `properties.spec.ts` | 100% | Properties client tests (~20 tests) |
| `datastreams.spec.ts` | 100% | Datastreams client tests (~30 tests) |
| `observations.spec.ts` | 100% | Observations client tests (~25 tests) |
| `controlstreams.spec.ts` | 100% | Control streams tests (~30 tests) |
| `commands.spec.ts` | 100% | Commands client tests (~30 tests) |
| `feasibility.spec.ts` | 100% | Feasibility client tests (~25 tests) |
| `system-events.spec.ts` | 100% | System events tests (~25 tests) |
| `helpers.spec.ts` | ~60% | Helper function tests (~15 tests) |
| `model.spec.ts` | 100% | Model/interface tests (~30 tests) |
| `advanced-filtering.spec.ts` | 92% | Advanced filtering tests (~40 tests) |
| `common.spec.ts` | N/A | Common patterns tests (~20 tests) |
| `encodings.part1.spec.ts` | N/A | Part 1 encoding tests (~15 tests) |
| `encodings.part2.spec.ts` | N/A | Part 2 encoding tests (~35 tests) |
| `endpoints.part2.canonical.spec.ts` | N/A | Canonical URL tests (~20 tests) |
| `linkage.spec.ts` | N/A | Link resolution tests (~25 tests) |
| `clients.lifecycle.spec.ts` | N/A | Client lifecycle tests (~15 tests) |

**Total: 568+ passing tests with 85%+ coverage**

**Rationale:** Comprehensive test coverage validates the implementation and ensures upstream maintainers can verify functionality.

### A.5 Fixtures (64 files)

**Location:** `fixtures/ogc-api/csapi/`

#### Core Fixtures (4 files)

| File | Purpose |
|------|---------|
| `collections.json` | Collections listing response |
| `conformance.json` | CSAPI conformance declaration |
| `sample-data-hub.json` | Sample data hub fixture |
| `csapi.json` (in parent directory) | Root landing page fixture |

#### Example Fixtures (59 JSON files + 1 README)

**Location:** `fixtures/ogc-api/csapi/examples/`

| Category | Files | Purpose |
|----------|-------|---------|
| Systems | `system_*.json`, `systems.json` | System resource examples |
| Deployments | `deployment_*.json`, `deployments.json` | Deployment examples |
| Procedures | `procedure_*.json`, `procedures.json` | Procedure examples |
| Sampling Features | `samplingFeature_*.json`, `samplingFeatures.json` | Feature examples |
| Properties | `property_*.json`, `properties.json` | Property examples |
| Datastreams | `datastream_*.json`, `datastreams*.json` | Datastream examples |
| Observations | `observation_*.json`, `observations*.json` | Observation examples |
| Control Streams | `controlStream_*.json`, `controlStreams*.json` | Control stream examples |
| Commands | `command_*.json`, `commands*.json` | Command examples |
| Feasibility | `feasibility*.json` | Feasibility examples |
| System Events | `systemEvent_*.json`, `systemEvents*.json` | Event examples |
| System History | `systemHistory*.json` | History examples |
| Encodings | `encodings_*.json` | Part 1/2 encoding examples |
| Endpoints | `endpoint_*.json`, `endpoints_*.json` | Endpoint response examples |
| Common | `common_*.json` | Shared conformance/landing |
| README.md | Documentation for fixtures |

**Complete fixture file listing:**
- `command_cmd-001.json`
- `command_result_cmd-001.json`
- `command_status_cmd-001.json`
- `commands.json`
- `commands_collection_featureType.json`
- `commands_controlStream_ctrl-001.json`
- `common_conformance.json`
- `common_landing.json`
- `controlStream_ctrl-001.json`
- `controlStream_schema_ctrl-001.json`
- `controlStreams.json`
- `controlStreams_system_sys-001.json`
- `datastream_ds-001.json`
- `datastream_schema_ds-001.json`
- `datastreams.json`
- `datastreams_deployment_dep-001.json`
- `datastreams_schema.json`
- `datastreams_system_sys-001.json`
- `deployment_dep-001.json`
- `deployments.json`
- `encodings_part1_geojson.json`
- `encodings_part1_sensorml.json`
- `encodings_part2_observations_om.json`
- `encodings_part2_observations_swe.json`
- `encodings_part2_swecommon.json`
- `endpoint_commands.json`
- `endpoint_controlStreams.json`
- `endpoint_datastreams.json`
- `endpoint_deployments.json`
- `endpoint_feasibility.json`
- `endpoint_observations.json`
- `endpoint_procedures.json`
- `endpoint_properties.json`
- `endpoint_samplingFeatures.json`
- `endpoint_systemEvents.json`
- `endpoint_systemHistory.json`
- `endpoint_systems.json`
- `endpoints_part2_landing.json`
- `feasibility.json`
- `feasibility_feas-001.json`
- `feasibility_result_feas-001.json`
- `feasibility_status_feas-001.json`
- `observation_obs-001.json`
- `observations.json`
- `observations_datastream_ds-001.json`
- `observations_nested.json`
- `procedure_proc-001.json`
- `procedures.json`
- `properties.json`
- `property_prop-001.json`
- `samplingFeature_sf-001.json`
- `samplingFeatures.json`
- `systemEvent_evt-001.json`
- `systemEvents.json`
- `systemEvents_sys-001.json`
- `systemHistory.json`
- `systemHistory_rev-001.json`
- `systemHistory_sys-001.json`
- `system_sys-001.json`
- `systems.json`
- `README.md`

**Rationale:** Fixtures are essential for running tests and provide real-world examples of CSAPI responses. Security audit completed 2024-11-24 confirms no sensitive data.

### A.6 Examples (2 files)

**Location:** `examples/`

| File | Purpose |
|------|---------|
| `csapi-demo.js` | Comprehensive CSAPI usage example demonstrating systems, datastreams, observations |
| `csapi-query.js` | Simple query example for Connected Systems API |

**Rationale:** Demonstrates CSAPI usage for library consumers. Follows existing example patterns.

### A.7 Architecture Documentation (2 files)

**Location:** `docs/csapi/architecture/`

| File | Purpose |
|------|---------|
| `csapi-architecture.md` | CSAPI client architecture overview, module relationships |
| `csapi-integration.md` | Integration approach with core ogc-client |

**Rationale:** Provides useful context for upstream reviewers and documents the design approach.

### A.8 Demo App Changes (1 file)

**Location:** `app/src/components/ogc-api/`

| File | Changes Made | Purpose |
|------|--------------|---------|
| `OgcApiEndpoint.vue` | Added CSAPI capabilities display section | Shows CSAPI resource availability in demo |

**Rationale:** Integrates CSAPI capabilities display into the existing demo application.

### A.9 Configuration/Documentation Updates (5 files)

| File | Changes | Purpose |
|------|---------|---------|
| `test-setup.ts` | Added CSAPI_LIVE mode support | Allows tests to run against live servers |
| `README.md` | Added CSAPI documentation, imports, examples | Documents new feature for users |
| `CHANGELOG.md` | Added CSAPI changelog entry | Documents changes for release |
| `examples/README.md` | Added CSAPI example references | Points to new examples |
| `fixtures/ogc-api/csapi.json` | Root fixture | Landing page for CSAPI |

**Rationale:** Necessary for documentation and test infrastructure.

---

## B. Commit Plan

This section defines the logical, atomic commit sequence for rebuilding the CSAPI implementation in a clean fork. Each commit is designed to be independently reviewable and to tell a clear story.

### Commit Sequence Overview

| # | Commit Theme | Files | Reviewer Context |
|---|--------------|-------|------------------|
| 1 | Foundation: Types & Models | 2 | Core type definitions |
| 2 | Utilities: Helpers & URL Builder | 4 | Shared infrastructure |
| 3 | Part 1 Resource Clients | 4 | Static feature resources |
| 4 | Part 2 Resource Clients | 8 | Dynamic data resources |
| 5 | Module Index & Exports | 1 | Public API surface |
| 6 | Test Fixtures: Core | 4 | Base test data |
| 7 | Test Fixtures: Examples | 60 | Complete fixture set |
| 8 | Test Suite: Core Clients | 12 | Client-specific tests |
| 9 | Test Suite: Common & Integration | 8 | Cross-cutting tests |
| 10 | OgcApiEndpoint Integration | 3 | Endpoint detection |
| 11 | Main Export & Library Integration | 2 | Public API exposure |
| 12 | Examples | 2 | Usage examples |
| 13 | Demo App Integration | 1 | UI integration |
| 14 | Documentation & Config | 4 | README, CHANGELOG |
| 15 | Architecture Docs | 2 | Design documentation |

---

### Commit 1: Foundation – Types & Models

**Files (2):**
```
src/ogc-api/csapi/model.ts
src/ogc-api/model.ts (modify)
```

**Commit Message:**
```
feat(csapi): add CSAPI type definitions and model interfaces

Add TypeScript interfaces for OGC API - Connected Systems:
- CSAPIResource, CSAPICollection base types
- CSAPISystem, CSAPISystemCollection for Part 2 systems
- CSAPIParameter for generic parameter handling
- CSAPICapabilities, CSAPIResourceTypes in ogc-api/model.ts

References: OGC 23-001 §7.2, OGC 23-002 §8
```

**What This Accomplishes:**
- Establishes the type foundation all clients depend on
- Separates CSAPI models from generic OGC API models
- Adds capability types to the shared model layer

**Why This Order:**
- Types must be defined before any code that uses them
- Allows subsequent commits to import from established interfaces

---

### Commit 2: Utilities – Helpers & URL Builder

**Files (4):**
```
src/ogc-api/csapi/helpers.ts
src/ogc-api/csapi/url_builder.ts
src/ogc-api/csapi/advanced_filtering_helpers.ts
src/ogc-api/csapi/fixture_loader.ts
```

**Commit Message:**
```
feat(csapi): add helper utilities and URL builder

Add shared utilities for CSAPI clients:
- helpers.ts: maybeFetchOrLoad, csapiFetch, assertion helpers
- url_builder.ts: canonical URL construction for all 12 endpoints
- advanced_filtering_helpers.ts: temporal, bbox, keyword filters
- fixture_loader.ts: environment-aware fixture loading

Provides consistent URL generation and fetch abstraction layer.
```

**What This Accomplishes:**
- Establishes shared infrastructure for all resource clients
- Centralizes URL construction patterns
- Provides test/fixture support utilities

**Why This Order:**
- All resource clients depend on these utilities
- Must be in place before client implementations

---

### Commit 3: Part 1 Resource Clients

**Files (4):**
```
src/ogc-api/csapi/deployments.ts
src/ogc-api/csapi/procedures.ts
src/ogc-api/csapi/samplingFeatures.ts
src/ogc-api/csapi/properties.ts
```

**Commit Message:**
```
feat(csapi): implement Part 1 resource clients

Add CSAPI Part 1 Feature Resources clients:
- DeploymentsClient: spatial/temporal system placement (§9)
- ProceduresClient: observation methods (§10)
- SamplingFeaturesClient: sampled real-world features (§11)
- PropertiesClient: observable property definitions (§12)

Each client provides list() and get(id) methods with typed responses.
References: OGC 23-001 (Part 1)
```

**What This Accomplishes:**
- Implements the four Part 1 static feature resource clients
- Follows consistent client pattern established by types/helpers

**Why This Order:**
- Part 1 resources are foundational feature types
- Simpler than Part 2 dynamic data resources

---

### Commit 4: Part 2 Resource Clients

**Files (8):**
```
src/ogc-api/csapi/systems.ts
src/ogc-api/csapi/datastreams.ts
src/ogc-api/csapi/observations.ts
src/ogc-api/csapi/controlStreams.ts
src/ogc-api/csapi/commands.ts
src/ogc-api/csapi/feasibility.ts
src/ogc-api/csapi/systemEvents.ts
src/ogc-api/csapi/systemHistory.ts
```

**Commit Message:**
```
feat(csapi): implement Part 2 dynamic data clients

Add CSAPI Part 2 Dynamic Data clients:
- SystemsClient: systems with linked resources, events (§8)
- DatastreamsClient: observation time series (§13)
- ObservationsClient: measurement results (§14)
- ControlStreamsClient: command time series (§15)
- CommandsClient: system control commands (§16)
- FeasibilityClient: capability queries (§17)
- SystemEventsClient: lifecycle events (§7.4 Req43)
- SystemHistoryClient: historical system states (§7.4)

SystemsClient includes getLinkedResources() and listEvents() methods.
References: OGC 23-002 (Part 2)
```

**What This Accomplishes:**
- Implements all 8 Part 2 dynamic data resource clients
- Includes SystemsClient special methods for link navigation

**Why This Order:**
- Completes the resource client implementation
- Part 2 builds on Part 1 patterns

---

### Commit 5: Module Index & Exports

**Files (1):**
```
src/ogc-api/csapi/index.ts
```

**Commit Message:**
```
feat(csapi): add module index and CSAPIClients map

Add CSAPI module entry point:
- Re-exports all resource clients, helpers, and models
- Provides CSAPIClients aggregate map for generic instantiation
- Enables barrel import for all CSAPI functionality

Example: import { SystemsClient, CSAPIClients } from 'ogc-api/csapi'
```

**What This Accomplishes:**
- Creates the public API surface for the CSAPI module
- Enables both direct imports and aggregate access

**Why This Order:**
- All client implementations must exist before aggregating

---

### Commit 6: Test Fixtures – Core

**Files (4):**
```
fixtures/ogc-api/csapi.json
fixtures/ogc-api/csapi/collections.json
fixtures/ogc-api/csapi/conformance.json
fixtures/ogc-api/csapi/sample-data-hub.json
```

**Commit Message:**
```
test(csapi): add core CSAPI fixtures

Add foundational test fixtures for CSAPI:
- csapi.json: root landing page with links
- collections.json: available collections listing
- conformance.json: CSAPI conformance declaration
- sample-data-hub.json: sample data hub response

These fixtures support CSAPI detection and capability testing.
```

**What This Accomplishes:**
- Provides base fixtures for endpoint detection tests
- Establishes fixture directory structure

**Why This Order:**
- Core fixtures are needed before example fixtures

---

### Commit 7: Test Fixtures – Examples

**Files (60):**
```
fixtures/ogc-api/csapi/examples/README.md
fixtures/ogc-api/csapi/examples/*.json (59 files)
```

**Commit Message:**
```
test(csapi): add comprehensive example fixtures

Add 60 fixture files covering all CSAPI resource types:
- Systems, Deployments, Procedures, Sampling Features
- Properties, Datastreams, Observations
- Control Streams, Commands, Feasibility
- System Events, System History
- Part 1/2 encoding examples (GeoJSON, SensorML, O&M, SWE)
- Canonical endpoint responses

All fixtures are OGC-conformant JSON responses for test coverage.
Security audit completed: no sensitive data present.
```

**What This Accomplishes:**
- Complete fixture coverage for all 12 resource types
- Encoding variant examples for content negotiation tests

**Why This Order:**
- Fixtures must exist before test suites run

---

### Commit 8: Test Suite – Core Clients

**Files (12):**
```
src/ogc-api/csapi/__tests__/systems.spec.ts
src/ogc-api/csapi/__tests__/deployments.spec.ts
src/ogc-api/csapi/__tests__/procedures.spec.ts
src/ogc-api/csapi/__tests__/sampling-features.spec.ts
src/ogc-api/csapi/__tests__/properties.spec.ts
src/ogc-api/csapi/__tests__/datastreams.spec.ts
src/ogc-api/csapi/__tests__/observations.spec.ts
src/ogc-api/csapi/__tests__/controlstreams.spec.ts
src/ogc-api/csapi/__tests__/commands.spec.ts
src/ogc-api/csapi/__tests__/feasibility.spec.ts
src/ogc-api/csapi/__tests__/system-events.spec.ts
src/ogc-api/csapi/__tests__/helpers.spec.ts
```

**Commit Message:**
```
test(csapi): add core client test suites

Add comprehensive tests for CSAPI resource clients:
- 11 resource-specific test suites (100% coverage on 10)
- Helper function tests (~60% coverage)
- ~400 individual test cases
- Validates list(), get(), and resource-specific methods
- Uses expectFeatureCollection assertions

Run: npm test -- --testPathPattern=csapi
```

**What This Accomplishes:**
- Validates all resource client implementations
- Provides regression protection for core functionality

**Why This Order:**
- Tests require both clients and fixtures

---

### Commit 9: Test Suite – Common & Integration

**Files (8):**
```
src/ogc-api/csapi/__tests__/model.spec.ts
src/ogc-api/csapi/__tests__/advanced-filtering.spec.ts
src/ogc-api/csapi/__tests__/common.spec.ts
src/ogc-api/csapi/__tests__/encodings.part1.spec.ts
src/ogc-api/csapi/__tests__/encodings.part2.spec.ts
src/ogc-api/csapi/__tests__/endpoints.part2.canonical.spec.ts
src/ogc-api/csapi/__tests__/linkage.spec.ts
src/ogc-api/csapi/__tests__/clients.lifecycle.spec.ts
```

**Commit Message:**
```
test(csapi): add common and integration test suites

Add cross-cutting test coverage:
- model.spec.ts: type and interface validation
- advanced-filtering.spec.ts: query parameter building (92%)
- common.spec.ts: landing/conformance/link validation
- encodings.part1/2.spec.ts: content negotiation tests
- endpoints.part2.canonical.spec.ts: URL canonicalization
- linkage.spec.ts: cross-collection link resolution
- clients.lifecycle.spec.ts: client instantiation lifecycle

Total: 568+ tests, 85%+ coverage across CSAPI module.
```

**What This Accomplishes:**
- Validates cross-cutting concerns and integration patterns
- Completes test coverage for entire CSAPI module

**Why This Order:**
- Integration tests build on client tests

---

### Commit 10: OgcApiEndpoint Integration

**Files (3):**
```
src/ogc-api/endpoint.ts (modify)
src/ogc-api/info.ts (modify)
src/ogc-api/endpoint.spec.ts (modify)
```

**Note:** `src/ogc-api/model.ts` was already modified in Commit 1 to add `CSAPICapabilities` types.

**Commit Message:**
```
feat(csapi): integrate CSAPI detection into OgcApiEndpoint

Extend OgcApiEndpoint with Connected Systems API support:
- Add hasConnectedSystemsApi boolean property
- Add csapiCapabilities with granular resource detection
- Add checkHasConnectedSystemsApi conformance check
- Add parseCSAPICapabilities for link/collection parsing

Follows established pattern from EDR (checkHasEnvironmentalDataRetrieval).
```

**What This Accomplishes:**
- Integrates CSAPI detection into the main endpoint abstraction
- Enables consumers to discover CSAPI capabilities

**Why This Order:**
- CSAPI module must be complete before endpoint integration
- Tests validate integration works correctly

---

### Commit 11: Main Library Export

**Files (2):**
```
src/index.ts (modify)
src/index.spec.ts (modify)
```

**Commit Message:**
```
feat(csapi): export CSAPI clients from main library

Add CSAPI to the public API:
- Export all CSAPI clients via re-export from csapi/index
- Add tests verifying CSAPI symbols are accessible

Example: import { SystemsClient, DatastreamsClient } from '@camptocamp/ogc-client'
```

**What This Accomplishes:**
- Makes CSAPI available to library consumers
- Verifies exports work correctly

**Why This Order:**
- All implementation must be complete before public export

---

### Commit 12: Examples

**Files (2):**
```
examples/csapi-demo.js
examples/csapi-query.js
```

**Commit Message:**
```
docs(csapi): add usage examples

Add two comprehensive CSAPI examples:
- csapi-demo.js: Full walkthrough of systems, datastreams, observations
- csapi-query.js: Simple query patterns with multiple resource types

Both examples include error handling and documentation links.
Run: node examples/csapi-demo.js
```

**What This Accomplishes:**
- Demonstrates real-world usage patterns
- Provides copy-paste starting points for consumers

**Why This Order:**
- Examples require complete, exported implementation

---

### Commit 13: Demo App Integration

**Files (1):**
```
app/src/components/ogc-api/OgcApiEndpoint.vue (modify)
```

**Commit Message:**
```
feat(csapi): add CSAPI capabilities to demo app

Extend OgcApiEndpoint.vue with CSAPI display:
- Add CSAPI Capabilities section when hasConnectedSystemsApi
- Display 12 resource availability flags
- Style consistent with existing capabilities display

Enables visual verification of CSAPI endpoint detection.
```

**What This Accomplishes:**
- Integrates CSAPI into the library's demo application
- Allows visual testing of endpoint detection

**Why This Order:**
- Demo integration depends on endpoint integration

---

### Commit 14: Documentation & Configuration

**Files (4):**
```
README.md (modify)
CHANGELOG.md (modify)
examples/README.md (modify)
test-setup.ts (modify)
```

**Commit Message:**
```
docs(csapi): update documentation for CSAPI release

Update project documentation:
- README.md: Add CSAPI to standards list, imports, examples
- CHANGELOG.md: Document CSAPI feature addition
- examples/README.md: Add CSAPI example references
- test-setup.ts: Add CSAPI_LIVE mode for integration testing

Prepares documentation for v1.x.0 release with CSAPI support.
```

**What This Accomplishes:**
- Documents the new feature for users
- Enables live integration testing mode

**Why This Order:**
- Documentation should reflect final implementation

---

### Commit 15: Architecture Documentation

**Files (2):**
```
docs/csapi/architecture/csapi-architecture.md
docs/csapi/architecture/csapi-integration.md
```

**Commit Message:**
```
docs(csapi): add architecture documentation

Add CSAPI architecture documentation for maintainers:
- csapi-architecture.md: Module structure, relationships, test coverage
- csapi-integration.md: Integration patterns with core ogc-client

Provides context for future maintenance and extension.
```

**What This Accomplishes:**
- Documents the design for maintainers
- Provides reference for future work

**Why This Order:**
- Architecture docs are optional but valuable context

---

## C. Architectural Overview

### C.1 Final Repository Structure

```
src/
├── index.ts                     # Main exports (adds CSAPI re-export)
├── index.spec.ts                # Export tests (adds CSAPI verification)
├── ogc-api/
│   ├── endpoint.ts              # OgcApiEndpoint (adds CSAPI detection)
│   ├── info.ts                  # Conformance checking (adds CSAPI)
│   ├── model.ts                 # Types (adds CSAPICapabilities)
│   ├── endpoint.spec.ts         # Endpoint tests (adds CSAPI)
│   └── csapi/                   # NEW: CSAPI module
│       ├── index.ts             # Module exports
│       ├── model.ts             # CSAPI-specific types
│       ├── helpers.ts           # Shared utilities
│       ├── url_builder.ts       # URL construction
│       ├── advanced_filtering_helpers.ts
│       ├── fixture_loader.ts
│       ├── systems.ts           # Part 2: Systems
│       ├── deployments.ts       # Part 1: Deployments
│       ├── procedures.ts        # Part 1: Procedures
│       ├── samplingFeatures.ts  # Part 1: Sampling Features
│       ├── properties.ts        # Part 1: Properties
│       ├── datastreams.ts       # Part 2: Datastreams
│       ├── observations.ts      # Part 2: Observations
│       ├── controlStreams.ts    # Part 2: Control Streams
│       ├── commands.ts          # Part 2: Commands
│       ├── feasibility.ts       # Part 2: Feasibility
│       ├── systemEvents.ts      # Part 2: System Events
│       ├── systemHistory.ts     # Part 2: System History
│       └── __tests__/           # 20 test files
│
fixtures/
└── ogc-api/
    ├── csapi.json               # Root fixture
    └── csapi/                   # NEW: CSAPI fixtures
        ├── collections.json
        ├── conformance.json
        ├── sample-data-hub.json
        └── examples/            # 60 fixture files

examples/
├── csapi-demo.js                # NEW
└── csapi-query.js               # NEW

app/src/components/ogc-api/
└── OgcApiEndpoint.vue           # Modified

docs/csapi/architecture/         # NEW
├── csapi-architecture.md
└── csapi-integration.md
```

### C.2 Architectural Themes

#### Theme 1: Modular Client Architecture

Each CSAPI resource type has its own client class with consistent interface:
- Constructor accepts `apiRoot` URL
- `list()` method returns typed collection
- `get(id)` method returns single resource
- Resource-specific methods where appropriate (e.g., `SystemsClient.listEvents()`)

#### Theme 2: Shared Infrastructure

Common functionality is centralized:
- `url_builder.ts` – All URL construction
- `helpers.ts` – Fetch abstraction, assertions
- `model.ts` – Type definitions

#### Theme 3: Fixture-Driven Testing

Tests support both modes:
- Fixture mode (default) – Fast, deterministic
- Live mode (`CSAPI_LIVE=true`) – Integration testing

#### Theme 4: Endpoint Integration Pattern

CSAPI detection follows the established EDR pattern:
- Conformance-based capability detection
- Lazy evaluation via getters
- Granular capability flags

### C.3 Dependency Relationships

```
CSAPIClients (index.ts)
    │
    ├── SystemsClient ─────────┐
    ├── DeploymentsClient ─────┤
    ├── ProceduresClient ──────┼── depends on ──► helpers.ts
    ├── SamplingFeaturesClient ┤                  url_builder.ts
    ├── PropertiesClient ──────┤                  model.ts
    ├── DatastreamsClient ─────┤
    ├── ObservationsClient ────┤
    ├── ControlStreamsClient ──┤
    ├── CommandsClient ────────┤
    ├── FeasibilityClient ─────┤
    ├── SystemEventsClient ────┤
    └── SystemHistoryClient ───┘

OgcApiEndpoint (endpoint.ts)
    │
    └── uses ──► checkHasConnectedSystemsApi (info.ts)
                 parseCSAPICapabilities (info.ts)
```

---

## D. Documentation Guidance

This section provides commit-by-commit guidance for updating documentation.

### D.1 Commit 1 (Types & Models)
- No external documentation changes needed
- Internal JSDoc comments should be comprehensive

### D.2 Commits 2-5 (Utilities & Clients)
- Ensure JSDoc comments document all public methods
- Include OGC specification references in comments

### D.3 Commits 6-7 (Fixtures)
- Include `examples/README.md` explaining fixture structure
- Document any special encoding variants

### D.4 Commits 8-9 (Tests)
- No external documentation changes
- Test descriptions should be self-documenting

### D.5 Commit 10 (Endpoint Integration)
- Update inline documentation in endpoint.ts
- Document new properties in JSDoc

### D.6 Commit 11 (Main Export)
- No documentation changes (covered in Commit 14)

### D.7 Commit 12 (Examples)
- Examples serve as documentation
- Include extensive inline comments and output formatting

### D.8 Commit 13 (Demo App)
- Component is self-documenting via UI

### D.9 Commit 14 (Documentation)
**README.md Updates:**
- Add CSAPI to "Partially Implemented Standards" list
- Add CSAPI imports to code examples
- Add CSAPI example references to Quick Examples
- Add CSAPI example run commands

**CHANGELOG.md Updates:**
- Add `## [Unreleased]` section if not present
- Document under `### Added`
- List all 12 resources with brief descriptions
- Include usage example
- Reference spec documents

**examples/README.md Updates:**
- Add CSAPI examples section
- Document environment variables
- Link to OGC specifications

### D.10 Commit 15 (Architecture Docs)
- Target audience: maintainers and contributors
- Describe module relationships
- Document test patterns

---

## E. Review/PR Notes

This section calls out design decisions and subtle choices for reviewers.

### E.1 Design Decisions

#### Decision 1: Separate CSAPI Model Module
**Choice:** CSAPI types are in `src/ogc-api/csapi/model.ts`, not merged into `src/ogc-api/model.ts`.

**Rationale:** Keeps CSAPI types independent of generic OGC API types. Only `CSAPICapabilities` is added to the shared model for endpoint integration.

**Reviewer Note:** This mirrors the EDR approach where EDR-specific types are in `edr/model.ts`.

#### Decision 2: Client Pattern vs Endpoint Extension
**Choice:** CSAPI uses standalone client classes rather than extending `OgcApiEndpoint`.

**Rationale:** 
- Allows direct instantiation with an API root URL
- Matches real-world usage patterns
- Keeps endpoint class focused on discovery

**Reviewer Note:** `OgcApiEndpoint.csapiCapabilities` provides discovery; clients provide data access.

#### Decision 3: Fixture-Based Testing with Live Mode Option
**Choice:** Tests use fixtures by default, with `CSAPI_LIVE=true` for integration.

**Rationale:**
- Fast, deterministic tests for CI
- Live mode enables real endpoint testing
- `test-setup.ts` handles mode switching

**Reviewer Note:** No test modifications needed for either mode.

#### Decision 4: URL Builder Centralization
**Choice:** All CSAPI URLs constructed via `url_builder.ts`.

**Rationale:**
- Single source of truth for path patterns
- Enables canonical URL assertions in tests
- Prevents string concatenation errors

**Reviewer Note:** Check `CANONICAL_ENDPOINTS` array for completeness.

### E.2 Conformance Considerations

#### OGC 23-001 (Part 1) Coverage
- Deployments, Procedures, Sampling Features, Properties
- GeoJSON Feature/FeatureCollection semantics
- Link relations per specification

#### OGC 23-002 (Part 2) Coverage
- Systems, Datastreams, Observations
- Control Streams, Commands, Feasibility
- System Events, System History
- Nested resource paths (e.g., `/systems/{id}/events`)

### E.3 Test Coverage Summary

| Module | Statement | Branch | Function | Line |
|--------|-----------|--------|----------|------|
| Overall | 85% | 75% | 88% | 85% |
| Core Clients | 100% | 90% | 100% | 100% |
| Helpers | 60% | 50% | 70% | 60% |

**568+ passing tests** across 20 test files.

### E.4 PR Review Checklist

For reviewers of the final PR:

- [ ] All 12 resource endpoints implemented
- [ ] Type definitions align with OGC schemas
- [ ] URL patterns match specification
- [ ] Tests pass in both fixture and live modes
- [ ] JSDoc comments reference specifications
- [ ] Examples demonstrate key functionality
- [ ] CHANGELOG entry is complete
- [ ] README updates are accurate
- [ ] No TODO/FIXME comments remain
- [ ] No debug logging remains
- [ ] Security audit findings addressed

### E.5 Potential Review Questions

**Q: Why not use the Endpoint base class pattern?**
A: CSAPI clients are designed for direct instantiation with a known API root. The Endpoint pattern is used for discovery scenarios.

**Q: Why separate fixtures for examples?**
A: Mirrors the OGC specification structure and allows incremental fixture development.

**Q: Why include architecture docs?**
A: Provides context for maintainers; can be excluded from PR if upstream prefers less documentation.

**Q: How does CSAPI_LIVE mode work?**
A: Set `CSAPI_LIVE=true` and `CSAPI_API_ROOT=<url>` to run tests against a real endpoint.

---

## Summary

This blueprint provides a complete roadmap for migrating the CSAPI implementation:

- **118 files** organized into **15 logical commits**
- Clear commit messages and reviewer context
- Architectural documentation for maintainers
- Documentation guidance for each phase
- Review notes highlighting key design decisions

The commit sequence is designed to:
1. Build dependencies before dependents
2. Keep each commit focused and reviewable
3. Tell a clear story of feature development
4. Enable incremental review and testing

---

*Document generated: 2024-11-25*  
*Based on: CSAPI Migration Inventory v1.0*
