<!--
@license BSD-3-Clause
Copyright (c) 2024 OS4CSAPI contributors
-->

# CSAPI Fixture Index

_(Updated for unified fixtures suite)_

This document describes each JSON fixture used by the CSAPI Jest test harness.  
Each entry provides a short description, lists the test file(s) that use it, and identifies the related requirements from the OGC API – Connected Systems Parts 1 and 2 standards (and inherited OGC API – Features Core, as applicable).

---

## Unified Fixtures Suite

All fixtures are now located in the **unified examples directory**:

**Directory**: `fixtures/ogc-api/csapi/examples/`

The previous separate `sample-data-hub` and `advanced` fixture directories have been merged into this single, comprehensive suite. The unified fixtures provide:

- **Standards-compliant geometry**: Spatial resources (systems, deployments, samplingFeatures) include valid GeoJSON geometry
- **Complete metadata and links**: All features include proper `links` arrays following CSAPI relationship standards
- **Rich test coverage**: Resources with relationship arrays for advanced filtering, parent-child hierarchies, and multiple geometry types
- **Non-spatial resources**: Procedures and Properties correctly omit or set geometry to null per specification

See `fixtures/ogc-api/csapi/examples/README.md` for detailed information about the unified suite.

---

## Fixture Loading

The fixture loader now always loads from the unified examples directory:

```typescript
import { loadFixture } from './fixture_loader';

// Always loads from fixtures/ogc-api/csapi/examples/
const systems = loadFixture('default', 'systems');
```

The `CSAPI_FIXTURE_PROFILE` environment variable is **deprecated** and no longer used. All fixtures load from the examples suite regardless of this setting.

---

## Index (Unified Fixtures)

| **Fixture File**                          | **Description / Purpose**                                                                                 | **Referenced Tests**                                      | **Related Requirements**                                             |
| :---------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------------- |
| **common_landing.json**                   | Landing page representation of the API root, advertising CSAPI canonical endpoints and conformance links. | `common.spec.ts`, `endpoints.part2.canonical.spec.ts`     | `/req/landing-page`, `/req/conformance/link`                         |
| **common_conformance.json**               | Conformance declaration listing OGC API – Features and CSAPI Parts 1 & 2 conformance classes.             | `common.spec.ts`                                          | `/req/conformance/content`                                           |
| **endpoints_part2_landing.json**          | Landing page fixture enumerating all canonical Part 2 endpoints.                                          | `endpoints.part2.canonical.spec.ts`                       | `/req/canonical-endpoints/listing`, `/req/canonical-endpoints/links` |
| **systems.json**                          | FeatureCollection of Systems with geometry (Point, Polygon) and relationship arrays for filtering tests.  | `systems.spec.ts`, `advanced-filtering.spec.ts`           | `/req/system/*`                                                      |
| **deployments.json**                      | FeatureCollection of Deployments with Point geometry, parent-child hierarchy, system associations.        | `deployments.spec.ts`, `advanced-filtering.spec.ts`       | `/req/deployment/*`                                                  |
| **procedures.json**                       | FeatureCollection of Procedures (non-spatial, geometry=null) with property associations.                  | `procedures.spec.ts`, `advanced-filtering.spec.ts`        | `/req/procedure/*`                                                   |
| **samplingFeatures.json**                 | FeatureCollection of Sampling Features with Point/LineString geometry, system and FOI associations.       | `sampling-features.spec.ts`, `advanced-filtering.spec.ts` | `/req/sf/*`                                                          |
| **properties.json**                       | Collection of non-feature Property Definitions with observable/controllable types.                        | `properties.spec.ts`, `advanced-filtering.spec.ts`        | `/req/property/*`                                                    |
| **datastreams.json**                      | FeatureCollection of Datastreams with system/deployment associations.                                     | `datastreams.spec.ts`                                     | `/req/datastream/*`                                                  |
| **datastreams_schema.json**               | Simplified schema object returned by `/datastreams/{id}/schema`.                                          | `datastreams.spec.ts`                                     | `/req/datastream/schema-op`                                          |
| **observations.json**                     | Top-level Observations collection (unfiltered).                                                           | `observations.spec.ts`                                    | `/req/observation/*`                                                 |
| **observations_nested.json**              | Nested Observations collection for `/datastreams/{id}/observations`.                                      | `observations.spec.ts`                                    | `/req/observation/ref-from-datastream`                               |
| **controlStreams.json**                   | Collection of ControlStream features.                                                                     | `controlstreams.spec.ts`                                  | `/req/controlstream/*`                                               |
| **commands.json**                         | Collection of Command features with links to status and result resources.                                 | `commands.spec.ts`                                        | `/req/command/*`                                                     |
| **feasibility.json**                      | Collection of Feasibility features with planning semantics.                                               | `feasibility.spec.ts`                                     | `/req/feasibility/*`                                                 |
| **systemEvents.json**                     | Collection of top-level System Events.                                                                    | `system-events.spec.ts`                                   | `/req/system-event/*`                                                |
| **systemHistory.json**                    | Collection of System History revisions with versioning metadata.                                          | `system-events.spec.ts`                                   | `/req/system-event/history`                                          |
| **encodings_part1_geojson.json**          | Example GeoJSON encoding of a System feature.                                                             | `encodings.part1.spec.ts`                                 | `/req/encodings/geojson`                                             |
| **encodings_part1_sensorml.json**         | Example SensorML-JSON encoding of a System feature.                                                       | `encodings.part1.spec.ts`                                 | `/req/encodings/sensorml-json`                                       |
| **encodings_part2_swecommon.json**        | SWE Common 3.0 JSON for a Datastream.                                                                     | `encodings.part2.spec.ts`                                 | `/req/encodings/swe-common`                                          |
| **encodings_part2_observations_swe.json** | SWE Common JSON for Observation results.                                                                  | `encodings.part2.spec.ts`                                 | `/req/encodings/observations-json`                                   |
| **encodings_part2_observations_om.json**  | OM-JSON encoding for Observation results.                                                                 | `encodings.part2.spec.ts`                                 | `/req/encodings/content-negotiation`                                 |

