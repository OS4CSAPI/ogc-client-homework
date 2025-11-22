# OGC API – Connected Systems (CSAPI) Client Architecture

**Repository:** `OS4CSAPI/ogc-client`  
**Scope:** Client-side implementation of OGC API – Connected Systems (CSAPI) on top of the existing `ogc-client` architecture.

This document describes the current CSAPI client architecture as implemented under `src/ogc-api/csapi`, its relationship to the EDR and endpoint layers, and the associated test coverage. It is **descriptive only** and reflects the code as it exists today.

---

## 1. High-Level Overview

The CSAPI client is implemented as a **self-contained module tree** under:

- `src/ogc-api/csapi/**`

It is designed to be:

- **Typed:** CSAPI-specific data structures are defined in a separate model module.
- **Modular:** Each resource type has its own client.
- **Fixture-aware:** Tests can run against JSON fixtures or live endpoints.
- **Canonical:** All URLs are generated via a centralized URL builder.

CSAPI sits alongside, but does **not directly depend on**, the generic:

- `src/ogc-api/model.ts`
- `src/ogc-api/endpoint.ts`

Any future integration with the generic endpoint abstraction would be via HTTP / URL interfaces, not current direct imports.

---

## 2. CSAPI Modules

### 2.1 Model

**File:** `src/ogc-api/csapi/model.ts`

Defines CSAPI-specific type models, separate from `src/ogc-api/model.ts`, to keep CSAPI schemas independent:

- `CSAPIResource`
- `CSAPICollection`
- `CSAPISystem`
- `CSAPIParameter`

These types are used across CSAPI clients and tests to type fixture responses and maintain a coherent schema aligned with CSAPI Parts 1 & 2.

---

### 2.2 Helpers

**File:** `src/ogc-api/csapi/helpers.ts`

Central utility module for CSAPI, providing:

- **Parameter handling**

  - Functions to extract and normalize parameter structures from documents.

- **Fetch abstraction**

  - `csapiFetch` wrapper enforcing JSON media types.
  - Ensures CSAPI clients perform consistent HTTP interactions when not using fixtures.

- **Fixture handling**

  - `loadFixture` and related utilities for JSON resources under:
    - `fixtures/ogc-api/csapi/sample-data-hub/**`
  - This centralizes fixture paths and naming so tests and clients share the same conventions.

- **Execution mode switching**

  - `maybeFetchOrLoad` implements the execution policy:
    - Use fixtures,
    - Or perform live HTTP requests,
    - Or call another client via `./index` (when `CSAPI_CLIENT_MODE` is set).
  - This allows tests and consumers to flip behavior without changing call sites.

- **Test assertions**
  - `expectFeatureCollection` and `expectCanonicalUrl` are shared test assertions used throughout CSAPI specs:
    - Ensure GeoJSON FeatureCollection semantics.
    - Assert canonical URL patterns.

This module is the main shared utility layer for CSAPI; tests and clients depend on it heavily.

---

### 2.3 URL Builder

**File:** `src/ogc-api/csapi/url_builder.ts`

Single source of truth for **canonical CSAPI URLs**:

- **Core helpers**

  - `buildCsapiUrl` — base URL builder, typically using `process.env.CSAPI_API_ROOT`.
  - `get*Url` family — per-resource helpers:
    - e.g., `getSystemsUrl`, `getDeploymentsUrl`, `getSystemEventsUrl`, etc.
  - `getSystemEventsForSystemUrl` — nested resource URL helper for `/systems/{id}/events`.

- **Enumerations / aggregators**
  - `CANONICAL_ENDPOINTS`
    - Canonical list of all expected CSAPI endpoints; tests use this to assert coverage and presence.
  - `allCsapiCollections()`
    - Enumerates canonical CSAPI collection identifiers.
  - `allCsapiUrls()`
    - Aggregates all canonical CSAPI URLs for test discovery and coverage.

All CSAPI clients and tests use these helpers to avoid manual string concatenation and to keep URLs consistent across the codebase.

---

### 2.4 CSAPI Index

**File:** `src/ogc-api/csapi/index.ts`

Acts as the **public entrypoint** and registry for the CSAPI client layer:

- Re-exports all CSAPI resource modules (systems, deployments, procedures, etc.) plus `helpers.ts` and `model.ts`.
- Exposes a `CSAPIClients` map that wires resource names to their corresponding client classes.
  - Example usage in tests:
    - `new CSAPIClients.SystemsClient(apiRoot)`
- Enables generic instantiation and iteration over CSAPI clients without each test needing to import individual modules.

---

### 2.5 Resource Clients

