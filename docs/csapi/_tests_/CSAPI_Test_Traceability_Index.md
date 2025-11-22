# CSAPI Test Harness – Traceability Index  
*(Phase 2 · Step 2 – Grouped Jest Specs; updated for profile-aware fixtures)*

This document links each generated Jest spec file to its corresponding normative
requirements from **OGC API – Connected Systems** Parts 1 & 2 and, where applicable,
its inherited relationship to **OGC API – Features Core**.

---

## Fixture Profiles and Selection

The harness supports multiple fixture profiles via `CSAPI_FIXTURE_PROFILE`:
- `default` (legacy): `fixtures/ogc-api/csapi/sample-data-hub/`
- `advanced` (enriched semantics for filtering)
- `minimal` (optional, a copy of legacy or trimmed set)

Unless otherwise specified, specs reference the default fixtures.  
Some specs (e.g., `advanced-filtering.spec.ts`) explicitly select the `advanced` profile before importing the helpers to ensure enriched data are loaded.

---

| **Spec File** | **CSAPI Part** | **Resource or Concept** | **Referenced Requirements** | **Relevant Standard Clauses** | **Features Core Linkage** |
|:---------------|:---------------|:-------------------------|:-----------------------------|:-------------------------------|:---------------------------|
| `common.spec.ts` | Part 2 | Common / Resource semantics | `/req/api-common/resources`, `/req/api-common/resource-collection` | 23-002 §8.2–8.3 / §8.3 | Derived from OGC API – Features §7.14 |
| `systems.spec.ts` | Part 1 | Systems (Feature Resource) | `/req/system/canonical-endpoint`, `/req/system/resources-endpoint`, `/req/system/canonical-url`, `/req/system/collections` | 23-001 §9.3 | Extends Features |
| `deployments.spec.ts` | Part 1 | Deployments (Feature Resource) | `/req/deployment/canonical-endpoint`, `/req/deployment/resources-endpoint`, `/req/deployment/canonical-url` | 23-001 §11 | Extends Features |
| `procedures.spec.ts` | Part 1 | Procedures (Feature Resource) | `/req/procedure/canonical-endpoint`, `/req/procedure/resources-endpoint`, `/req/procedure/canonical-url` | 23-001 §13 | Extends Features |
| `sampling-features.spec.ts` | Part 1 | Sampling Features (Feature Resource) | `/req/sf/canonical-endpoint`, `/req/sf/resources-endpoint`, `/req/sf/canonical-url` | 23-001 §14 | Extends Features |
| `properties.spec.ts` | Part 1 | Property Definitions (non-feature) | `/req/property/canonical-endpoint`, `/req/property/resources-endpoint`, `/req/property/canonical-url` | 23-001 §15 | Adapted from Features |
| `datastreams.spec.ts` | Part 2 | Datastreams (Dynamic Data Stream) | `/req/datastream/canonical-endpoint`, `/req/datastream/resources-endpoint`, `/req/datastream/canonical-url`, `/req/datastream/ref-*` | 23-002 §9 | Reuses Features patterns |
| `observations.spec.ts` | Part 2 | Observations (Dynamic Data) | `/req/observation/canonical-endpoint`, `/req/observation/resources-endpoint`, `/req/observation/canonical-url`, `/req/observation/ref-*` | 23-002 §9 | Reuses Features patterns |
| `controlstreams.spec.ts` | Part 2 | Control Streams | `/req/controlstream/canonical-endpoint`, `/req/controlstream/resources-endpoint`, `/req/controlstream/canonical-url` | 23-002 §10–11 | Reuses Features |
| `commands.spec.ts` | Part 2 | Commands (Executable Resources) | `/req/command/canonical-endpoint`, `/req/command/resources-endpoint`, `/req/command/status-result` | 23-002 §7.4 / §10–11 | Reuses Features |
| `feasibility.spec.ts` | Part 2 | Feasibility (Planning Resource) | `/req/feasibility/canonical-endpoint`, `/req/feasibility/resources-endpoint`, `/req/feasibility/status-result` | 23-002 §7.4 / §12 | Reuses Features |
| `system-events.spec.ts` | Part 2 | System Events | `/req/system-event/canonical-endpoint`, `/req/system-event/resources-endpoint`, `/req/system-event/canonical-url`, `/req/system-event/ref-from-system` | 23-002 §7.4 / §10–11 | Reuses Features |
| `encodings.part1.spec.ts` | Part 1 | Feature Encodings (GeoJSON / SensorML-JSON) | `part1/encodings` | 23-001 §19 | N/A – Encoding profile test |
| `encodings.part2.spec.ts` | Part 2 | Dynamic Data Encodings (SWE) | `part2/encodings` | 23-002 Table 1 | N/A – Encoding profile test |
| `endpoints.part2.canonical.spec.ts` | Part 2 | Canonical Endpoint List | `part2/canonical-endpoints` | 23-002 §7.4 | Reuses Features API landing page pattern |

---

### 🧩 Summary

- **15 Jest spec files** generated and aligned to CSAPI Parts 1 & 2  
- Each test file maps directly to at least one normative requirement in the standards  
- Inheritance linkage is clear: *Features Core → CSAPI Part 1 → CSAPI Part 2*  
- The advanced filtering suite uses the `advanced` fixture profile to validate multi-filter semantics

---

**Next Phase:**  
Phase 2 · Step 3 – Test Harness Wiring  
> Implement client calls within each test to verify live compliance with CSAPI endpoints and encodings.