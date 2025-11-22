# CSAPI Fixture Index

_(Phase 2 · Step 3 – Test Harness Wiring)_

This document describes each JSON fixture used by the CSAPI Jest test harness.  
Each entry provides a short description, lists the test file(s) that use it, and identifies the related requirements from the OGC API – Connected Systems Parts 1 and 2 standards (and inherited OGC API – Features clauses where applicable).

---

| **Fixture File**                          | **Description / Purpose**                                                                                 | **Referenced Tests**                                  | **Related Requirements**                                                                                                                                                    |
| :---------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **common_landing.json**                   | Landing page representation of the API root, advertising CSAPI canonical endpoints and conformance links. | `common.spec.ts`, `endpoints.part2.canonical.spec.ts` | `/req/landing-page/content`, `/req/canonical-endpoints/listing`                                                                                                             |
| **common_conformance.json**               | Conformance declaration listing OGC API – Features and CSAPI Parts 1 & 2 conformance classes.             | `common.spec.ts`                                      | `/req/conformance/content`                                                                                                                                                  |
| **endpoints_part2_landing.json**          | Landing page fixture enumerating all canonical Part 2 endpoints.                                          | `endpoints.part2.canonical.spec.ts`                   | `/req/canonical-endpoints/listing`, `/req/canonical-endpoints/collections`                                                                                                  |
| **systems.json**                          | Minimal FeatureCollection of Systems resources.                                                           | `systems.spec.ts`                                     | `/req/system/canonical-endpoint`, `/req/system/resources-endpoint`, `/req/system/canonical-url`, `/req/system/collections`                                                  |
| **deployments.json**                      | Minimal FeatureCollection of Deployments describing sosa:Deployment features.                             | `deployments.spec.ts`                                 | `/req/deployment/*`                                                                                                                                                         |
| **procedures.json**                       | Minimal FeatureCollection of Procedures representing processes or algorithms.                             | `procedures.spec.ts`                                  | `/req/procedure/*`                                                                                                                                                          |
| **samplingFeatures.json**                 | Minimal FeatureCollection of Sampling Features representing stations, sites, or features-of-interest.     | `sampling-features.spec.ts`                           | `/req/sf/*`                                                                                                                                                                 |
| **properties.json**                       | Collection of non-feature Property Definitions describing observable properties.                          | `properties.spec.ts`                                  | `/req/property/*`                                                                                                                                                           |
| **datastreams.json**                      | FeatureCollection of Datastreams representing sensor or data channels.                                    | `datastreams.spec.ts`                                 | `/req/datastream/canonical-endpoint`, `/req/datastream/resources-endpoint`, `/req/datastream/canonical-url`, `/req/datastream/ref-from-system`, `/req/datastream/schema-op` |
| **datastreams_schema.json**               | Simplified schema object returned by `/datastreams/{id}/schema` operation.                                | `datastreams.spec.ts`                                 | `/req/datastream/schema-op`                                                                                                                                                 |
| **observations.json**                     | Top-level Observations collection (unfiltered).                                                           | `observations.spec.ts`                                | `/req/observation/canonical-endpoint`, `/req/observation/resources-endpoint`, `/req/observation/canonical-url`                                                              |
| **observations_nested.json**              | Nested Observations collection for `/datastreams/{id}/observations`.                                      | `observations.spec.ts`                                | `/req/observation/ref-from-datastream`                                                                                                                                      |
| **controlstreams.json**                   | Collection of ControlStream features for command/control data channels.                                   | `controlstreams.spec.ts`                              | `/req/controlstream/*`                                                                                                                                                      |
| **commands.json**                         | Collection of Command features with links to status and result resources.                                 | `commands.spec.ts`                                    | `/req/command/canonical-endpoint`, `/req/command/resources-endpoint`, `/req/command/status-result`                                                                          |
| **feasibility.json**                      | Collection of Feasibility features with planning status and result links.                                 | `feasibility.spec.ts`                                 | `/req/feasibility/canonical-endpoint`, `/req/feasibility/resources-endpoint`, `/req/feasibility/status-result`                                                              |
| **systemEvents.json**                     | Collection of top-level System Events.                                                                    | `events.spec.ts`                                      | `/req/system-event/canonical-endpoint`, `/req/system-event/resources-endpoint`, `/req/system-event/canonical-url`                                                           |
| **systemEvents_nested.json**              | Nested System Events collection under `/systems/{id}/events`.                                             | `events.spec.ts`                                      | `/req/system-event/ref-from-system`, `/req/system-event/collections`                                                                                                        |
| **encodings_part1_geojson.json**          | Example GeoJSON encoding of a System feature.                                                             | `encodings.part1.spec.ts`                             | `/req/encodings/geojson`                                                                                                                                                    |
| **encodings_part1_sensorml.json**         | Example SensorML-JSON encoding of a System feature.                                                       | `encodings.part1.spec.ts`                             | `/req/encodings/sensorml-json`                                                                                                                                              |
| **encodings_part2_swecommon.json**        | SWE Common 3.0 JSON representation of a Datastream.                                                       | `encodings.part2.spec.ts`                             | `/req/encodings/swe-common`                                                                                                                                                 |
| **encodings_part2_observations_swe.json** | SWE Common JSON encoding for Observation results.                                                         | `encodings.part2.spec.ts`                             | `/req/encodings/observations-json`                                                                                                                                          |
| **encodings_part2_observations_om.json**  | OM-JSON encoding for Observation results.                                                                 | `encodings.part2.spec.ts`                             | `/req/encodings/content-negotiation`                                                                                                                                        |

---

### 🧠 Notes

- **Traceability:** Each fixture maps directly to at least one test and one normative `/req/...` clause.
- **Fixture Mode:** When `CSAPI_LIVE` is not set, all tests use these static fixtures.
- **Live Mode:** When `CSAPI_LIVE=true` and `CSAPI_API_ROOT` are set, tests fetch live CSAPI endpoints instead.
- **Future Refinement:** During Phase 2 Step 4 (Client Implementation), these stub fixtures will be replaced or extended with validated CSAPI responses.

---

### 🧩 Related Documents

| File                                                  | Purpose                                                                   |
| :---------------------------------------------------- | :------------------------------------------------------------------------ |
| `docs/csapi/_tests_/CSAPI_Test_Design_Matrix_v1.0.md` | Maps each requirement to a specific Jest test and expected outcome.       |
| `docs/csapi/_tests_/Phase2_Step3_Log.md`              | Describes how to run the tests in fixture and live modes.                 |
| `docs/csapi/_tests_/Fixture_Index.md`                 | (This document) Provides metadata and traceability for all JSON fixtures. |

---

**End of Document**  
_Prepared as part of OGC Client CSAPI Implementation — Phase 2 · Step 3._
