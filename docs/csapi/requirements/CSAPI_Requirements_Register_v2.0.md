# OGC Client – CSAPI Requirements Register v2.0
Author: Sam Bolling · Date: 2025-10-13


> Purpose: Map every normative requirement relevant to a CSAPI client to clear implementation targets and tests, preserving traceability to the standards.
> Legend (Inheritance Type): Inherited = satisfied by existing OGC API Features client; Specialized = Features semantics adapted to CS resources; New = CSAPI-specific.
> Quoting note: Verbatim snippets are abridged (≤25 words) with citations stored in project docs.

## A) Imported Requirements — OGC API Features Part 1 (Core) (used by CSAPI)

| Ref ID (Features) | Requirement Class | Normative Statement (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|---|
| `/req/core/root-op` | Core | “Server SHALL support HTTP GET at path /.” | 17-069r4 §7.2 | Landing page GET at `/`. | Inherited | CS-1 §7; CS-2 §8 | src/ogc-api/endpoint.ts | Verify | spec/ogc-api/core.landing.spec.ts |
| `/req/core/root-success` | Core | “200 response… include links to API definition, /conformance, /collections.” | 17-069r4 §7.2 | Landing page content and links. | Inherited | CS-1 §7.5; CS-2 §7.4 | endpoint.ts, info.ts | Verify | core.landing.links.spec.ts |
| `/req/collections/*` | Collections | Paging (`limit`), `bbox`, `datetime`, items at `/collections/{id}/items`. | 17-069r4 §7.14–7.16 | Collections behavior and query params. | Inherited | CS-1 §7.5; CS-2 §8.3 | link-utils.ts, endpoint.ts | Verify | collections.behavior.spec.ts |
| `/req/items/*` | Items | GET single item at `/collections/{id}/items/{itemId}`. | 17-069r4 §7.14–7.16 | Single feature resource access. | Inherited | CS-1 classes | existing Feature item fetch | Verify | items.single.spec.ts |


## B) CSAPI Part 1 — Feature Resources (Systems, Deployments, Procedures, SamplingFeatures, Property Definitions)

### B1. Common overview & collections

| Ref ID (CSAPI) | Requirement Class | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|---|
| `part1/overview` | Part 1 §7 | “All resources in Part 1 are feature types, except Property Definition.” | 23-001 §7.3/Table 1 | Systems, Deployments, Procedures, Sampling Features are Features; Property is non-feature. | Specialized | Features Core | csapi/model.ts | Align models | csapi/models.part1.spec.ts |
| `part1/collections-meta` | Part 1 §7.5 | “Feature collections… governed by OGC API — Features Part 1… indicate `itemType`, `featureType`.” | 23-001 §7.5 | CS collections reuse Features rules; add `featureType`. | Specialized | 17-069r4 §7.14–7.16 | info.ts, model.ts | Extend parser | csapi/collections.meta.spec.ts |

### B2. Systems

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/system/canonical-url` | “Canonical URL {api_root}/systems/{id}.” | 23-001 §9.3 | Canonical item URL pattern. | Specialized | Features Items | csapi/url_builder.ts | Implement | systems.canonical-url.spec.ts |
| `/req/system/resources-endpoint` | “GET fulfills Features collection clauses.” | 23-001 §9.4 | Systems listing follows Features collection rules. | Specialized | 17-069r4 §7.15 | csapi/helpers.ts | Implement | systems.endpoint.spec.ts |
| `/req/system/canonical-endpoint` | “Expose {api_root}/systems.” | 23-001 §9.4.2 | Top-level Systems collection required. | Specialized | Features Collections | csapi/url_builder.ts | Implement | systems.canonical.spec.ts |
| `/req/system/collections` | “Feature collection with featureType sosa:System; items behave as endpoint.” | 23-001 §9.5 | Collections grouping & semantics. | Specialized | 17-069r4 | info.ts, helpers.ts | Map featureType | systems.collections.spec.ts |

### B3. Deployments

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/deployment/canonical-url` | “Canonical URL {api_root}/deployments/{id}.” | 23-001 §11 | Canonical item URL. | Specialized | Features Items | csapi/url_builder.ts | Implement | deployments.canonical-url.spec.ts |
| `/req/deployment/resources-endpoint` | “GET follows Features clauses.” | 23-001 §11 | Listing/filtering rules. | Specialized | 17-069r4 | csapi/helpers.ts | Implement | deployments.endpoint.spec.ts |
| `/req/deployment/canonical-endpoint` | “Expose {api_root}/deployments.” | 23-001 §11 | Canonical resources endpoint. | Specialized | Collections | csapi/url_builder.ts | Implement | deployments.canonical.spec.ts |
| `/req/deployment/collections` | “Feature collection featureType Deployment; items act like endpoint.” | 23-001 §11 | Collections semantics. | Specialized | 17-069r4 | info.ts | Map | deployments.collections.spec.ts |

### B4. Procedures

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/procedure/canonical-url` | “Canonical URL {api_root}/procedures/{id}.” | 23-001 §13 | Canonical URL. | Specialized | Features Items | csapi/url_builder.ts | Implement | procedures.canonical-url.spec.ts |
| `/req/procedure/resources-endpoint` | “GET supports Features collection clauses.” | 23-001 §13 | Listing behavior. | Specialized | 17-069r4 | csapi/helpers.ts | Implement | procedures.endpoint.spec.ts |
| `/req/procedure/canonical-endpoint` | “Expose {api_root}/procedures.” | 23-001 §13 | Top-level endpoint. | Specialized | Collections | csapi/url_builder.ts | Implement | procedures.canonical.spec.ts |
| `/req/procedure/collections` | “Feature collection featureType Procedure; items act like endpoint.” | 23-001 §13 | Collections semantics. | Specialized | 17-069r4 | info.ts | Map | procedures.collections.spec.ts |

### B5. Sampling Features

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/sf/canonical-url` | “Canonical URL {api_root}/samplingFeatures/{id}.” | 23-001 §14 | Canonical URL. | Specialized | Features Items | csapi/url_builder.ts | Implement | sf.canonical-url.spec.ts |
| `/req/sf/resources-endpoint` | “GET supports Features collection clauses.” | 23-001 §14 | Listing/filtering. | Specialized | 17-069r4 | csapi/helpers.ts | Implement | sf.endpoint.spec.ts |
| `/req/sf/canonical-endpoint` | “Expose {api_root}/samplingFeatures.” | 23-001 §14 | Canonical endpoint. | Specialized | Collections | csapi/url_builder.ts | Implement | sf.canonical.spec.ts |
| `/req/sf/collections` | “Feature collection featureType SamplingFeature; items behave as endpoint.” | 23-001 §14 | Collections semantics. | Specialized | 17-069r4 | info.ts | Map | sf.collections.spec.ts |

### B6. Property Definitions (non-feature)

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/property/canonical-url` | “Canonical URL {api_root}/properties/{id}.” | 23-001 §15 | Canonical URL (non-feature). | Specialized | Part 1 §7.3 | csapi/url_builder.ts | Implement | properties.canonical-url.spec.ts |
| `/req/property/resources-endpoint` | “GET supports listing; non-feature semantics.” | 23-001 §15 | Resource collection (non-feature). | Specialized | 17-069r4 adapted | csapi/helpers.ts | Implement | properties.endpoint.spec.ts |
| `/req/property/canonical-endpoint` | “Expose {api_root}/properties.” | 23-001 §15 | Canonical endpoint. | Specialized | — | csapi/url_builder.ts | Implement | properties.canonical.spec.ts |


## C) CSAPI Part 2 — Dynamic Data (non-feature resources)

### C1. Common

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/api-common/resources` | “Replace ‘features’ with ‘resources’ when interpreting Features Parts 1 & 4.” | 23-002 §8.2–8.3 | Apply Features semantics to non-feature resources. | Specialized | 17-069r4 | endpoint.ts adapters | Implement | common.resources.spec.ts |
| `/req/api-common/resource-collection` | “Resource collection SHALL fulfill Features §§7.14–7.16.” | 23-002 §8.3 | Collections act like Features Collections with `itemType`. | Specialized | 17-069r4 | helpers.ts | Implement | common.collections.spec.ts |

### C2. Datastreams & Observations

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/datastream/canonical-url` | “Canonical URL {api_root}/datastreams/{id}.” | 23-002 §9 | Canonical resource URL. | New | — | csapi/url_builder.ts | Implement | datastreams.canonical-url.spec.ts |
| `/req/datastream/resources-endpoint` | “GET supports `limit`, `datetime`; 200; Features-style errors.” | 23-002 §9.4 | List/filter datastreams. | New | 17-069r4 §7.15 | csapi/helpers.ts | Implement | datastreams.endpoint.spec.ts |
| `/req/datastream/canonical-endpoint` | “Expose {api_root}/datastreams.” | 23-002 §7.4 | Canonical resources endpoint. | New | — | csapi/url_builder.ts | Implement | datastreams.canonical.spec.ts |
| `/req/datastream/ref-from-system` | “Nested `/systems/{sysId}/datastreams`.” | 23-002 §9 | Datastreams by System. | New | — | csapi/url_builder.ts | Implement | datastreams.bySystem.spec.ts |
| `/req/datastream/ref-from-deployment` | “Nested `/deployments/{depId}/datastreams`.” | 23-002 §9 | Datastreams by Deployment. | New | — | csapi/url_builder.ts | Implement | datastreams.byDeployment.spec.ts |
| `/req/datastream/collections` | “Collections itemType=DataStream behave like endpoint.” | 23-002 §9 | Collections semantics. | New | §8.3 | info.ts | Map | datastreams.collections.spec.ts |
| `/req/datastream/schema-op` | “GET `{id}/schema?obsFormat=…` returns one schema (200).” | 23-002 §9 | Observation schema negotiation. | New | SWE-3 | csapi/helpers.ts | Implement | datastreams.schema.spec.ts |
| `/req/observation/canonical-url` | “Canonical URL {api_root}/observations/{id}.” | 23-002 §9 | Observation canonical URL. | New | — | csapi/url_builder.ts | Implement | observations.canonical-url.spec.ts |
| `/req/observation/resources-endpoint` | “GET supports `limit`, `datetime`; 200.” | 23-002 §9 | List/filter observations. | New | 17-069r4 | csapi/helpers.ts | Implement | observations.endpoint.spec.ts |
| `/req/observation/canonical-endpoint` | “Expose {api_root}/observations.” | 23-002 §7.4 | Canonical Observations endpoint. | New | — | csapi/url_builder.ts | Implement | observations.canonical.spec.ts |
| `/req/observation/ref-from-datastream` | “Nested `/datastreams/{id}/observations`.” | 23-002 §9 | Obs by DataStream. | New | — | csapi/url_builder.ts | Implement | observations.byStream.spec.ts |
| `/req/observation/collections` | “Collections itemType=Observation behave like endpoint.” | 23-002 §9 | Obs collections. | New | §8.3 | info.ts | Map | observations.collections.spec.ts |

### C3. ControlStreams & Commands

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/controlstream/canonical-url` | “Canonical URL {api_root}/controlstreams/{id}.” | 23-002 §7.4 | Canonical URL. | New | — | csapi/url_builder.ts | Implement | controlstreams.canonical-url.spec.ts |
| `/req/controlstream/resources-endpoint` | “GET supports `limit`, `datetime`; 200.” | 23-002 §10–11 | List/filter control streams. | New | 17-069r4 | csapi/helpers.ts | Implement | controlstreams.endpoint.spec.ts |
| `/req/command/canonical-url` | “Canonical URL {api_root}/commands/{id}.” | 23-002 §7.4 | Canonical URL. | New | — | csapi/url_builder.ts | Implement | commands.canonical-url.spec.ts |
| `/req/command/resources-endpoint` | “GET supports `limit`, `datetime`; 200.” | 23-002 §10–11 | List/filter commands. | New | 17-069r4 | csapi/helpers.ts | Implement | commands.endpoint.spec.ts |
| `/req/command/status-result` | “Status and Result resources for a command.” | 23-002 §10–11 | Separate status/result resources. | New | — | csapi/model.ts, parsers | Implement | commands.status-result.spec.ts |

### C4. Feasibility

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/feasibility/canonical-url` | “Canonical URL {api_root}/feasibility/{id}.” | 23-002 §7.4 | Canonical URL. | New | — | csapi/url_builder.ts | Implement | feasibility.canonical-url.spec.ts |
| `/req/feasibility/resources-endpoint` | “GET supports `limit`, `datetime`; 200.” | 23-002 §11 | List/filter feasibility. | New | 17-069r4 | csapi/helpers.ts | Implement | feasibility.endpoint.spec.ts |
| `/req/feasibility/status-result` | “Status and Result resources for feasibility.” | 23-002 §11 | Separate lifecycle resources. | New | — | csapi/model.ts, parsers | Implement | feasibility.status-result.spec.ts |

### C5. System Events

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/system-event/canonical-url` | “Canonical URL {api_root}/systemEvents/{id}.” | 23-002 §7.4/Req40 | Canonical URL & link rel=canonical. | New | — | csapi/url_builder.ts | Implement | events.canonical-url.spec.ts |
| `/req/system-event/resources-endpoint` | “GET supports `limit`, `datetime`; 200.” | 23-002 §7.4/Req41 | List/filter events. | New | 17-069r4 | csapi/helpers.ts | Implement | events.endpoint.spec.ts |
| `/req/system-event/canonical-endpoint` | “Expose {api_root}/systemEvents.” | 23-002 §7.4/Req42 | Canonical resources endpoint. | New | — | csapi/url_builder.ts | Implement | events.canonical.spec.ts |
| `/req/system-event/ref-from-system` | “Nested `/systems/{sysId}/events`.” | 23-002 §7.4/Req43 | Events by System. | New | — | csapi/url_builder.ts | Implement | events.bySystem.spec.ts |
| `/req/system-event/collections` | “Collections itemType=SystemEvent behave like endpoint.” | 23-002 §7.4/Req44 | Collections semantics. | New | §8.3 | info.ts | Map | events.collections.spec.ts |

## D) Encodings

| Topic | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|
| Part 1 encodings | “Clause 19; GeoJSON, SML-JSON profiles.” | 23-001 §19 | Feature encodings and schemas. | Specialized | encoding.ts, model.ts | Map profiles | encodings.part1.spec.ts |
| Part 2 encodings | “Observations & Commands: JSON, SWE-JSON, SWE-Text, SWE-Binary.” | 23-002 Table 1 | Dynamic data encodings. | New | encoding.ts, parsers | Implement | encodings.part2.spec.ts |
| Canonical endpoints list | “/datastreams, /observations, /controlstreams, /commands, /feasibility, /systemEvents.” | 23-002 §7.4 | Well-known top-level routes. | New | url_builder.ts | Implement | endpoints.part2.canonical.spec.ts |



### B7. Advanced Filtering

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/advanced-filtering/resource-by-id` | "All CSAPI resources endpoint operations SHALL support the query parameter `id`." | 23-001 §16.3.2 | All CSAPI resources endpoints MUST support `id=ID_List`. Only resources whose IDs match the requested IDs (including wildcard `*` suffix for UIDs) may be returned. | New | All resource endpoints | csapi/filters.ts | Implement | filters.id.spec.ts |
| `/req/advanced-filtering/resource-by-keyword` | "All CSAPI resources endpoint operations SHALL support the query parameter `q`." | 23-001 §16.3.3 | All CSAPI resources endpoints MUST support keyword search via `q`. At minimum, the `name` and `description` fields MUST be searched, and only resources with at least one matching keyword shall be returned. | New | All resource endpoints | csapi/filters.ts | Implement | filters.keyword.spec.ts |
| `/req/advanced-filtering/feature-by-geom` | "The server SHALL support the `geom` parameter to filter features by spatial intersection." | 23-001 §16.4.1 | Feature resources endpoints (Systems, Deployments, Sampling Features) MUST support a `geom` query parameter containing a WKT geometry. Only features whose geometry intersects the given geometry may be returned. | New | Feature resources | csapi/filters.ts | Implement | filters.geom.spec.ts |
| `/req/advanced-filtering/system-by-parent` | "`parent` MUST be supported to filter systems by parent system." | 23-001 §16.5.4 | System resources endpoints MUST support `parent=ID_List` and return only systems whose parent system ID matches one of the specified IDs. | New | System resources | csapi/filters.ts | Implement | filters.system-parent.spec.ts |
| `/req/advanced-filtering/system-by-procedure` | "`procedure` MUST be supported to filter systems by associated procedure." | 23-001 §16.5 | System resources endpoints MUST support `procedure=ID_List` and return only systems that are associated with one or more of the specified procedures. | New | System resources | csapi/filters.ts | Implement | filters.system-procedure.spec.ts |
| `/req/advanced-filtering/system-by-foi` | "`foi` MUST be supported to filter systems by feature of interest." | 23-001 §16.5 | System resources endpoints MUST support `foi=ID_List` and return only systems that observe, or whose subsystems observe, the specified features of interest. | New | System resources | csapi/filters.ts | Implement | filters.system-foi.spec.ts |
| `/req/advanced-filtering/system-by-obsprop` | "`observedProperty` MUST be supported to filter systems by observed property." | 23-001 §16.5 | System resources endpoints MUST support `observedProperty=ID_List` and return only systems (including via subsystems) that observe the requested properties. | New | System resources | csapi/filters.ts | Implement | filters.system-observedProperty.spec.ts |
| `/req/advanced-filtering/system-by-controlprop` | "`controlledProperty` MUST be supported to filter systems by controlled property." | 23-001 §16.5 | System resources endpoints MUST support `controlledProperty=ID_List` and return only systems (including via subsystems) that control the requested properties. | New | System resources | csapi/filters.ts | Implement | filters.system-controlledProperty.spec.ts |
| `/req/advanced-filtering/deployment-by-parent` | "`parent` MUST be supported to filter deployments by parent deployment." | 23-001 §16.6.2 | Deployment resources endpoints MUST support `parent=ID_List` and return only deployments whose parent deployment matches one of the IDs. | New | Deployment resources | csapi/filters.ts | Implement | filters.deployment-parent.spec.ts |
| `/req/advanced-filtering/deployment-by-system` | "`system` MUST be supported to filter deployments by deployed system." | 23-001 §16.6.3 | Deployment resources endpoints MUST support `system=ID_List` and return only deployments during which one or more of the specified systems are deployed. | New | Deployment resources | csapi/filters.ts | Implement | filters.deployment-system.spec.ts |
| `/req/advanced-filtering/deployment-by-foi` | "`foi` MUST be supported to filter deployments by feature of interest." | 23-001 §16.6.4 | Deployment resources endpoints MUST support `foi=ID_List` and return only deployments that relate to the specified features of interest. | New | Deployment resources | csapi/filters.ts | Implement | filters.deployment-foi.spec.ts |
| `/req/advanced-filtering/deployment-by-obsprop` | "`observedProperty` MUST be supported to filter deployments by observed property." | 23-001 §16.6.5 | Deployment resources endpoints MUST support `observedProperty=ID_List` and return only deployments associated with observations of the specified properties. | New | Deployment resources | csapi/filters.ts | Implement | filters.deployment-observedProperty.spec.ts |
| `/req/advanced-filtering/deployment-by-controlprop` | "`controlledProperty` MUST be supported to filter deployments by controlled property." | 23-001 §16.6.6 | Deployment resources endpoints MUST support `controlledProperty=ID_List` and return only deployments associated with control of the specified properties. | New | Deployment resources | csapi/filters.ts | Implement | filters.deployment-controlledProperty.spec.ts |
| `/req/advanced-filtering/procedure-by-obsprop` | "`observedProperty` MUST be supported to filter procedures by observed property." | 23-001 §16.7 | Procedure resources endpoints MUST support `observedProperty=ID_List` and return only procedures used to observe the specified properties. | New | Procedure resources | csapi/filters.ts | Implement | filters.procedure-observedProperty.spec.ts |
| `/req/advanced-filtering/procedure-by-controlprop` | "`controlledProperty` MUST be supported to filter procedures by controlled property." | 23-001 §16.7 | Procedure resources endpoints MUST support `controlledProperty=ID_List` and return only procedures used to control the specified properties. | New | Procedure resources | csapi/filters.ts | Implement | filters.procedure-controlledProperty.spec.ts |
| `/req/advanced-filtering/sf-by-foi` | "`foi` MUST be supported to filter sampling features by the feature of interest." | 23-001 §16.8 | Sampling Feature resources endpoints MUST support `foi=ID_List` and return only sampling features associated with the specified features of interest. | New | Sampling Feature resources | csapi/filters.ts | Implement | filters.sf-foi.spec.ts |
| `/req/advanced-filtering/sf-by-obsprop` | "`observedProperty` MUST be supported to filter sampling features by observed property." | 23-001 §16.8 | Sampling Feature resources endpoints MUST support `observedProperty=ID_List` and return only sampling features associated with observations of the specified properties. | New | Sampling Feature resources | csapi/filters.ts | Implement | filters.sf-observedProperty.spec.ts |
| `/req/advanced-filtering/sf-by-controlprop` | "`controlledProperty` MUST be supported to filter sampling features by controlled property." | 23-001 §16.8 | Sampling Feature resources endpoints MUST support `controlledProperty=ID_List` and return only sampling features associated with control of the specified properties. | New | Sampling Feature resources | csapi/filters.ts | Implement | filters.sf-controlledProperty.spec.ts |
| `/req/advanced-filtering/prop-by-baseprop` | "`baseProperty` MUST be supported to filter property definitions by base property." | 23-001 §16.9 | Property Definition resources endpoints MUST support `baseProperty=ID_List` and return only property definitions derived from the specified base properties. | New | Property Definitions | csapi/filters.ts | Implement | filters.property-baseProperty.spec.ts |
| `/req/advanced-filtering/prop-by-object` | "`objectType` MUST be supported to filter property definitions by object type." | 23-001 §16.9 | Property Definition resources endpoints MUST support `objectType=ID_List` and return only property definitions whose object type matches one of the requested values. | New | Property Definitions | csapi/filters.ts | Implement | filters.property-objectType.spec.ts |
| `/req/advanced-filtering/combined-filters` | "If a server supports multiple filters, it SHALL combine them using logical AND." | 23-001 §16.10 | When multiple filter parameters are provided in a request, the server MUST combine them with logical AND semantics (a resource must satisfy all supplied filters to be included). | New | All resource endpoints | csapi/filters.ts | Implement | filters.combined.spec.ts |



### B8. GeoJSON Representation

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/geojson/mediatype-read` | "The server SHALL support the `application/geo+json` media type for read operations." | 23-001 §19.1 | Servers implementing CSAPI MUST support `Accept: application/geo+json` on feature resources endpoints and return GeoJSON representations when requested. | Inherited | GeoJSON Features | csapi/fixtures.ts, csapi/model.ts | Implement | geojson.mediatype-read.spec.ts |
| `/req/geojson/relation-types` | "Link relation types SHALL follow the association names defined in this Standard." | 23-001 §19.1 | Link relations in GeoJSON (`links` arrays) MUST use relation type names consistent with CSAPI association names (e.g. `system`, `deployment`, `samplingFeatures`, `properties`). | New | Associations | csapi/model.ts | Implement | geojson.relation-types.spec.ts |
| `/req/geojson/feature-attribute-mapping` | "CSAPI feature attributes SHALL be encoded in GeoJSON `properties` according to the schema." | 23-001 §19.1 | All CSAPI feature attributes (uid, name, description, validTime, etc.) MUST be encoded in the GeoJSON `properties` object following the resource-specific schema definitions. | Specialized | Feature schemas | csapi/model.ts | Implement | geojson.attribute-mapping.spec.ts |
| `/req/geojson/system-schema` | "System GeoJSON SHALL conform to the System feature schema." | 23-001 §19.2 | System resources encoded as GeoJSON MUST include required attributes (uid, name, description, validTime, location) and associations in `links`, conforming to the System schema defined by CSAPI Part 1. | Specialized | System Features | csapi/model.ts | Implement | geojson.system-schema.spec.ts |
| `/req/geojson/system-mappings` | "System attributes SHALL be mapped to GeoJSON fields as defined in the mapping table." | 23-001 §19.2 | System attributes (identifier, validTime, associations) MUST be mapped to specific GeoJSON properties and link relations exactly as defined in the System mapping table of Part 1. | Specialized | System Features | csapi/model.ts | Implement | geojson.system-mappings.spec.ts |
| `/req/geojson/deployment-schema` | "Deployment GeoJSON SHALL conform to the Deployment feature schema." | 23-001 §19.2 | Deployment resources encoded as GeoJSON MUST include required attributes (uid, name, description, validTime) and associations in `links`, conforming to the Deployment schema defined by CSAPI Part 1. | Specialized | Deployment Features | csapi/model.ts | Implement | geojson.deployment-schema.spec.ts |
| `/req/geojson/deployment-mappings` | "Deployment attributes SHALL be mapped to GeoJSON fields as defined in the mapping table." | 23-001 §19.2 | Deployment attributes and associations MUST be mapped to the GeoJSON representation according to the Deployment mapping table in Part 1. | Specialized | Deployment Features | csapi/model.ts | Implement | geojson.deployment-mappings.spec.ts |
| `/req/geojson/procedure-schema` | "Procedure GeoJSON SHALL conform to the Procedure feature schema (no geometry)." | 23-001 §19.2 | Procedure resources encoded as GeoJSON MUST conform to the Procedure schema, including required attributes and associations, and MUST NOT include geometry. | Specialized | Procedure Features | csapi/model.ts | Implement | geojson.procedure-schema.spec.ts |
| `/req/geojson/procedure-mappings` | "Procedure attributes SHALL be mapped to GeoJSON fields as defined in the mapping table." | 23-001 §19.2 | Procedure attributes MUST be mapped into GeoJSON `properties` and `links` according to the Procedure mapping table in Part 1. | Specialized | Procedure Features | csapi/model.ts | Implement | geojson.procedure-mappings.spec.ts |
| `/req/geojson/sf-schema` | "Sampling Feature GeoJSON SHALL conform to the Sampling Feature schema." | 23-001 §19.2 | Sampling Feature resources encoded as GeoJSON MUST include geometry and required attributes, and conform to the Sampling Feature schema defined by CSAPI Part 1. | Specialized | Sampling Features | csapi/model.ts | Implement | geojson.sf-schema.spec.ts |
| `/req/geojson/sf-mappings` | "Sampling Feature attributes SHALL be mapped to GeoJSON fields as defined in the mapping table." | 23-001 §19.2 | Sampling Feature attributes and associations MUST be mapped into GeoJSON fields and links according to the Sampling Feature mapping table in Part 1. | Specialized | Sampling Features | csapi/model.ts | Implement | geojson.sf-mappings.spec.ts |

