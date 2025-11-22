# CSAPI Test Harness – Traceability Index

_(Phase 2 · Step 2 – Grouped Jest Specs)_

This document links each generated Jest spec file to its corresponding normative
requirements from **OGC API – Connected Systems** Parts 1 & 2 and, where applicable,
its inherited relationship to **OGC API – Features Core**.

---

| **Spec File**                       | **CSAPI Part** | **Resource or Concept**                     | **Referenced Requirements**                                                                                                                                                                                        | **Relevant Standard Clauses** | **Features Core Linkage**                  |
| :---------------------------------- | :------------- | :------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------- | :----------------------------------------- |
| `common.spec.ts`                    | Part 2         | Common / Resource semantics                 | `/req/api-common/resources`, `/req/api-common/resource-collection`                                                                                                                                                 | 23-002 §8.2–8.3 / §8.3        | Derived from OGC API – Features §7.14–7.16 |
| `systems.spec.ts`                   | Part 1         | Systems (Feature Resource)                  | `/req/system/canonical-endpoint`, `/req/system/resources-endpoint`, `/req/system/canonical-url`, `/req/system/collections`                                                                                         | 23-001 §9.3–§9.5              | Extends Features Items & Collections       |
| `deployments.spec.ts`               | Part 1         | Deployments (Feature Resource)              | `/req/deployment/canonical-endpoint`, `/req/deployment/resources-endpoint`, `/req/deployment/canonical-url`                                                                                                        | 23-001 §11                    | Extends Features Collections               |
| `procedures.spec.ts`                | Part 1         | Procedures (Feature Resource)               | `/req/procedure/canonical-endpoint`, `/req/procedure/resources-endpoint`, `/req/procedure/canonical-url`                                                                                                           | 23-001 §13                    | Extends Features Collections               |
| `sampling-features.spec.ts`         | Part 1         | Sampling Features (Feature Resource)        | `/req/sf/canonical-endpoint`, `/req/sf/resources-endpoint`, `/req/sf/canonical-url`                                                                                                                                | 23-001 §14                    | Extends Features Collections               |
| `properties.spec.ts`                | Part 1         | Property Definitions (non-feature)          | `/req/property/canonical-endpoint`, `/req/property/resources-endpoint`, `/req/property/canonical-url`                                                                                                              | 23-001 §15                    | Adapted from Features Core concepts        |
| `datastreams.spec.ts`               | Part 2         | Datastreams (Dynamic Data Stream)           | `/req/datastream/canonical-endpoint`, `/req/datastream/resources-endpoint`, `/req/datastream/canonical-url`, `/req/datastream/ref-from-system`, `/req/datastream/ref-from-deployment`, `/req/datastream/schema-op` | 23-002 §7.4 / §9 / §8.3       | Reuses Features query/paging               |
| `observations.spec.ts`              | Part 2         | Observations (Dynamic Data)                 | `/req/observation/canonical-endpoint`, `/req/observation/resources-endpoint`, `/req/observation/canonical-url`, `/req/observation/ref-from-datastream`                                                             | 23-002 §7.4 / §9              | Reuses Features Items semantics            |
| `controlstreams.spec.ts`            | Part 2         | Control Streams                             | `/req/controlstream/canonical-endpoint`, `/req/controlstream/resources-endpoint`, `/req/controlstream/canonical-url`                                                                                               | 23-002 §10–11                 | Reuses Features paging/filtering           |
| `commands.spec.ts`                  | Part 2         | Commands (Executable Resources)             | `/req/command/canonical-endpoint`, `/req/command/resources-endpoint`, `/req/command/status-result`                                                                                                                 | 23-002 §7.4 / §10–11          | Reuses Features item semantics             |
| `feasibility.spec.ts`               | Part 2         | Feasibility (Planning Resource)             | `/req/feasibility/canonical-endpoint`, `/req/feasibility/resources-endpoint`, `/req/feasibility/status-result`                                                                                                     | 23-002 §7.4 / §11             | Reuses Features item semantics             |
| `events.spec.ts`                    | Part 2         | System Events                               | `/req/system-event/canonical-endpoint`, `/req/system-event/resources-endpoint`, `/req/system-event/canonical-url`, `/req/system-event/ref-from-system`                                                             | 23-002 §7.4 Req40–43          | Reuses Features Collections                |
| `encodings.part1.spec.ts`           | Part 1         | Feature Encodings (GeoJSON / SensorML-JSON) | `part1/encodings`                                                                                                                                                                                                  | 23-001 §19                    | N/A – Encoding profile test                |
| `encodings.part2.spec.ts`           | Part 2         | Dynamic Data Encodings (SWE)                | `part2/encodings`                                                                                                                                                                                                  | 23-002 Table 1                | N/A – Encoding profile test                |
| `endpoints.part2.canonical.spec.ts` | Part 2         | Canonical Endpoint List                     | `part2/canonical-endpoints`                                                                                                                                                                                        | 23-002 §7.4                   | Reuses Features API landing page pattern   |

---

### 🧩 Summary

- **15 Jest spec files** generated and aligned to CSAPI Parts 1 & 2
- Each test file maps directly to at least one normative requirement in the standards
- Inheritance linkage is clear: _Features Core → CSAPI Part 1 → CSAPI Part 2_
- These specs collectively form the **CSAPI client test harness foundation** used for TDD in subsequent phases

---

**Next Phase:**  
Phase 2 · Step 3 – Test Harness Wiring

> Implement client calls within each test to verify live compliance with CSAPI endpoints and encodings.