---

## Advanced Filtering Resources

The unified fixtures include resources specifically designed for advanced filtering tests (`advanced-filtering.spec.ts`):

- **sys-1, sys-3**: Systems with `parentId`, `procedureIds`, `foiIds`, `observedProperties`, `controlledProperties`
- **dep-1, dep-2**: Deployments with `parentId`, `systemIds`, `foiIds`, and property arrays
- **proc-2**: Procedure with `observedProperties` and `controlledProperties`
- **sf-9**: Sampling feature with `foiIds` and property arrays
- **prop-def-1**: Property definition with `baseProperty` and `objectTypes`

These resources enable comprehensive testing of:

- ID-based filtering with wildcard support
- Case-insensitive keyword search
- Parent/child relationship filtering
- Procedure/FOI association filtering
- Observed/controlled property filtering
- Combined AND/OR filter logic

---

## Geometry Coverage

The unified fixtures provide diverse geometry examples:

- **Point**: Individual sensors, stations, specific locations (sys-001, sys-1, sys-3, dep-001, sf-001)
- **Polygon**: Area-based systems, coverage zones (sys-003)
- **LineString**: Transect-based sampling, linear features (sf-002)
- **null**: Non-spatial resources per specification (procedures, observations, commands)

---

## Individual Resource Files

Files following the pattern `{resource}_{id}.json` (e.g., `system_sys-001.json`, `deployment_dep-001.json`) provide detailed single-item examples for testing individual resource retrieval.

---

## Endpoint Discovery Files

Files prefixed with `endpoint_` (e.g., `endpoint_systems.json`, `endpoint_datastreams.json`) provide collection listings for canonical CSAPI endpoints used in endpoint discovery tests.

---

## Running Tests

### Fixture Mode (default — offline)

Uses static JSON fixtures from the unified examples directory (no network calls).

```bash
npm test -- src/ogc-api/csapi/__tests__/
```

### Live Mode (integration testing)

Fetches responses from a live CSAPI-compliant server.

```bash
CSAPI_LIVE=true CSAPI_API_ROOT=https://example.csapi.server npm test
```

**Environment Variables**

| Name                        | Description                                                                   |
| :-------------------------- | :---------------------------------------------------------------------------- |
| `CSAPI_LIVE`                | Set to `true` to enable live network requests instead of fixture loading      |
| `CSAPI_API_ROOT`            | Base URL of the live CSAPI server (required when `CSAPI_LIVE=true`)           |
| `CSAPI_CLIENT_MODE`         | Set to `true` to use actual CSAPI client modules instead of direct fetch/load |
| ~~`CSAPI_FIXTURE_PROFILE`~~ | **Deprecated** - No longer used. All fixtures load from unified examples/     |

---

### 🧠 Notes

- **Traceability:** Each fixture maps directly to at least one test and one normative `/req/...` clause.
- **Fixture Mode:** All tests use static fixtures from the unified examples directory.
- **Live Mode:** When `CSAPI_LIVE=true` and `CSAPI_API_ROOT` are set, tests fetch live CSAPI endpoints instead.
- **Unified Suite:** The previous `sample-data-hub` and `advanced` directories have been merged into `examples/`.

---

### 🧩 Related Documents

| File                                                  | Purpose                                                                   |
| :---------------------------------------------------- | :------------------------------------------------------------------------ |
| `fixtures/ogc-api/csapi/examples/README.md`           | Comprehensive guide to the unified fixtures suite                         |
| `docs/csapi/_tests_/CSAPI_Test_Design_Matrix_v2.4.md` | Maps each requirement to a specific Jest test and expected outcome.       |
| `docs/csapi/_tests_/CSAPI_Test_Harness_Guide.md`      | Describes how to run the tests in fixture and live modes.                 |
| `docs/csapi/_tests_/Fixture_Index.md`                 | (This document) Provides metadata and traceability for all JSON fixtures. |

---

**End of Document**  
_Updated for unified fixtures suite - OGC Client CSAPI Implementation._
