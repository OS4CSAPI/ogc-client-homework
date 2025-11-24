<!--
@license BSD-3-Clause
Copyright (c) 2024 OS4CSAPI contributors
-->

# OGC API – Connected Systems (CSAPI) Test Harness Guide

_(Phase 2 · Step 3 — Test Harness Wiring Completion; updated for profile-aware fixtures)_

This document explains how to use, configure, and maintain the **CSAPI client test harness** implemented in this phase.  
It describes the test structure, the hybrid fixture/live execution model, and how tests trace back to the CSAPI Parts 1 & 2 standards.

---

## 🧭 Purpose

The CSAPI test harness verifies that a client correctly implements the **OGC API – Connected Systems** standards:

- **Part 1 — Feature Resources** (OGC 23-001)
- **Part 2 — Dynamic Data** (OGC 23-002)

It provides:

- A comprehensive Jest-based test suite for canonical CSAPI endpoints.
- Hybrid execution using profile-aware static fixtures (offline) or live network requests.
- Traceability between each test, fixture, and normative requirement.

---

## 🧩 Test Suite Overview

**Location**

```
src/ogc-api/csapi/__tests__/
```

**Structure**

| Category                   | Description                                                                    | Example Files                                                                                                                               |
| :------------------------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| Core API behavior          | Landing page & conformance checks                                              | `common.spec.ts`                                                                                                                            |
| Canonical endpoints        | Discovery and accessibility of CSAPI endpoints                                 | `endpoints.part2.canonical.spec.ts`                                                                                                         |
| Feature resources (Part 1) | Systems, Deployments, Procedures, SamplingFeatures, Properties                 | `systems.spec.ts`, `deployments.spec.ts`, `procedures.spec.ts`, `sampling-features.spec.ts`, `properties.spec.ts`                           |
| Dynamic resources (Part 2) | Datastreams, Observations, Commands, Feasibility, ControlStreams, SystemEvents | `datastreams.spec.ts`, `observations.spec.ts`, `commands.spec.ts`, `feasibility.spec.ts`, `controlstreams.spec.ts`, `system-events.spec.ts` |
| Encodings                  | GeoJSON, SensorML-JSON, SWE Common, OM-JSON                                    | `encodings.part1.spec.ts`, `encodings.part2.spec.ts`                                                                                        |
| Advanced filtering (B7)    | In-memory, requirement-driven filtering helpers                                | `advanced-filtering.spec.ts`                                                                                                                |

Each spec maps directly to normative requirements (`/req/...`) and references a corresponding fixture.

---

## 🧰 Fixtures

### Unified Examples Suite

All fixtures are now located in a single unified directory:

**`fixtures/ogc-api/csapi/examples/`**

This directory replaces the previous separate `sample-data-hub` and `advanced` fixture directories. The unified suite provides:

- **Standards-compliant geometry**: Spatial resources include valid GeoJSON geometry (Point, Polygon, LineString)
- **Complete metadata**: All features include proper `links` arrays, `featureType`, and relationship metadata
- **Rich relationships**: Resources include relationship arrays (procedureIds, foiIds, observedProperties, controlledProperties, systemIds)
- **Advanced filtering support**: Dedicated resources (sys-1, sys-3, dep-1, dep-2, proc-2, sf-9) for comprehensive filter testing
- **Diverse coverage**: Multiple geometry types, parent-child hierarchies, temporal scopes, nested collections

The fixture loader automatically uses this unified directory - no profile selection is needed.

See `fixtures/ogc-api/csapi/examples/README.md` for detailed documentation of the unified suite.

---

## ⚙️ Running the Tests

### 1) Fixture Mode (default — offline)

Uses static JSON fixtures from the unified examples directory (no network calls).

```bash
npm test -- src/ogc-api/csapi/__tests__/
```

### 2) Live Mode (integration testing)

Fetches responses from a live CSAPI-compliant server.

```bash
CSAPI_LIVE=true CSAPI_API_ROOT=https://example.csapi.server npm test
```

**Environment Variables**

| Name                        | Description                                                               |
| :-------------------------- | :------------------------------------------------------------------------ |
| `CSAPI_LIVE`                | When set to `"true"`, enables live network testing.                       |
| `CSAPI_API_ROOT`            | Base URL of the CSAPI service under test.                                 |
| ~~`CSAPI_FIXTURE_PROFILE`~~ | **Deprecated** - No longer used. All fixtures load from unified examples/ |

> When `CSAPI_LIVE` is **not** set, the harness automatically falls back to **fixture mode** using the unified examples directory.

