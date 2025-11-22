# CSAPI Fixture Index  
*(Phase 2 · Step 3 – Test Harness Wiring; updated for profile-aware fixtures)*

This document describes each JSON fixture used by the CSAPI Jest test harness.  
Each entry provides a short description, lists the test file(s) that use it, and identifies the related requirements from the OGC API – Connected Systems Parts 1 and 2 standards (and inherited OGC API – Features Core, as applicable).

---

## Fixture Profiles

Fixtures can be loaded from different profiles via `CSAPI_FIXTURE_PROFILE`:

- default (legacy):  
  Directory: `fixtures/ogc-api/csapi/sample-data-hub/`  
  Notes: Original lightweight stubs. Used by most tests unless a profile is set.

- advanced (enriched semantics):  
  Directory: `fixtures/ogc-api/csapi/advanced/`  
  Notes: Contains richer, multi-entity examples and relationship arrays (e.g., `procedureIds`, `foiIds`, `observedProperties`, `controlledProperties`, `systemIds`) for advanced filtering semantics.

- minimal (optional):  
  Directory: `fixtures/ogc-api/csapi/minimal/`  
  Notes: Optional copy or trimmed set of legacy fixtures for pedagogical or baseline shape assertions.

Unless stated otherwise, the index below refers to the default fixtures.  
Advanced profile files mirror collection names (plural) and are selected explicitly by tests that need them.

---

## Index (Default Fixtures)

| **Fixture File** | **Description / Purpose** | **Referenced Tests** | **Related Requirements** |
|:--|:--|:--|:--|
| **common_landing.json** | Landing page representation of the API root, advertising CSAPI canonical endpoints and conformance links. | `common.spec.ts`, `endpoints.part2.canonical.spec.ts` | `/req/landing-page`, `/req/conformance/link` |
| **common_conformance.json** | Conformance declaration listing OGC API – Features and CSAPI Parts 1 & 2 conformance classes. | `common.spec.ts` | `/req/conformance/content` |
| **endpoints_part2_landing.json** | Landing page fixture enumerating all canonical Part 2 endpoints. | `endpoints.part2.canonical.spec.ts` | `/req/canonical-endpoints/listing`, `/req/canonical-endpoints/links` |
| **systems.json** | Minimal FeatureCollection of Systems resources. | `systems.spec.ts` | `/req/system/*` |
| **deployments.json** | Minimal FeatureCollection of Deployments. | `deployments.spec.ts` | `/req/deployment/*` |
| **procedures.json** | Minimal FeatureCollection of Procedures. | `procedures.spec.ts` | `/req/procedure/*` |
| **samplingFeatures.json** | Minimal FeatureCollection of Sampling Features. | `sampling-features.spec.ts` | `/req/sf/*` |
| **properties.json** | Collection of non-feature Property Definitions. | `properties.spec.ts` | `/req/property/*` |
| **datastreams.json** | FeatureCollection of Datastreams. | `datastreams.spec.ts` | `/req/datastream/*` |
| **datastreams_schema.json** | Simplified schema object returned by `/datastreams/{id}/schema`. | `datastreams.spec.ts` | `/req/datastream/schema-op` |
| **observations.json** | Top-level Observations collection (unfiltered). | `observations.spec.ts` | `/req/observation/*` |
| **observations_nested.json** | Nested Observations collection for `/datastreams/{id}/observations`. | `observations.spec.ts` | `/req/observation/ref-from-datastream` |
| **controlstreams.json** | Collection of ControlStream features. | `controlstreams.spec.ts` | `/req/controlstream/*` |
| **commands.json** | Collection of Command features with links to status and result resources. | `commands.spec.ts` | `/req/command/*` |
| **feasibility.json** | Collection of Feasibility features with planning semantics. | `feasibility.spec.ts` | `/req/feasibility/*` |
| **systemEvents.json** | Collection of top-level System Events. | `system-events.spec.ts` | `/req/system-event/*` |
| **systemEvents_nested.json** | Nested System Events under `/systems/{id}/events`. | `system-events.spec.ts` | `/req/system-event/ref-from-system` |
| **encodings_part1_geojson.json** | Example GeoJSON encoding of a System feature. | `encodings.part1.spec.ts` | `/req/encodings/geojson` |
| **encodings_part1_sensorml.json** | Example SensorML-JSON encoding of a System feature. | `encodings.part1.spec.ts` | `/req/encodings/sensorml-json` |
| **encodings_part2_swecommon.json** | SWE Common 3.0 JSON for a Datastream. | `encodings.part2.spec.ts` | `/req/encodings/swe-common` |
| **encodings_part2_observations_swe.json** | SWE Common JSON for Observation results. | `encodings.part2.spec.ts` | `/req/encodings/observations-json` |
| **encodings_part2_observations_om.json** | OM-JSON encoding for Observation results. | `encodings.part2.spec.ts` | `/req/encodings/content-negotiation` |

---

## Profile Variants (Advanced)

The advanced profile contains enriched examples to support multi-filter and AND semantics validated by `advanced-filtering.spec.ts`:

- `fixtures/ogc-api/csapi/advanced/systems.json`  
  Two systems (`sys-1`, `sys-3`) with `parentId`, `procedureIds`, `foiIds`, `observedProperties`, `controlledProperties`.

- `fixtures/ogc-api/csapi/advanced/deployments.json`  
  Deployments referencing `systemIds`, `foiIds`, and property arrays.

- `fixtures/ogc-api/csapi/advanced/procedures.json`  
  Procedure (`proc-2`) with `observedProperties` and `controlledProperties`.

- `fixtures/ogc-api/csapi/advanced/samplingFeatures.json`  
  Sampling feature (`sf-9`) with `foiIds` and property arrays.

- `fixtures/ogc-api/csapi/advanced/properties.json` (or `propertyDefs.json`)  
  Property definition metadata including `baseProperty`, `objectTypes`.

These names are plural and match their collection endpoints.

---

## Selecting Profiles in Tests

Globally via CLI:
```bash
CSAPI_FIXTURE_PROFILE=advanced npm test
```

Per-spec (ensuring the profile is set before importing helpers):
```ts
process.env.CSAPI_FIXTURE_PROFILE = 'advanced';
const { filterSystems, /* ... */ } = require('../../src/ogc-api/csapi/advanced_filtering_helpers');
```

---

### 🧠 Notes

- **Traceability:** Each fixture maps directly to at least one test and one normative `/req/...` clause.  
- **Fixture Mode:** When `CSAPI_LIVE` is not set, all tests use these static fixtures.  
- **Live Mode:** When `CSAPI_LIVE=true` and `CSAPI_API_ROOT` are set, tests fetch live CSAPI endpoints instead.  
- **Profiles:** Advanced profile is used in advanced filtering tests to validate richer semantics at the data level.

---

### 🧩 Related Documents
| File | Purpose |
|:--|:--|
| `docs/csapi/_tests_/CSAPI_Test_Design_Matrix_v1.0.md` | Maps each requirement to a specific Jest test and expected outcome. |
| `docs/csapi/_tests_/Phase2_Step3_Log.md` | Describes how to run the tests in fixture and live modes. |
| `docs/csapi/_tests_/Fixture_Index.md` | (This document) Provides metadata and traceability for all JSON fixtures. |

---

**End of Document**  
*Prepared as part of OGC Client CSAPI Implementation — Phase 2 · Step 3. Updated to include profile-aware fixture loading.*