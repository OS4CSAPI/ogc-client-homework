![Upstream Contribution](https://img.shields.io/badge/contributing%20to-camptocamp%2Fogc--client-blue)

> ⚙️ This fork is actively developing support for the **OGC API - Connected Systems** standard, with the goal of contributing back to [camptocamp/ogc-client](https://github.com/camptocamp/ogc-client).

📋 [Implementation Plan](https://github.com/Sam-Bolling/ogc-client/blob/main/docs/connected-systems-plan.md)

# ogc-client [![Latest version on NPM](https://img.shields.io/npm/v/%40camptocamp%2Fogc-client)](https://www.npmjs.com/package/@camptocamp/ogc-client) [![Latest @dev version on NPM](https://img.shields.io/npm/v/%40camptocamp%2Fogc-client/dev)](https://www.npmjs.com/package/@camptocamp/ogc-client?activeTab=versions)

> A Typescript library for interacting with [OGC-compliant services](https://www.ogc.org/docs/is)

**ogc-client** is a Typescript library which implements several OGC standards and will help you interact with
them in a user-friendly and consistent way.

[Documentation and live demo here!](https://camptocamp.github.io/ogc-client/)

The following standards are partially implemented:

- WMS - _Web Map Service_
- WFS - _Web Feature Service_
- WMTS - _Web Map Tile Service_
- OGC API (Records and Features)
- OGC API - Connected Systems (CSAPI)
- TMS - _Tile Map Service_
- STAC API - _SpatioTemporal Asset Catalog_

## Why use it?

1. **ogc-client** will abstract the service version so you don't have to worry about it
2. **ogc-client** will handle XML so you only have to deal with native Javascript objects
3. **ogc-client** will hide the complexity of OGC standards behind straightforward APIs
4. **ogc-client** will run heavy tasks in a worker to avoid blocking the main thread
5. **ogc-client** will keep a persistent cache of operations to minimize requests and processing
6. **ogc-client** will tell you if a service is not usable for [CORS-related issues](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Instructions

To install **ogc-client**, run:

```bash
$ npm install --save @camptocamp/ogc-client
```

To use, import API symbols like so:

```js
import { WmsEndpoint, WfsEndpoint, StacEndpoint } from '@camptocamp/ogc-client';
```

Note: if you want to disable web worker usage, for example to solve issues with the `Referer` header on outgoing
requests, use:

```js
import { enableFallbackWithoutWorker } from '@camptocamp/ogc-client';

enableFallbackWithoutWorker();
```

All processing will be done on the main thread after this call, including HTTP requests.

### Use the latest development version

[The `@camptocamp/ogc-client` NPM package](https://www.npmjs.com/package/@camptocamp/ogc-client) is updated on every commit on the `main` branch under the `@dev` tag. To use it:

```bash
$ npm install --save @camptocamp/ogc-client@dev
```

### Application

A provided application containing the documentation and demo is located in the `app` folder.
To start it locally, clone the repository and run the following commands:

```bash
$ npm install
$ cd app
$ npm install
$ npm start
```

The app is based on [Vue.js](https://vuejs.org/) and will showcase most features implemented in the library.
You will need to supply it with valid OGC service urls.

## Quick Examples

### STAC API

See the [`examples/`](./examples/) directory for more complete examples, including:

- `examples/stac-query.js` - Full STAC API query example with spatial and temporal filters

Run examples with:

```bash
npm run build
node examples/stac-query.js
```

### OGC API - Connected Systems (CSAPI)

The library provides comprehensive support for the OGC API - Connected Systems standard (Parts 1 & 2), enabling access to sensor systems, observations, and related resources.

#### Quick Start

```typescript
import { SystemsClient, DatastreamsClient, ObservationsClient } from '@camptocamp/ogc-client';

// Create client instances
const systemsClient = new SystemsClient('https://your-csapi-endpoint.com');
const datastreamsClient = new DatastreamsClient('https://your-csapi-endpoint.com');

// List all systems
const systems = await systemsClient.list();
console.log(`Found ${systems.features.length} systems`);

// Get a specific system
const system = await systemsClient.get('system-id');
console.log(`System: ${system.properties.name}`);

// List datastreams
const datastreams = await datastreamsClient.list();

// Get observations
const observationsClient = new ObservationsClient('https://your-csapi-endpoint.com');
const observations = await observationsClient.list();
```

#### Supported Resources

The CSAPI implementation includes full support for all 12 resource types:

- **Systems** - Physical or logical entities that produce observations
- **Datastreams** - Time series of observations from a specific system
- **Observations** - Individual measurement or estimation results
- **Deployments** - Spatial and temporal placement of systems
- **Procedures** - Methods used to produce observations
- **Sampling Features** - Real-world features sampled by procedures
- **Properties** - Observable properties measured by systems
- **Commands** - Control commands that can be sent to systems
- **Control Streams** - Time series of commands sent to systems
- **System Events** - Significant events in a system's lifecycle
- **System History** - Historical states of a system
- **Feasibility** - Queries for checking system capabilities

#### Complete Example

For a full working example demonstrating all CSAPI features:

```bash
npm run build
node examples/csapi-query.js
```

See [`examples/csapi-query.js`](./examples/csapi-query.js) for detailed usage patterns.

#### Documentation

Comprehensive documentation is available:

- **[Test Matrices](./docs/csapi/_tests_/)** - Test design matrices for OGC conformance (v1.0, v2.3, v2.4)
- **[Audit Summary](./docs/csapi/audits/AUDIT_SUMMARY.md)** - Complete audit of implementation status and quality metrics
- **[Cleanup Checklist](./docs/csapi/audits/cleanup_checklist.md)** - Pre-submission checklist and action items
- **[Architecture Documentation](./docs/csapi/architecture/)** - Technical architecture and integration details
- **[Security Audit](./docs/csapi/audits/SECURITY_AUDIT_FINDINGS.md)** - Security review findings

#### Implementation Status

- ✅ All 12 CSAPI resource endpoints implemented
- ✅ 20 comprehensive test suites (568+ passing tests)
- ✅ Full support for OGC API - Connected Systems Part 1 & Part 2
- ✅ GeoJSON encoding support
- ✅ Advanced filtering capabilities
- ✅ Integrated with OgcApiEndpoint for conformance detection
