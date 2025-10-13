# CSAPI Test Design Matrix v1.0
Author: Sam Bolling · Date: 2025-10-13


This matrix lists *all* requirements (Inherited, Specialized, New) and their corresponding Jest test plans.
- **Inherited**: verified by existing OGC API Features tests (no new stub generated).
- **Specialized / New**: include a Jest stub snippet for implementation.

## Matrix

| Ref ID | Requirement Class | Inheritance Type | Test File Name | Test Case Goal | Code Target(s) | Initial Status |
|:--|:--|:--|:--|:--|:--|:--|
| /req/core/root-op | Core | Inherited | `spec/ogc-api/core.landing.spec.ts` | Landing page GET at `/`. | src/ogc-api/endpoint.ts | ✅ Existing |
| /req/core/root-success | Core | Inherited | `core.landing.links.spec.ts` | Landing page content and links. | endpoint.ts, info.ts | ✅ Existing |
| /req/collections/* | Collections | Inherited | `collections.behavior.spec.ts` | Collections behavior and query params. | link-utils.ts, endpoint.ts | ✅ Existing |
| /req/items/* | Items | Inherited | `items.single.spec.ts` | Single feature resource access. | existing Feature item fetch | ✅ Existing |
| part1/overview | Part 1 §7 | Specialized | `csapi/models.part1.spec.ts` | Systems/Deployments/Procedures/SamplingFeatures are Features; Property is non-feature. | csapi/model.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// part1/overview — Systems/Deployments/Procedures/SamplingFeatures are Features; Property is non-feature.
test("Systems/Deployments/Procedures/SamplingFeatures are Features; Property is non-feature.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| part1/collections-meta | Part 1 §7.5 | Specialized | `csapi/collections.meta.spec.ts` | Reuse Features rules; add featureType. | info.ts, model.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// part1/collections-meta — Reuse Features rules; add featureType.
test("Reuse Features rules; add featureType.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system/canonical-url | Systems | Specialized | `systems.canonical-url.spec.ts` | Canonical item URL pattern. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system/canonical-url — Canonical item URL pattern.
test("Canonical item URL pattern.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system/resources-endpoint | Systems | Specialized | `systems.endpoint.spec.ts` | Systems listing follows Features collection rules. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system/resources-endpoint — Systems listing follows Features collection rules.
test("Systems listing follows Features collection rules.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system/canonical-endpoint | Systems | Specialized | `systems.canonical.spec.ts` | Top-level Systems collection required. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system/canonical-endpoint — Top-level Systems collection required.
test("Top-level Systems collection required.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system/collections | Systems | Specialized | `systems.collections.spec.ts` | Collections grouping & semantics. | info.ts, helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system/collections — Collections grouping & semantics.
test("Collections grouping & semantics.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/deployment/canonical-url | Deployments | Specialized | `deployments.canonical-url.spec.ts` | Canonical item URL. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/deployment/canonical-url — Canonical item URL.
test("Canonical item URL.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/deployment/resources-endpoint | Deployments | Specialized | `deployments.endpoint.spec.ts` | Listing/filtering rules. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/deployment/resources-endpoint — Listing/filtering rules.
test("Listing/filtering rules.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/deployment/canonical-endpoint | Deployments | Specialized | `deployments.canonical.spec.ts` | Canonical resources endpoint. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/deployment/canonical-endpoint — Canonical resources endpoint.
test("Canonical resources endpoint.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/deployment/collections | Deployments | Specialized | `deployments.collections.spec.ts` | Collections semantics. | info.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/deployment/collections — Collections semantics.
test("Collections semantics.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/procedure/canonical-url | Procedures | Specialized | `procedures.canonical-url.spec.ts` | Canonical URL. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/procedure/canonical-url — Canonical URL.
test("Canonical URL.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/procedure/resources-endpoint | Procedures | Specialized | `procedures.endpoint.spec.ts` | Listing behavior. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/procedure/resources-endpoint — Listing behavior.
test("Listing behavior.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/procedure/canonical-endpoint | Procedures | Specialized | `procedures.canonical.spec.ts` | Top-level endpoint. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/procedure/canonical-endpoint — Top-level endpoint.
test("Top-level endpoint.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/procedure/collections | Procedures | Specialized | `procedures.collections.spec.ts` | Collections semantics. | info.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/procedure/collections — Collections semantics.
test("Collections semantics.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/sf/canonical-url | SamplingFeatures | Specialized | `sf.canonical-url.spec.ts` | Canonical URL. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/sf/canonical-url — Canonical URL.
test("Canonical URL.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/sf/resources-endpoint | SamplingFeatures | Specialized | `sf.endpoint.spec.ts` | Listing/filtering. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/sf/resources-endpoint — Listing/filtering.
test("Listing/filtering.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/sf/canonical-endpoint | SamplingFeatures | Specialized | `sf.canonical.spec.ts` | Canonical endpoint. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/sf/canonical-endpoint — Canonical endpoint.
test("Canonical endpoint.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/sf/collections | SamplingFeatures | Specialized | `sf.collections.spec.ts` | Collections semantics. | info.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/sf/collections — Collections semantics.
test("Collections semantics.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/property/canonical-url | Property Definitions | Specialized | `properties.canonical-url.spec.ts` | Canonical URL (non-feature). | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/property/canonical-url — Canonical URL (non-feature).
test("Canonical URL (non-feature).", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/property/resources-endpoint | Property Definitions | Specialized | `properties.endpoint.spec.ts` | Resource collection (non-feature). | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/property/resources-endpoint — Resource collection (non-feature).
test("Resource collection (non-feature).", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/property/canonical-endpoint | Property Definitions | Specialized | `properties.canonical.spec.ts` | Canonical endpoint. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/property/canonical-endpoint — Canonical endpoint.
test("Canonical endpoint.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/api-common/resources | Common (Part 2) | Specialized | `common.resources.spec.ts` | Apply Features semantics to non-features. | endpoint.ts adapters | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/api-common/resources — Apply Features semantics to non-features.
test("Apply Features semantics to non-features.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/api-common/resource-collection | Common (Part 2) | Specialized | `common.collections.spec.ts` | Collections like Features with itemType. | helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/api-common/resource-collection — Collections like Features with itemType.
test("Collections like Features with itemType.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/datastream/canonical-url | Datastreams | New | `datastreams.canonical-url.spec.ts` | Canonical resource URL. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/datastream/canonical-url — Canonical resource URL.
test("Canonical resource URL.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/datastream/resources-endpoint | Datastreams | New | `datastreams.endpoint.spec.ts` | List/filter datastreams. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/datastream/resources-endpoint — List/filter datastreams.
test("List/filter datastreams.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/datastream/canonical-endpoint | Datastreams | New | `datastreams.canonical.spec.ts` | Canonical resources endpoint. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/datastream/canonical-endpoint — Canonical resources endpoint.
test("Canonical resources endpoint.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/datastream/ref-from-system | Datastreams | New | `datastreams.bySystem.spec.ts` | By System. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/datastream/ref-from-system — By System.
test("By System.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/datastream/ref-from-deployment | Datastreams | New | `datastreams.byDeployment.spec.ts` | By Deployment. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/datastream/ref-from-deployment — By Deployment.
test("By Deployment.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/datastream/collections | Datastreams | New | `datastreams.collections.spec.ts` | Collections semantics. | info.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/datastream/collections — Collections semantics.
test("Collections semantics.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/datastream/schema-op | Datastreams | New | `datastreams.schema.spec.ts` | Observation schema negotiation. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/datastream/schema-op — Observation schema negotiation.
test("Observation schema negotiation.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/observation/canonical-url | Observations | New | `observations.canonical-url.spec.ts` | Observation canonical URL. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/observation/canonical-url — Observation canonical URL.
test("Observation canonical URL.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/observation/resources-endpoint | Observations | New | `observations.endpoint.spec.ts` | List/filter observations. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/observation/resources-endpoint — List/filter observations.
test("List/filter observations.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/observation/canonical-endpoint | Observations | New | `observations.canonical.spec.ts` | Canonical Observations endpoint. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/observation/canonical-endpoint — Canonical Observations endpoint.
test("Canonical Observations endpoint.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/observation/ref-from-datastream | Observations | New | `observations.byStream.spec.ts` | By DataStream. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/observation/ref-from-datastream — By DataStream.
test("By DataStream.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/observation/collections | Observations | New | `observations.collections.spec.ts` | Obs collections. | info.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/observation/collections — Obs collections.
test("Obs collections.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/controlstream/canonical-url | ControlStreams | New | `controlstreams.canonical-url.spec.ts` | Canonical URL. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/controlstream/canonical-url — Canonical URL.
test("Canonical URL.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/controlstream/resources-endpoint | ControlStreams | New | `controlstreams.endpoint.spec.ts` | List/filter control streams. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/controlstream/resources-endpoint — List/filter control streams.
test("List/filter control streams.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/command/canonical-url | Commands | New | `commands.canonical-url.spec.ts` | Canonical URL. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/command/canonical-url — Canonical URL.
test("Canonical URL.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/command/resources-endpoint | Commands | New | `commands.endpoint.spec.ts` | List/filter commands. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/command/resources-endpoint — List/filter commands.
test("List/filter commands.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/command/status-result | Commands | New | `commands.status-result.spec.ts` | Separate status/result resources. | csapi/model.ts, parsers | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/command/status-result — Separate status/result resources.
test("Separate status/result resources.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/feasibility/canonical-url | Feasibility | New | `feasibility.canonical-url.spec.ts` | Canonical URL. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/feasibility/canonical-url — Canonical URL.
test("Canonical URL.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/feasibility/resources-endpoint | Feasibility | New | `feasibility.endpoint.spec.ts` | List/filter feasibility. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/feasibility/resources-endpoint — List/filter feasibility.
test("List/filter feasibility.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/feasibility/status-result | Feasibility | New | `feasibility.status-result.spec.ts` | Separate lifecycle resources. | csapi/model.ts, parsers | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/feasibility/status-result — Separate lifecycle resources.
test("Separate lifecycle resources.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system-event/canonical-url | System Events | New | `events.canonical-url.spec.ts` | Canonical URL & rel=canonical. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system-event/canonical-url — Canonical URL & rel=canonical.
test("Canonical URL & rel=canonical.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system-event/resources-endpoint | System Events | New | `events.endpoint.spec.ts` | List/filter events. | csapi/helpers.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system-event/resources-endpoint — List/filter events.
test("List/filter events.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system-event/canonical-endpoint | System Events | New | `events.canonical.spec.ts` | Canonical resources endpoint. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system-event/canonical-endpoint — Canonical resources endpoint.
test("Canonical resources endpoint.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system-event/ref-from-system | System Events | New | `events.bySystem.spec.ts` | Events by System. | csapi/url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system-event/ref-from-system — Events by System.
test("Events by System.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| /req/system-event/collections | System Events | New | `events.collections.spec.ts` | Collections semantics. | info.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// /req/system-event/collections — Collections semantics.
test("Collections semantics.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| part1/encodings | Encodings Part 1 | Specialized | `encodings.part1.spec.ts` | Feature encodings and schemas. | encoding.ts, model.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// part1/encodings — Feature encodings and schemas.
test("Feature encodings and schemas.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| part2/encodings | Encodings Part 2 | New | `encodings.part2.spec.ts` | Dynamic data encodings. | encoding.ts, parsers | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// part2/encodings — Dynamic data encodings.
test("Dynamic data encodings.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
| part2/canonical-endpoints | Canonical endpoints list | New | `endpoints.part2.canonical.spec.ts` | Well-known top-level routes. | url_builder.ts | ❌ To implement |

```ts
import { client } from "../../../src/ogc-api/client";

// part2/canonical-endpoints — Well-known top-level routes.
test("Well-known top-level routes.", async () => {
  // TODO: implement using csapi helpers/url_builder/model
  // const api = client("{api root URL}");
  // const result = await api.request(/* build URL with url_builder and params */);
  // expect(result).toBeDefined();
});
```
