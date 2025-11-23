# OGC Client – CSAPI Integration Architecture

**Last updated:** 22 Oct 2025  
**Applies to:** `src/ogc-api/csapi/` module  
**Status:** Phase 3 (Integration Evaluation & Lifecycle Trace)  
**Author:** Sam Bolling / OS4CSAPI

---

## 🧭 Overview

This document explains how the **OGC API – Connected Systems (CSAPI)** module integrates with the core `ogc-client` TypeScript architecture.  
It highlights class inheritance, type relationships, and the end-to-end data-flow between the shared `Endpoint` abstraction and the resource-specific CSAPI clients.

The goal is to ensure that all Connected Systems clients (Parts 1 & 2) reuse the upstream lifecycle, type models, and utilities established by existing modules such as EDR and Features.

---

## 🧩 Inheritance and Type Flow Diagram

```text
OGC-CLIENT ARCHITECTURE (simplified)

src/ogc-api/endpoint.ts
│
├── class Endpoint<TInfo, TFeature>
│     ├─ manages: fetchOptions, baseUrl, readiness state
│     ├─ methods: isReady(), fetchCapabilities(), getLinks(), etc.
│     └─ generic types: EndpointInfo, Feature
│
└── exports: GenericEndpointInfo, OperationUrl, EndpointOptions
       ↑
       │ (imported by all API-specific modules)
       │
src/ogc-api/csapi/
│
├── systems.ts              → class SystemsClient extends Endpoint<CSAPISystemCollection, CSAPISystem>
├── deployments.ts           → class DeploymentsClient extends Endpoint<CSAPISystemCollection, CSAPISystem>
├── procedures.ts            → class ProceduresClient extends Endpoint<CSAPICollection, CSAPIResource>
├── datastreams.ts           → class DatastreamsClient extends Endpoint<CSAPICollection, CSAPIResource>
├── observations.ts          → class ObservationsClient extends Endpoint<CSAPICollection, CSAPIResource>
├── controlStreams.ts        → class ControlStreamsClient extends Endpoint<CSAPICollection, CSAPIResource>
├── commands.ts              → class CommandsClient extends Endpoint<CSAPICollection, CSAPIResource>
├── feasibility.ts           → class FeasibilityClient extends Endpoint<CSAPICollection, CSAPIResource>
├── systemEvents.ts          → class SystemEventsClient extends Endpoint<CSAPICollection, CSAPIResource>
│
└── model.ts                 → defines CSAPIResource, CSAPICollection, CSAPISystem, etc.
       ↑
       │
src/ogc-api/csapi/index.ts   → exports all clients for barrel import
       ↑
       │
__tests__/clients.lifecycle.spec.ts → instantiates each Client, calls list()/get(), checks FeatureCollection
```

---

## ⚙️ Component Roles

| Layer             | Responsibility                                        | Example Symbol                     |
| ----------------- | ----------------------------------------------------- | ---------------------------------- |
| **Endpoint base** | Shared request lifecycle / state management           | `isReady()`, `fetchCapabilities()` |
| **CSAPI clients** | Domain-specific bindings (Systems, Deployments, etc.) | `SystemsClient.list()`             |
| **Type model**    | Defines Part 1 & 2 entities and collections           | `CSAPISystemCollection`            |
| **Test harness**  | Validates lifecycle + schema conformance              | `expectFeatureCollection()`        |

---

## 🔄 Integration Behavior

- CSAPI clients **extend** the shared `Endpoint` class and inherit its full lifecycle.
- Each client’s `list()` and `get(id)` methods implement canonical Connected Systems paths defined in OGC 23-002 § 7.4 – § 11.
- TypeScript generics enforce correct typing of all responses:  
  `Endpoint<CSAPICollection, CSAPIResource>`.
- All clients participate in the shared **readiness** flow (`isReady()`, `_info`, `fetchOptionsUpdateCallback`).
- Unit and integration tests under `__tests__/clients.lifecycle.spec.ts` validate consistent behavior across all endpoints.

---

## 🧠 Design Principles

1. **Reuse over Rewrite** – All network behavior, caching, and link resolution are inherited from the upstream `Endpoint` abstraction.
2. **Normative Mapping** – Each entity maps 1-to-1 with OGC API – Connected Systems Parts 1 & 2 requirements.
3. **Strict Typing** – The module compiles cleanly under `--strict`, providing forward compatibility with future OGC API client extensions.
4. **Hybrid Testing** – Supports both fixture-based and live endpoint validation via environment flags (`CSAPI_LIVE`, `CSAPI_CLIENT_MODE`).

---

## 🧾 Contributor Notes

- Add new CSAPI resource clients by subclassing `Endpoint<TCollection, TResource>` and following the established path and type conventions.
- Document new resource mappings in `docs/requirements/CSAPI_Requirements_Register_v1.0`.
- Keep all new tests under `src/ogc-api/csapi/__tests__/` and reference `expectFeatureCollection()` for validation.

---

## 🔗 References

- **OGC 23-001** – OGC API – Connected Systems Part 1: Feature Resources
- **OGC 23-002** – OGC API – Connected Systems Part 2: Dynamic Data
- **Upstream Repository:** [camptocamp/ogc-client](https://github.com/camptocamp/ogc-client)
- **Implementation Branch:** `src/ogc-api/csapi/`