Each CSAPI resource type has its own client module under `src/ogc-api/csapi/`:

- `systems.ts`
- `deployments.ts`
- `procedures.ts`
- `samplingFeatures.ts`
- `properties.ts`
- `datastreams.ts`
- `observations.ts`
- `controlStreams.ts`
- `commands.ts`
- `feasibility.ts`
- `systemEvents.ts`

Common characteristics:

- Hold an `apiRoot` (typically derived from environment or test configuration).
- Use the matching `get*Url` helper from `url_builder.ts` to construct canonical URLs.
- Delegate fetching or fixture loading to `maybeFetchOrLoad`.
- Cast responses to:
  - `CSAPICollection` (for collection endpoints), or
  - `any` where the schema is flexible but still tested via shared assertions.

**Special case – SystemsClient**

**File:** `src/ogc-api/csapi/systems.ts`

In addition to `list()` / `get()`:

- Uses `getSystemEventsUrl` / `getSystemEventsForSystemUrl` to surface nested `/systems/{id}/events`.
- Exposes a `getLinkedResources()` method:
  - Flattens link relations extracted from the system document.
  - Supports cross-collection navigation (e.g., systems → deployments/events).

These clients **do not** directly import or call `OgcApiEndpoint`. CSAPI is structured as a modular layer that can sit on top of HTTP URLs rather than being tightly coupled to the generic endpoint abstraction.

---

## 3. Shared Utilities & Relationships

### 3.1 Within CSAPI

- All CSAPI clients depend on `helpers.ts` for:
  - `maybeFetchOrLoad`
  - `csapiFetch`
  - `loadFixture`
- All CSAPI tests depend on:
  - `expectFeatureCollection`
  - `expectCanonicalUrl`
- URL construction for CSAPI is exclusively handled in `url_builder.ts`.

This makes `helpers.ts` and `url_builder.ts` the core shared modules for CSAPI.

### 3.2 Relationship to Generic Models and Endpoint

- `src/ogc-api/model.ts`

  - Defines generic OGC API models (e.g., `OgcApiCollectionInfo`), used heavily by EDR.
  - CSAPI currently has its own dedicated model definitions in `csapi/model.ts` and does not rely on `model.ts` for CSAPI resources.

- `src/ogc-api/endpoint.ts`
  - Generic endpoint abstraction:
    - Caches landing/conformance/document responses.
    - Checks capabilities for features/records/tiles/styles.
    - Vends `EDRQueryBuilder` via `endpoint.edr(collectionId)` when a collection advertises `data_queries`.
  - CSAPI clients do **not** currently import or call this class.
  - Any future bridge to CSAPI (e.g., endpoint-based discovery of CSAPI collections) would go through this abstraction.

Currently, CSAPI and the endpoint/EDR layers **coexist** under `src/ogc-api` but remain decoupled in code.

---

## 4. EDR and Endpoint Context (for Integration Awareness)

While not part of CSAPI itself, the EDR and endpoint modules live alongside CSAPI and inform potential integration strategies.

### 4.1 EDR Models and Helpers

- **`src/ogc-api/edr/model.ts`**

  - Provides EDR-specific structural types:
    - `WKT` aliases
    - BBox shapes
    - `ZParameter` union
    - Optional parameter bags
  - Includes `zParameterToString` for serialization.

- **`src/ogc-api/edr/helpers.ts`**
  - Implements `DateTimeParameterToEDRString`, converting the shared `DateTimeParameter` (from `../shared/models`) into EDR query string formats.

### 4.2 EDR URL Builder

- **`src/ogc-api/edr/url_builder.ts`**
  - `EDRQueryBuilder`:
    - Accepts `OgcApiCollectionInfo` (from `src/ogc-api/model.ts`).
    - Inspects collection metadata to determine supported query types, parameters, and CRSes.
    - Exposes methods like:
      - `buildPositionUrl`
      - `buildRadiusUrl`
      - `buildAreaUrl`
      - `buildCubeUrl`
      - `buildTrajectoryUrl`
      - `buildCorridorUrl`
      - `buildLocationsUrl`
      - `buildInstancesDownloadUrl`
    - Validates parameters and produces consistent query strings.

### 4.3 Endpoint Abstraction

- **`src/ogc-api/endpoint.ts`**
  - Represents the shared entry point for arbitrary OGC endpoints.
  - Uses helpers (e.g., `getChildPath`, `getLinkUrl`) to resolve advertised links.
  - Memoizes `EDRQueryBuilder` instances per collection so repeated EDR URL serialization is consistent.

Again, CSAPI does **not** currently integrate directly with this endpoint abstraction, but it is the natural bridge point for future work.