---

## 🧪 Hybrid Execution Model

Helper functions are defined in:

```
src/ogc-api/csapi/helpers.ts
```

Profile-aware fixture loading utilities are defined in:

```
src/ogc-api/csapi/fixture_loader.ts
```

| Function                                   | Purpose                                                        |
| :----------------------------------------- | :------------------------------------------------------------- |
| `fetchCollection(url)`                     | Performs live HTTP fetch.                                      |
| `loadFixture(name)`                        | Loads a local fixture file by name from unified examples/.     |
| `maybeFetchOrLoad(name, url)`              | Chooses client mode, live mode, or fixture mode automatically. |
| `expectFeatureCollection(data, itemType?)` | Standard assertion for FeatureCollection validity.             |
| `expectCanonicalUrl(url, pattern)`         | Asserts endpoint URL conformance.                              |

---

## 🔎 Advanced Filtering Note

The advanced filtering spec uses resources from the unified fixtures suite that include rich relationship data (procedureIds, foiIds, observedProperties, controlledProperties, systemIds).

All resources needed for advanced filtering tests are automatically available in the unified examples directory.

Pattern used in `advanced-filtering.spec.ts`:

```ts
// Import filtering helpers - automatically uses unified fixtures
const {
  filterSystems,
  filterDeployments,
  filterProcedures,
  filterSamplingFeatures,
  filterPropertyDefs,
  intersection,
  geometryFilterPlaceholder,
  systems,
} = require('../advanced_filtering_helpers');
```

The unified fixtures include dedicated resources for advanced filtering:

- **sys-1, sys-3**: Systems with parent, procedure, FOI, and property associations
- **dep-1, dep-2**: Deployments with system, FOI, and property arrays
- **proc-2**: Procedure with property associations
- **sf-9**: Sampling feature with FOI and property arrays
- **prop-def-1**: Property definition with baseProperty and objectTypes

---

## 📘 Traceability and Documentation

| Artifact                                    | Purpose                                                                             |
| :------------------------------------------ | :---------------------------------------------------------------------------------- |
| `CSAPI_Test_Design_Matrix_v1.0.md`          | Maps each requirement (`/req/...`) to test IDs and expected outcomes.               |
| `Fixture_Index.md`                          | Lists all fixtures and their associated tests/requirements. Notes profile variants. |
| `CSAPI_Test_Harness_Guide.md` _(this file)_ | How to execute and maintain the test suite.                                         |

Together these provide full transparency between **standards**, **tests**, and **data**.

---

## 🧾 Phase 2 · Step 3 — Completion Summary

| Deliverable                             | Status                            | Location                                              |
| :-------------------------------------- | :-------------------------------- | :---------------------------------------------------- |
| Jest spec files for all CSAPI endpoints | ✅ Implemented                    | `src/ogc-api/csapi/__tests__/`                        |
| Hybrid helpers (fixture/live switching) | ✅ Implemented                    | `src/ogc-api/csapi/helpers.ts`                        |
| Profile-aware fixture loader            | ✅ Implemented                    | `src/ogc-api/csapi/fixture_loader.ts`                 |
| URL builder updates                     | ✅ Implemented                    | `src/ogc-api/csapi/url_builder.ts`                    |
| Fixture stubs (default)                 | ✅ Created                        | `fixtures/ogc-api/csapi/sample-data-hub/`             |
| Advanced fixtures (enriched)            | ✅ Created (selected suites)      | `fixtures/ogc-api/csapi/advanced/`                    |
| Fixture index (traceability doc)        | ✅ Created                        | `docs/csapi/_tests_/Fixture_Index.md`                 |
| Test harness guide                      | ✅ Created                        | `docs/csapi/_tests_/CSAPI_Test_Harness_Guide.md`      |
| Test Design Matrix update               | 🔲 Pending (mark “Fixture Ready”) | `docs/csapi/_tests_/CSAPI_Test_Design_Matrix_v1.0.md` |

---

## 🧭 Next Phase

**Phase 2 · Step 4 — Client Implementation (Incremental TDD)**  
Implement CSAPI client functionality in small, test-driven increments until all spec tests pass.  
This phase will:

- Extend `src/ogc-api/csapi/` with client classes/methods.
- Use the existing test harness to drive implementation.
- Replace fixture-only verification with live endpoint validation.

---

_Prepared as part of OGC Client CSAPI Implementation — Phase 2 · Step 3. Updated to include profile-aware fixture loading._
