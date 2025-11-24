<!--
@license BSD-3-Clause
Copyright (c) 2024 OS4CSAPI contributors
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### OGC API - Connected Systems (CSAPI) Support

Complete implementation of OGC API - Connected Systems standard (Parts 1 & 2), enabling comprehensive access to sensor systems, observations, and related resources.

**Resources Implemented (12):**

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

**Client Code:**

- 18 source files in `src/ogc-api/csapi/`
- Resource-specific client classes for all 12 CSAPI resources
- Type definitions and interfaces (`model.ts`)
- URL construction utilities (`url_builder.ts`)
- Advanced filtering support (`advanced_filtering_helpers.ts`)
- Common helper functions (`helpers.ts`)

**Test Coverage:**

- 20 comprehensive test suites in `src/ogc-api/csapi/__tests__/`
- 568+ passing tests covering all resource endpoints
- Test coverage: 85% statements, 88% functions, 85% lines
- 100% coverage on 10 of 12 core resource files

**Fixtures:**

- 64 fixture files in `fixtures/ogc-api/csapi/`
- Comprehensive examples for all resource types
- Encoding examples (GeoJSON, SensorML, O&M, SWE)
- Sample data hub and conformance fixtures

**Documentation:**

- 23+ documentation files in `docs/csapi/`
- Test design matrices (v1.0, v2.3, v2.4)
- Architecture and integration documentation
- Audit reports and security findings
- Requirements registers

**Integration:**

- `hasConnectedSystemsApi` property on `OgcApiEndpoint`
- Conformance detection for CSAPI standards
- Support for Part 1 & Part 2 conformance classes

**Usage Example:**

```typescript
import {
  SystemsClient,
  DatastreamsClient,
  ObservationsClient,
} from '@camptocamp/ogc-client';

// Query systems
const systemsClient = new SystemsClient('https://your-csapi-server.com');
const systems = await systemsClient.list();

// Get datastreams
const datastreamsClient = new DatastreamsClient(
  'https://your-csapi-server.com'
);
const datastreams = await datastreamsClient.list();

// Retrieve observations
const observationsClient = new ObservationsClient(
  'https://your-csapi-server.com'
);
const observations = await observationsClient.list();
```

**References:**

- [Audit Summary](./docs/csapi/audits/AUDIT_SUMMARY.md)
- [Deliverables Audit](./docs/csapi/audits/CSAPI_Deliverables_Audit_2024-11-24.md)
- [Security Audit Findings](./docs/csapi/audits/SECURITY_AUDIT_FINDINGS.md)
- [Architecture Documentation](./docs/csapi/architecture/)
- [Test Documentation](./docs/csapi/_tests_/)

### Changed

- Updated `README.md` with CSAPI documentation and examples
- Extended `OgcApiEndpoint` with Connected Systems API detection

### Technical Details

- **Total CSAPI Files:** 126
- **Tests Passing:** 100% (0 skipped in CSAPI modules)
- **Code Quality:** No TODO/FIXME comments, clean implementation
- **TypeScript:** Full type safety with comprehensive interfaces