---

## 5. CSAPI Test Suite

All CSAPI tests live under:

- `src/ogc-api/csapi/__tests__/**`

They are extensive and organized by topic.

### 5.1 Landing & Canonical Discovery

- `common.spec.ts`

  - Validates landing and conformance documents.
  - Checks CSAPI-specific link relations (rels) and advertised resources.

- `endpoints.part2.canonical.spec.ts`

  - Ensures every entry in `CANONICAL_ENDPOINTS` is advertised and reachable.

- `clients.lifecycle.spec.ts`
  - Smoke-tests each client’s `list()` / `get()` lifecycle:
    - Ensures each CSAPI client operates correctly against fixtures or configured endpoints.

---

### 5.2 Part 1 Resources

- `deployments.spec.ts`
- `procedures.spec.ts`
- `sampling-features.spec.ts`
- `properties.spec.ts`
- `model.spec.ts`

These tests:

- Verify canonical `/deployments`, `/procedures`, `/samplingFeatures`, `/properties` endpoints.
- Assert proper CSAPI Part 1 semantics:
  - GeoJSON FeatureCollections.
  - SOSA feature types.
  - Property-definition structures.
- Validate `model.ts` type definitions against fixtures.

---

### 5.3 Part 2 Resources

- `systems.spec.ts`
- `system-events.spec.ts`
- `datastreams.spec.ts`
- `observations.spec.ts`
- `controlstreams.spec.ts`
- `commands.spec.ts`
- `feasibility.spec.ts`
- `linkage.spec.ts`

These tests:

- Assert canonical `/resource` and `/resource/{id}` semantics and FeatureCollections.
- Check cross-collection link requirements:
  - e.g., systems → deployments/events, datastreams → observations.
- Validate lifecycle-specific behavior:
  - e.g., `/status`, `/result` link relations for feasibility and commands.
- Include expectations for nested routes:
  - `/systems/{id}/datastreams`
  - `/datastreams/{id}/observations`
  - `/systems/{id}/events`, etc.

---

### 5.4 Encoding Coverage

- `encodings.part1.spec.ts`

  - Exercises GeoJSON vs SensorML negotiation for Part 1 resources (e.g., systems).

- `encodings.part2.spec.ts`
  - Verifies SWE Common encodings for Part 2 resources (datastreams, observations).

These tests ensure CSAPI correctly handles multiple encoding formats where required by the specification.

---

### 5.5 Helper-Specific Tests

- `helpers.spec.ts`
  - Validates `extractParameters` handling of structured and null input.
  - Ensures helper-level logic behaves correctly across edge cases.

Other specs reuse `expectFeatureCollection` and related helper assertions from `helpers.ts` to keep expectations consistent.

---

## 6. URL Serialization in Practice

### 6.1 CSAPI URL Serialization

- Centralized in `src/ogc-api/csapi/url_builder.ts`:
  - `buildCsapiUrl`
  - `get*Url` functions
  - `getSystemEventsForSystemUrl`
  - `allCsapiUrls()`

Tests use these builders to:

- Assert that every canonical endpoint is advertised and reachable.
- Validate that nested URLs (e.g., `/systems/{id}/events`) are built via helpers rather than manual string concatenation.

**Example usage:**

- `SystemsClient.listEvents()` (in `systems.ts`) depends on `getSystemEventsUrl` rather than constructing URLs manually.
- Other clients build item URLs by appending `/${id}` to the result of their corresponding builder.

---

### 6.2 EDR URL Serialization

- Implemented in `EDRQueryBuilder` (`src/ogc-api/edr/url_builder.ts`):
  - Validates support for each query type.
  - Checks parameter IDs and CRSes against collection metadata.
  - Serializes:
    - Date/time intervals (from `DateTimeParameter`).
    - Vertical coordinates (from `ZParameter`).
    - Additional EDR parameters.

`OgcApiEndpoint` memoizes `EDRQueryBuilder` instances, so repeated EDR requests share consistent URL construction.

---

## 7. Summary

The CSAPI implementation in this repo is:

- **Well-structured:**

  - Clear separation of models, helpers, URL builders, and resource clients.

- **Fixture-driven and test-rich:**

  - Extensive Jest test coverage for Part 1 and Part 2 resources, encoding behavior, and helper logic.

- **Modular and decoupled:**
  - CSAPI clients do not currently depend on `OgcApiEndpoint`.
  - The architecture allows future integration (e.g., using endpoint-driven discovery) without restructuring what already exists.

This document is intended to serve as a **snapshot of the current CSAPI client architecture**, providing a stable reference point for future maintenance, integration, or upstream contribution efforts.
