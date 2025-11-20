# OGC Client – CSAPI Requirements Register v2.3
Author: Sam Bolling · Date: 2025-11-19


> Purpose: Map every normative requirement relevant to a CSAPI client to clear implementation targets and tests, preserving traceability to the standards.
> Legend (Inheritance Type): Inherited = satisfied by existing OGC API Features client; Specialized = Features semantics adapted to CS resources; New = CSAPI-specific.
> Quoting note: Verbatim snippets are abridged (≤25 words) with citations stored in project docs.

## A) Imported Requirements — OGC API Features Part 1 (Core) (used by CSAPI)

| Ref ID (Features) | Requirement Class | Normative Statement (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|---|
| `/req/core/root-op` | Core | “Server SHALL support HTTP GET at path /.” | 17-069r4 §7.2 | Landing page GET at `/`. | Inherited | CS-1 §7; CS-2 §8 | src/ogc-api/endpoint.ts | Verify | spec/ogc-api/core.landing.spec.ts |
| `/req/core/root-success` | Core | “200 response… include links to API definition, /conformance, /collections.” | 17-069r4 §7.2 | Landing page content and links. | Inherited | CS-1 §7.5; CS-2 §7.4 | endpoint.ts, info.ts | Verify | core.landing.links.spec.ts |
| `/req/core/conformance-op` | Core | “Server SHALL support HTTP GET at path /conformance and return its conformance classes.” | 17-069r4 §7.3 | GET `/conformance` returns a 200 response containing the list of conformance classes implemented by the API. | Inherited | CS-1 §7; CS-2 §8 | src/ogc-api/endpoint.ts | Verify | spec/ogc-api/core.conformance.spec.ts |
| `/req/collections/*` | Collections | Paging (`limit`), `bbox`, `datetime`, items at `/collections/{id}/items`. | 17-069r4 §7.14–7.16 | Collections behavior and query params. | Inherited | CS-1 §7.5; CS-2 §8.3 | link-utils.ts, endpoint.ts | Verify | collections.behavior.spec.ts |
| `/req/items/*` | Items | GET single item at `/collections/{collectionId}/items/{resourceId}`. | 17-069r4 §7.14–7.16 | Single feature resource access using the CSAPI Part 1 path template (`collectionId`, `resourceId`). | Inherited | CS-1 classes | existing Feature item fetch | Verify | items.single.spec.ts |

## B) CSAPI Part 1 — Feature Resources (Systems, Deployments, Procedures, SamplingFeatures, Property Definitions)

### B1. Common overview & collections

| Ref ID (CSAPI) | Requirement Class | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|---|
| `part1/overview` (meta) | Part 1 §7 | “All resources in Part 1 are feature types, except Property Definition.” | 23-001 §7.3/Table 1 | Meta requirement derived from 23-001: Systems, Deployments, Procedures, Sampling Features are Features; Property is non-feature. Not a named `/req/...` anchor in YAML. | Specialized | Features Core | csapi/model.ts | Align models | csapi/models.part1.spec.ts |
| `part1/collections-meta` (meta) | Part 1 §7.5 | “Feature collections… governed by OGC API — Features Part 1… indicate `itemType`, `featureType`.” | 23-001 §7.5 | Meta requirement capturing that CS collections reuse Features collection rules and add `itemType`/`featureType`; not a named `/req/...` anchor in YAML. | Specialized | 17-069r4 §7.14–7.16 | info.ts, model.ts | Extend parser | csapi/collections.meta.spec.ts |

### B2. Systems

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/system/canonical-url` | “Canonical URL {api_root}/systems/{id}.” | 23-001 §9.3 | Canonical item URL pattern `{api_root}/systems/{id}`; in the Part 1 OpenAPI definition this identifier is exposed as the `{systemId}` path parameter. | Specialized | Features Items | csapi/url_builder.ts | Implement | systems.canonical-url.spec.ts |
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
| `/req/deployment/ref-from-system` | "For each System, expose `{api_root}/systems/{sysId}/deployments`; `deployments` link points to it." | 23-001 §11 | For each System resource, the server SHALL expose a nested Deployment resources endpoint at `/systems/{systemId}/deployments`
 listing only that System’s Deployments, and the System’s `deployments` association SHALL be represented as a link to this endpoint (`sysId` corresponds to the System’s identifier, exposed as `{systemId}` in the OpenAPI paths). | Specialized | System & Deployment Features | csapi/url_builder.ts, csapi/model.ts | Implement | deployments.from-system.spec.ts |
| `/req/subdeployment/collection` | "Subdeployments are Deployment resources made available as a sub-collection of a parent deployment." | 23-001 §12 | For each Deployment, the server SHALL expose subdeployment resources as a sub-collection (e.g. `/deployments/{deploymentId}/subdeployments`) containing only Deployment resources whose parent is the identified deployment. | New | Deployment Features | csapi/url_builder.ts, csapi/model.ts | Implement | subdeployments.collection.spec.ts |
| `/req/subdeployment/recursive-param` | "The server SHALL support a `recursive` query parameter on subdeployment sub-collections." | 23-001 §12 | Deployment/subdeployment sub-collection endpoints SHALL support an optional boolean `recursive` query parameter in the query string to control whether only direct subdeployments or the entire hierarchy is returned. | New | Deployment Features | csapi/filters.ts | Implement | subdeployments.recursive-param.spec.ts |
| `/req/subdeployment/recursive-search-deployments` | "Recursive search SHALL include deployments reachable via nested subdeployment relationships." | 23-001 §12 | When `recursive=true` is applied to deployment resources queries, the server SHALL include all Deployment resources reachable via nested subdeployment relationships, not only direct children. | New | Deployment Features | csapi/filters.ts | Implement | subdeployments.recursive-deployments.spec.ts |
| `/req/subdeployment/recursive-search-subdeployments` | "Recursive search SHALL include all nested subdeployments." | 23-001 §12 | When `recursive=true` is applied to subdeployment sub-collections, the server SHALL include all subdeployments reachable through the deployment hierarchy, not only immediate subdeployments. | New | Deployment Features | csapi/filters.ts | Implement | subdeployments.recursive-subdeployments.spec.ts |
| `/req/subdeployment/recursive-assoc` | "Recursive traversal SHALL enumerate deployment–subdeployment associations recursively." | 23-001 §12 | When recursive traversal is requested for deployments/subdeployments, the server SHALL enumerate associations between deployments and their subdeployments recursively, not limiting associations to direct parent–child relationships. | New | Deployment Features | csapi/model.ts | Implement | subdeployments.recursive-assoc.spec.ts |

### B4. Procedures

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/procedure/location` | "A Procedure feature resource SHALL NOT include a location or geometry." | 23-001 §13 | Procedure feature resources are non-spatial and SHALL NOT include a location or geometry. In GeoJSON encodings, Procedures SHALL omit `geometry` or set it to `null`. | New | Procedure Features | csapi/model.ts | Implement | procedures.location.spec.ts |
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
| `/req/sf/ref-from-system` | "For each System, expose `{api_root}/systems/{sysId}/samplingFeatures`; `samplingFeatures` link points to it." | 23-001 §14 | For each System resource, the server SHALL expose a nested Sampling Feature resources endpoint at `/systems/{systemId}/samplingFeatures` listing only that System’s Sampling Features, and the System’s `samplingFeatures` association SHALL be represented as a link to this endpoint. In the Part 1 OpenAPI, this identifier is exposed as the `{systemId}` path parameter. | Specialized | System Features | csapi/url_builder.ts, csapi/model.ts | Implement | sf.from-system.spec.ts |
| `/req/sf/collections` | “Feature collection featureType SamplingFeature; items behave as endpoint.” | 23-001 §14 | Collections semantics. | Specialized | 17-069r4 | info.ts | Map | sf.collections.spec.ts |

### B6. Property Definitions (non-feature)

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/property/canonical-url` | “Canonical URL {api_root}/properties/{id}.” | 23-001 §15 | Canonical URL (non-feature). | Specialized | Part 1 §7.3 | csapi/url_builder.ts | Implement | properties.canonical-url.spec.ts |
| `/req/property/resources-endpoint` | “GET supports listing; non-feature semantics.” | 23-001 §15 | Resource collection (non-feature). | Specialized | 17-069r4 adapted | csapi/helpers.ts | Implement | properties.endpoint.spec.ts |
| `/req/property/canonical-endpoint` | “Expose {api_root}/properties.” | 23-001 §15 | Canonical endpoint. | Specialized | — | csapi/url_builder.ts | Implement | properties.canonical.spec.ts |

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
| `/req/geojson/mediatype-write` | "The server SHALL support the `application/geo+json` media type for write operations." | 23-001 §19.1 (Req 78) | When the server also implements the Create/Replace/Delete requirements class, it MUST accept `Content-Type: application/geo+json` for write operations and parse the body according to the resource type. Tracked here for completeness; write operations are out of scope for the read-only CSAPI client. | Inherited | GeoJSON Features / OGC API – Features Part 4 | — | Out of scope (write operations) | — |
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

## C) CSAPI Part 2 — Dynamic Data (non-feature resources)

### C1. Common

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/api-common/resources` | “Replace ‘features’ with ‘resources’ when interpreting Features Parts 1 & 4.” | 23-002 §8.2–8.3 | Apply Features semantics to non-feature resources. | Specialized | 17-069r4 | endpoint.ts adapters | Implement | common.resources.spec.ts |
| `/req/api-common/resource-collection` | “Resource collection SHALL fulfill Features §§7.14–7.16.” | 23-002 §8.3 | Collections act like Features Collections with `itemType`. | Specialized | 17-069r4 | helpers.ts | Implement | common.collections.spec.ts |

### C2. DataStreams

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/datastream/canonical-url` | Core | “A DataStream SHALL be accessible at `{api_root}/datastreams/{datastreamId}`.” | 23-002 §9.2 | Canonical URL pattern for a DataStream resource. | New | — | csapi/url_builder.ts | Implement | datastreams.canonical-url.spec.ts |
| `/req/datastream/resources-endpoint` | Core | “A GET on `/datastreams` SHALL return a 200 response and support `limit` and `datetime` parameters.” | 23-002 §9.4 | DataStream collection SHALL support listing and filtering using Features-style parameters. | New | 17-069r4 §7.15 | csapi/helpers.ts | Implement | datastreams.endpoint.spec.ts |
| `/req/datastream/canonical-endpoint` | Core | “The API SHALL expose a DataStreams collection at `{api_root}/datastreams`.” | 23-002 §7.4 | Defines the top-level DataStreams resources endpoint. | New | — | csapi/url_builder.ts | Implement | datastreams.canonical.spec.ts |
| `/req/datastream/ref-from-system` | Association | “A System SHALL expose its DataStreams at `/systems/{systemId}/datastreams`.” | 23-002 §9.3 | Nested endpoint listing only DataStreams belonging to the given System. | New | — | csapi/url_builder.ts | Implement | datastreams.bySystem.spec.ts |
| `/req/datastream/ref-from-deployment` | Association | “A Deployment SHALL expose its DataStreams at `/deployments/{deploymentId}/datastreams`.” | 23-002 §9.3 | Nested endpoint listing DataStreams belonging to a Deployment. | New | — | csapi/url_builder.ts | Implement | datastreams.byDeployment.spec.ts |
| `/req/datastream/collections` | Collections | “A DataStreams collection SHALL declare `itemType=DataStream` and behave as a standard resources collection.” | 23-002 §8.3, §9 | Defines collection metadata and collection semantics for DataStreams. | New | — | info.ts | Map | datastreams.collections.spec.ts |
| `/req/datastream/schema-op` | Operation | “A GET on `/datastreams/{datastreamId}/schema` with `obsFormat` SHALL return the matching Observation schema.” | 23-002 §9.5 | Operation returning the appropriate Observation schema for a DataStream. | New | SWE-3 | csapi/helpers.ts | Implement | datastreams.schema.spec.ts |

### C3. Observations

| `/req/observation/canonical-url` | Core | “An Observation SHALL be accessible at `{api_root}/observations/{observationId}`.” | 23-002 §9.6 | Defines the canonical URL pattern for an Observation resource. | New | — | csapi/url_builder.ts | Implement | observations.canonical-url.spec.ts |
| `/req/observation/resources-endpoint` | Core | “A GET on `/observations` SHALL return a 200 response and support `limit` and `datetime`.” | 23-002 §9.7 | Observation collections SHALL support listing and filtering using Features-style parameters. | New | 17-069r4 §7.15 | csapi/helpers.ts | Implement | observations.endpoint.spec.ts |
| `/req/observation/canonical-endpoint` | Core | “The API SHALL expose an Observations collection at `{api_root}/observations`.” | 23-002 §7.4 | Defines the top-level Observations resources endpoint. | New | — | csapi/url_builder.ts | Implement | observations.canonical.spec.ts |
| `/req/observation/ref-from-datastream` | Association | “A DataStream SHALL expose its Observations at `/datastreams/{datastreamId}/observations`.” | 23-002 §9.8 | Nested endpoint listing Observations belonging to the given DataStream. | New | — | csapi/url_builder.ts | Implement | observations.byStream.spec.ts |
| `/req/observation/collections` | Collections | “An Observations collection SHALL declare `itemType=Observation` and behave as a standard resources collection.” | 23-002 §8.3, §9.7 | Defines metadata and behavior of Observation collections. | New | — | info.ts | Map | observations.collections.spec.ts |

### C4. ControlStreams

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/controlstream/canonical-url` | Core | “A ControlStream SHALL be accessible at `{api_root}/controlstreams/{controlStreamId}`.” | 23-002 §10.2 | Defines the canonical URL pattern for a ControlStream resource. | New | — | csapi/url_builder.ts | Implement | controlstreams.canonical-url.spec.ts |
| `/req/controlstream/resources-endpoint` | Core | “A GET on `/controlstreams` SHALL return 200 and support `limit` and `datetime` parameters.” | 23-002 §10.3 | ControlStream collections SHALL support listing and filtering using Features-style parameters. | New | 17-069r4 §7.15 | csapi/helpers.ts | Implement | controlstreams.endpoint.spec.ts |
| `/req/controlstream/ref-from-system` | Association | “A System SHALL expose its ControlStreams at `/systems/{systemId}/controlstreams`.” | 23-002 §10.4 | Nested endpoint listing only ControlStreams associated with the given System. | New | System → ControlStream linkage | csapi/url_builder.ts | Implement | controlstreams.bySystem.spec.ts |
| `/req/controlstream/schema-op` | Operation | “A GET on `/controlstreams/{controlStreamId}/schema` SHALL return the Command schema advertised for that ControlStream.” | 23-002 §10.5 | Defines the schema negotiation operation for a ControlStream. | New | ControlStream schema operation | csapi/helpers.ts | Implement | controlstreams.schema.spec.ts |
| `/req/controlstream/collections` | Collections | “A ControlStreams collection SHALL declare `itemType=ControlStream` and behave as a standard resources collection.” | 23-002 §8.3, §10.3 | Defines metadata and behavior of ControlStream collections. | New | — | info.ts | Map | controlstreams.collections.spec.ts |

### C5. Commands
| `/req/command/canonical-url` | Core | “A Command SHALL be accessible at `{api_root}/commands/{commandId}`.” | 23-002 §10.6 | Defines the canonical URL pattern for a Command resource. | New | — | csapi/url_builder.ts | Implement | commands.canonical-url.spec.ts |
| `/req/command/resources-endpoint` | Core | “A GET on `/commands` SHALL return 200 and support `limit` and `datetime` parameters.” | 23-002 §10.7 | Command collections SHALL support listing and filtering using Features-style parameters. | New | 17-069r4 §7.15 | csapi/helpers.ts | Implement | commands.endpoint.spec.ts |
| `/req/command/ref-from-controlstream` | Association | “A ControlStream SHALL expose its Commands at `/controlstreams/{controlStreamId}/commands`.” | 23-002 §10.10 | Nested endpoint listing Commands associated with the given ControlStream. | New | ControlStream → Command linkage | csapi/url_builder.ts | Implement | commands.byControlStream.spec.ts |
| `/req/command/collections` | Collections | “A Commands collection SHALL declare `itemType=Command` and behave as a standard resources collection.” | 23-002 §8.3, §10.7 | Defines metadata and behavior of Command collections. | New | — | info.ts | Map | commands.collections.spec.ts |

### C6. Feasibility

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/feasibility/canonical-url` | Core | “A Feasibility resource SHALL be accessible at `{api_root}/feasibility/{feasibilityId}`.” | 23-002 §11 | Defines the canonical URL pattern for a Feasibility resource. | New | — | csapi/url_builder.ts | Implement | feasibility.canonical-url.spec.ts |
| `/req/feasibility/resources-endpoint` | Core | “A GET on `/feasibility` SHALL return a 200 response and support `limit` and `datetime` parameters.” | 23-002 §11 | Feasibility collections SHALL support listing and filtering using Features-style collection parameters. | New | 17-069r4 §7.15 | csapi/helpers.ts | Implement | feasibility.endpoint.spec.ts |

### C7. Status & Result Resources
| `/req/command/status` | Lifecycle | “The CommandStatus resource SHALL report the execution status of a Command.” | 23-002 §10.8 | Defines the status resource for tracking Command execution state. | New | — | csapi/model.ts, parsers | Implement | command.status.spec.ts |
| `/req/command/result` | Lifecycle | “The CommandResult resource SHALL report the outcome of a completed Command.” | 23-002 §10.9 | Defines the result resource for completed Commands. | New | — | csapi/model.ts, parsers | Implement | command.result.spec.ts |
| `/req/feasibility/result` | Lifecycle | “The FeasibilityResult resource SHALL report the outcome of a Feasibility request.” | 23-002 §11 | Defines the result resource returned once a Feasibility request has been evaluated. | New | — | csapi/model.ts, parsers | Implement | feasibility.result.spec.ts |

### C8. System Events

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/system-event/canonical-url` | Core | “A SystemEvent SHALL be accessible at `{api_root}/systemEvents/{eventId}` and link to its canonical URL.” | 23-002 §12.3–12.4 (Req40) | Defines the canonical URL pattern for a SystemEvent resource and requires a rel=canonical link when accessed via any other URL. | New | — | csapi/url_builder.ts | Implement | events.canonical-url.spec.ts |
| `/req/system-event/resources-endpoint` | Core | “A GET at the SystemEvent resources endpoint SHALL return 200 and support `limit` and `datetime`.” | 23-002 §12.4 (Req41) | SystemEvent collections SHALL support listing and filtering using Features-style collection parameters. | New | 17-069r4 §7.15 | csapi/helpers.ts | Implement | events.endpoint.spec.ts |
| `/req/system-event/canonical-endpoint` | Core | “The API SHALL expose a SystemEvent resources endpoint at `{api_root}/systemEvents`.” | 23-002 §12.4.2 (Req42) | Defines the canonical SystemEvent resources endpoint exposing all SystemEvents. | New | — | csapi/url_builder.ts | Implement | events.canonical.spec.ts |
| `/req/system-event/ref-from-system` | Association | “A System SHALL expose its SystemEvents at `/systems/{systemId}/events`.” | 23-002 §12.4 (Req43) | Nested endpoint `/systems/{systemId}/events` listing SystemEvents related to the System. | New | — | csapi/url_builder.ts | Implement | events.bySystem.spec.ts |
| `/req/system-event/collections` | Collections | “A SystemEvents collection SHALL declare `itemType=SystemEvent` and behave as a standard resources collection.” | 23-002 §8.3, §12.4 (Req44) | Defines metadata and behavior of SystemEvent collections, including itemType and collection semantics. | New | — | info.ts | Map | events.collections.spec.ts |

### C9. System History

| Ref ID | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Referenced From | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|---|
| `/req/system-history/resources-endpoint` | Core | “The server SHALL expose a history resources endpoint at `/systems/{systemId}/history` listing revisions of that System.” | 23-002 §12 (System history) | Defines the nested System history endpoint that lists the available historical versions of a System. | New | System → History linkage | csapi/helpers.ts | Implement | history.endpoint.spec.ts |
| `/req/system-history/canonical-url` | Core | “Each System history revision SHALL be accessible at `{api_root}/systems/{systemId}/history/{revisionId}`.” | 23-002 §12 (System history) | Defines the canonical URL pattern for individual System history revision resources. | New | System → History canonical URL | csapi/url_builder.ts | Implement | history.canonical-url.spec.ts |

### C10. Dynamic Data Encodings

*(Summarizes Part 2 dynamic data encodings. Normative rows appear in Section D.)*

### C11. Associations (Summary of Nested Endpoints)

*(Summarizes all nested endpoint relationships for Datastreams, Observations, ControlStreams,
Commands, Feasibility, SystemEvents, and SystemHistory. No new normative requirements.)*

### C12. Canonical Endpoints (Summary)

*(Summarizes all canonical endpoints required by Part 2. Requirements already defined in C2–C9.)*

## D) Encodings

| Topic | Verbatim (abridged) | Source Citation | Plain Summary | Inheritance Type | Implementation Target | Status / Action | Test Placeholder |
|---|---|---|---|---|---|---|---|
| Part 1 encodings (meta) | “Clause 19; GeoJSON, SML-JSON profiles.” | 23-001 §19 | Meta umbrella over the concrete `/req/geojson/*` requirements: summarizes Part 1 feature encodings and schemas (GeoJSON, SML-JSON). Not a named `/req/...` anchor. | Specialized | encoding.ts, model.ts | Map profiles | encodings.part1.spec.ts |
| Part 2 encodings | “Dynamic data resources SHALL support one or more encodings defined in the Part 2 encoding requirement classes (JSON, SWE-JSON, SWE-Text, SWE-Binary).” | 23-002 Table 1, §16 | Summarizes that Observations, Commands, ControlStreams, CommandStatus, CommandResult, FeasibilityResult, and SystemEvent resources are encoded using the JSON and SWE-based encodings defined in Part 2. | New | encoding.ts, parsers | Implement | encodings.part2.spec.ts |
| Canonical endpoints list | “/datastreams, /observations, /controlstreams, /commands, /feasibility, /systemEvents.” | 23-002 §7.4 | Well-known top-level routes. | New | url_builder.ts | Implement | endpoints.part2.canonical.spec.ts |

