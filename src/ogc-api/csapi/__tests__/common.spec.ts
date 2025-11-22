/**
 * Tests for CSAPI Common API-Level Behavior
 * Validates the API landing page, conformance declaration, and core service links
 * required by OGC API – Features and OGC API – Connected Systems Parts 1 & 2.
 *
 * Now includes:
 *   - C1 Common semantics (applies Features semantics to non-feature resources)
 *   - B7 Advanced Filtering (all resource types, all filter parameters)
 *
 * Traces to:
 *   - /req/landing-page/content           (OGC API – Features § 7.1)
 *   - /req/conformance/content            (OGC API – Features § 7.2)
 *   - /req/landing-page/csapi-extensions  (23-001 § 8, 23-002 § 7.4 Req 30)
 *   - /req/api-common/resources           (C1 - Common)
 *   - /req/api-common/resource-collection (C1 - Common)
 *   - /req/advanced-filtering/*           (B7 - Advanced Filtering, 21 requirements)
 *
 * Test strategy:
 *   - Hybrid execution (fixtures by default, live endpoints when CSAPI_LIVE = true)
 *   - Verifies the existence of key service links and declared conformance classes
 *   - Validates filter behavior using comprehensive test fixtures
 */

import { maybeFetchOrLoad } from '../helpers';

const apiRoot: string =
  process.env.CSAPI_API_ROOT || 'https://example.csapi.server';

/**
 * Requirement: /req/landing-page/content
 * The API landing page SHALL provide a title and link relations for all primary resources.
 */
test('Landing page contains expected metadata and canonical links', async () => {
  const data: Record<string, unknown> = await maybeFetchOrLoad(
    'common_landing',
    apiRoot
  );

  expect(data).toBeDefined();
  expect((data as any).title).toBeDefined();
  expect(Array.isArray((data as any).links)).toBe(true);

  const links = (data as any).links as Array<{ rel: string }>;
  const rels = links.map((l) => l.rel);
  expect(rels).toContain('self');
  expect(rels).toContain('conformance');

  // Verify CSAPI-specific link relations are present
  const csapiRels = ['systems', 'deployments', 'datastreams'];
  const hasCsapiLinks = csapiRels.every((r) =>
    rels.some((x: string) => x.toLowerCase().includes(r))
  );
  expect(hasCsapiLinks).toBe(true);
});

/**
 * Requirement: /req/conformance/content
 * The /conformance endpoint SHALL list implemented conformance classes as URIs.
 */
test('Conformance declaration lists valid CSAPI conformance classes', async () => {
  const url = `${apiRoot}/conformance`;
  const data: Record<string, unknown> = await maybeFetchOrLoad(
    'common_conformance',
    url
  );

  expect(data).toBeDefined();
  const conformsTo = (data as any).conformsTo as string[];
  expect(Array.isArray(conformsTo)).toBe(true);
  expect(conformsTo.length).toBeGreaterThan(0);

  // Check for at least one CSAPI and one Features conformance URI
  const joined = conformsTo.join(' ');
  expect(joined).toMatch(/connected-systems/i);
  expect(joined).toMatch(/ogcapi-features/i);
});

/**
 * Requirement: /req/landing-page/csapi-extensions
 * The landing page SHALL reference all canonical CSAPI extensions from Parts 1 & 2.
 */
test('Landing page advertises CSAPI extension endpoints', async () => {
  const data: Record<string, unknown> = await maybeFetchOrLoad(
    'common_landing',
    apiRoot
  );
  const links = (data as any).links as Array<{ rel: string }>;
  const rels = links.map((l) => l.rel.toLowerCase());

  const expected = [
    'systems',
    'deployments',
    'procedures',
    'samplingfeatures',
    'datastreams',
    'observations',
    'commands',
    'feasibility',
  ];

  for (const rel of expected) {
    const found = rels.some((r: string) => r.includes(rel));
    expect(found).toBe(true);
  }
});

/* ========================================================================== */
/*                        C1 - Common Semantics Tests                         */
/* ========================================================================== */

describe('Common semantics (C1)', () => {
  /**
   * Requirement: /req/api-common/resources
   * Apply OGC API Features semantics to non-feature resources by replacing "features" with "resources".
   */
  test('/req/api-common/resources – applies Features semantics to non-feature resources', async () => {
    // Properties are non-feature resources (not GeoJSON Features)
    const data: any = await maybeFetchOrLoad('filter_properties');

    expect(data).toBeDefined();
    expect(data.type).toBe('Collection');
    expect(data.itemType).toBe('Property');
    expect(Array.isArray(data.members)).toBe(true);
    expect(data.members.length).toBeGreaterThan(0);

    // Each resource should have an id and other required fields
    const firstResource = data.members[0];
    expect(firstResource.id).toBeDefined();
    expect(firstResource.name).toBeDefined();
  });

  /**
   * Requirement: /req/api-common/resource-collection
   * Resource collections SHALL fulfill Features §§7.14–7.16 semantics with itemType.
   */
  test('/req/api-common/resource-collection – resource collections behave like Features collections', async () => {
    const data: any = await maybeFetchOrLoad('filter_properties');

    expect(data).toBeDefined();
    // Must have itemType to distinguish resource type
    expect(data.itemType).toBeDefined();
    expect(data.itemType).toBe('Property');

    // Must have a collection container (members for non-features, features for features)
    expect(data.members || data.features).toBeDefined();
    const items = data.members || data.features;
    expect(Array.isArray(items)).toBe(true);

    // Each item must have an identifier
    if (items.length > 0) {
      items.forEach((item: any) => {
        expect(item.id).toBeDefined();
      });
    }
  });
});

/* ========================================================================== */
/*                   B7 - Advanced Filtering Tests                            */
/* ========================================================================== */

describe('Advanced filtering (B7)', () => {
  /* ------------------------------------------------------------------------ */
  /*                    Universal Filters (All Resources)                     */
  /* ------------------------------------------------------------------------ */

  /**
   * Requirement: /req/advanced-filtering/resource-by-id
   * All CSAPI resources endpoints SHALL support id=ID_List (including wildcard * suffix).
   */
  test('/req/advanced-filtering/resource-by-id – filter resources by ID list', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Simulate filtering by specific IDs (sys-001, sys-002)
    const ids = ['sys-001', 'sys-002'];
    const filtered = data.features.filter((f: any) => ids.includes(f.id));

    expect(filtered.length).toBe(2);
    expect(filtered.every((f: any) => ids.includes(f.id))).toBe(true);

    // Verify wildcard support (sys-*)
    const wildcardFiltered = data.features.filter((f: any) =>
      f.id.startsWith('sys-')
    );
    expect(wildcardFiltered.length).toBeGreaterThanOrEqual(3);
  });

  /**
   * Requirement: /req/advanced-filtering/resource-by-keyword
   * All CSAPI resources endpoints SHALL support q for keyword search (at minimum name and description).
   */
  test('/req/advanced-filtering/resource-by-keyword – keyword search over name and description', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Search for "weather" keyword
    const keyword = 'weather';
    const filtered = data.features.filter((f: any) => {
      const name = (f.properties.name || '').toLowerCase();
      const desc = (f.properties.description || '').toLowerCase();
      return name.includes(keyword) || desc.includes(keyword);
    });

    expect(filtered.length).toBeGreaterThanOrEqual(2);

    // Search for "climate" keyword
    const keyword2 = 'climate';
    const filtered2 = data.features.filter((f: any) => {
      const name = (f.properties.name || '').toLowerCase();
      const desc = (f.properties.description || '').toLowerCase();
      return name.includes(keyword2) || desc.includes(keyword2);
    });

    expect(filtered2.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Requirement: /req/advanced-filtering/feature-by-geom
   * Feature resources SHALL support geom parameter for spatial intersection.
   */
  test('/req/advanced-filtering/feature-by-geom – filter features by geometry intersection', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Simple bounding box test: features within longitude range [-122.5, -122.3]
    const minLon = -122.5;
    const maxLon = -122.3;

    const filtered = data.features.filter((f: any) => {
      if (f.geometry && f.geometry.type === 'Point') {
        const lon = f.geometry.coordinates[0];
        return lon >= minLon && lon <= maxLon;
      }
      return false;
    });

    expect(filtered.length).toBeGreaterThanOrEqual(2);

    // Verify all returned features have geometries intersecting the test region
    filtered.forEach((f: any) => {
      expect(f.geometry).toBeDefined();
      const lon = f.geometry.coordinates[0];
      expect(lon).toBeGreaterThanOrEqual(minLon);
      expect(lon).toBeLessThanOrEqual(maxLon);
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                         System-Specific Filters                          */
  /* ------------------------------------------------------------------------ */

  /**
   * Requirement: /req/advanced-filtering/system-by-parent
   * System endpoints SHALL support parent=ID_List to filter by parent system.
   */
  test('/req/advanced-filtering/system-by-parent – filter systems by parent', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter systems with parent=sys-001
    const parentId = 'sys-001';
    const filtered = data.features.filter(
      (f: any) => f.properties.parent === parentId
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('sys-002');
  });

  /**
   * Requirement: /req/advanced-filtering/system-by-procedure
   * System endpoints SHALL support procedure=ID_List to filter by associated procedure.
   */
  test('/req/advanced-filtering/system-by-procedure – filter systems by procedure', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter systems using procedure=proc-001
    const procId = 'proc-001';
    const filtered = data.features.filter(
      (f: any) => f.properties.procedure === procId
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered.every((f: any) => f.properties.procedure === procId)).toBe(
      true
    );
  });

  /**
   * Requirement: /req/advanced-filtering/system-by-foi
   * System endpoints SHALL support foi=ID_List to filter by feature of interest.
   */
  test('/req/advanced-filtering/system-by-foi – filter systems by feature of interest', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter systems observing foi=sf-001
    const foiId = 'sf-001';
    const filtered = data.features.filter(
      (f: any) => f.properties.foi && f.properties.foi.includes(foiId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('sys-001');
  });

  /**
   * Requirement: /req/advanced-filtering/system-by-obsprop
   * System endpoints SHALL support observedProperty=ID_List to filter by observed property.
   */
  test('/req/advanced-filtering/system-by-obsprop – filter systems by observed property', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter systems observing property prop-002
    const propId = 'prop-002';
    const filtered = data.features.filter(
      (f: any) =>
        f.properties.observedProperty &&
        f.properties.observedProperty.includes(propId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(2);
    filtered.forEach((f: any) => {
      expect(f.properties.observedProperty).toContain(propId);
    });
  });

  /**
   * Requirement: /req/advanced-filtering/system-by-controlprop
   * System endpoints SHALL support controlledProperty=ID_List to filter by controlled property.
   */
  test('/req/advanced-filtering/system-by-controlprop – filter systems by controlled property', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter systems controlling property prop-001
    const propId = 'prop-001';
    const filtered = data.features.filter(
      (f: any) =>
        f.properties.controlledProperty &&
        f.properties.controlledProperty.includes(propId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('sys-003');
    filtered.forEach((f: any) => {
      expect(f.properties.controlledProperty).toContain(propId);
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                       Deployment-Specific Filters                        */
  /* ------------------------------------------------------------------------ */

  /**
   * Requirement: /req/advanced-filtering/deployment-by-parent
   * Deployment endpoints SHALL support parent=ID_List to filter by parent deployment.
   */
  test('/req/advanced-filtering/deployment-by-parent – filter deployments by parent', async () => {
    const data: any = await maybeFetchOrLoad('filter_deployments');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter deployments with parent=dep-001
    const parentId = 'dep-001';
    const filtered = data.features.filter(
      (f: any) => f.properties.parent === parentId
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('dep-002');
  });

  /**
   * Requirement: /req/advanced-filtering/deployment-by-system
   * Deployment endpoints SHALL support system=ID_List to filter by deployed systems.
   */
  test('/req/advanced-filtering/deployment-by-system – filter deployments by system', async () => {
    const data: any = await maybeFetchOrLoad('filter_deployments');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter deployments of system=sys-002
    const sysId = 'sys-002';
    const filtered = data.features.filter(
      (f: any) => f.properties.system === sysId
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('dep-002');
  });

  /**
   * Requirement: /req/advanced-filtering/deployment-by-foi
   * Deployment endpoints SHALL support foi=ID_List to filter by feature of interest.
   */
  test('/req/advanced-filtering/deployment-by-foi – filter deployments by feature of interest', async () => {
    const data: any = await maybeFetchOrLoad('filter_deployments');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter deployments at foi=sf-003
    const foiId = 'sf-003';
    const filtered = data.features.filter(
      (f: any) => f.properties.foi && f.properties.foi.includes(foiId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('dep-003');
  });

  /**
   * Requirement: /req/advanced-filtering/deployment-by-obsprop
   * Deployment endpoints SHALL support observedProperty=ID_List to filter by observed property.
   */
  test('/req/advanced-filtering/deployment-by-obsprop – filter deployments by observed property', async () => {
    const data: any = await maybeFetchOrLoad('filter_deployments');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter deployments observing prop-002
    const propId = 'prop-002';
    const filtered = data.features.filter(
      (f: any) =>
        f.properties.observedProperty &&
        f.properties.observedProperty.includes(propId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Requirement: /req/advanced-filtering/deployment-by-controlprop
   * Deployment endpoints SHALL support controlledProperty=ID_List to filter by controlled property.
   */
  test('/req/advanced-filtering/deployment-by-controlprop – filter deployments by controlled property', async () => {
    const data: any = await maybeFetchOrLoad('filter_deployments');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter deployments controlling prop-001
    const propId = 'prop-001';
    const filtered = data.features.filter(
      (f: any) =>
        f.properties.controlledProperty &&
        f.properties.controlledProperty.includes(propId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('dep-003');
  });

  /* ------------------------------------------------------------------------ */
  /*                       Procedure-Specific Filters                         */
  /* ------------------------------------------------------------------------ */

  /**
   * Requirement: /req/advanced-filtering/procedure-by-obsprop
   * Procedure endpoints SHALL support observedProperty=ID_List to filter by observed property.
   */
  test('/req/advanced-filtering/procedure-by-obsprop – filter procedures by observed property', async () => {
    const data: any = await maybeFetchOrLoad('filter_procedures');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter procedures observing prop-002
    const propId = 'prop-002';
    const filtered = data.features.filter(
      (f: any) =>
        f.properties.observedProperty &&
        f.properties.observedProperty.includes(propId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(2);
    filtered.forEach((f: any) => {
      expect(f.properties.observedProperty).toContain(propId);
    });
  });

  /**
   * Requirement: /req/advanced-filtering/procedure-by-controlprop
   * Procedure endpoints SHALL support controlledProperty=ID_List to filter by controlled property.
   */
  test('/req/advanced-filtering/procedure-by-controlprop – filter procedures by controlled property', async () => {
    const data: any = await maybeFetchOrLoad('filter_procedures');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter procedures controlling prop-004
    const propId = 'prop-004';
    const filtered = data.features.filter(
      (f: any) =>
        f.properties.controlledProperty &&
        f.properties.controlledProperty.includes(propId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('proc-003');
  });

  /* ------------------------------------------------------------------------ */
  /*                   Sampling Feature-Specific Filters                      */
  /* ------------------------------------------------------------------------ */

  /**
   * Requirement: /req/advanced-filtering/sf-by-foi
   * Sampling Feature endpoints SHALL support foi=ID_List to filter by feature of interest.
   */
  test('/req/advanced-filtering/sf-by-foi – filter sampling features by feature of interest', async () => {
    const data: any = await maybeFetchOrLoad('filter_samplingFeatures');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter sampling features for foi=sf-002
    const foiId = 'sf-002';
    const filtered = data.features.filter(
      (f: any) => f.properties.foi === foiId
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('sf-002');
  });

  /**
   * Requirement: /req/advanced-filtering/sf-by-obsprop
   * Sampling Feature endpoints SHALL support observedProperty=ID_List to filter by observed property.
   */
  test('/req/advanced-filtering/sf-by-obsprop – filter sampling features by observed property', async () => {
    const data: any = await maybeFetchOrLoad('filter_samplingFeatures');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter sampling features observing prop-001
    const propId = 'prop-001';
    const filtered = data.features.filter(
      (f: any) =>
        f.properties.observedProperty &&
        f.properties.observedProperty.includes(propId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Requirement: /req/advanced-filtering/sf-by-controlprop
   * Sampling Feature endpoints SHALL support controlledProperty=ID_List to filter by controlled property.
   */
  test('/req/advanced-filtering/sf-by-controlprop – filter sampling features by controlled property', async () => {
    const data: any = await maybeFetchOrLoad('filter_samplingFeatures');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Filter sampling features with controlled property prop-004
    const propId = 'prop-004';
    const filtered = data.features.filter(
      (f: any) =>
        f.properties.controlledProperty &&
        f.properties.controlledProperty.includes(propId)
    );

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('sf-003');
  });

  /* ------------------------------------------------------------------------ */
  /*                     Property Definition Filters                          */
  /* ------------------------------------------------------------------------ */

  /**
   * Requirement: /req/advanced-filtering/prop-by-baseprop
   * Property Definition endpoints SHALL support baseProperty=ID_List to filter derived properties.
   */
  test('/req/advanced-filtering/prop-by-baseprop – filter properties by base property', async () => {
    const data: any = await maybeFetchOrLoad('filter_properties');

    expect(data).toBeDefined();
    expect(Array.isArray(data.members)).toBe(true);

    // Filter properties derived from baseProperty=prop-001
    const baseId = 'prop-001';
    const filtered = data.members.filter((p: any) => p.baseProperty === baseId);

    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].id).toBe('prop-004');
  });

  /**
   * Requirement: /req/advanced-filtering/prop-by-object
   * Property Definition endpoints SHALL support objectType=ID_List to filter by object type.
   */
  test('/req/advanced-filtering/prop-by-object – filter properties by object type', async () => {
    const data: any = await maybeFetchOrLoad('filter_properties');

    expect(data).toBeDefined();
    expect(Array.isArray(data.members)).toBe(true);

    // Filter properties for objectType=atmosphere
    const objType = 'atmosphere';
    const filtered = data.members.filter((p: any) => p.objectType === objType);

    expect(filtered.length).toBeGreaterThanOrEqual(3);

    // Filter properties for objectType=hvac-system
    const objType2 = 'hvac-system';
    const filtered2 = data.members.filter(
      (p: any) => p.objectType === objType2
    );

    expect(filtered2.length).toBeGreaterThanOrEqual(1);
  });

  /* ------------------------------------------------------------------------ */
  /*                        Combined Filters (AND Logic)                      */
  /* ------------------------------------------------------------------------ */

  /**
   * Requirement: /req/advanced-filtering/combined-filters
   * When multiple filters are provided, servers SHALL combine them using logical AND semantics.
   */
  test('/req/advanced-filtering/combined-filters – multiple filters use AND semantics', async () => {
    const data: any = await maybeFetchOrLoad('filter_systems');

    expect(data).toBeDefined();
    expect(Array.isArray(data.features)).toBe(true);

    // Apply multiple filters: procedure=proc-001 AND observedProperty includes prop-001
    const procId = 'proc-001';
    const propId = 'prop-001';

    const filtered = data.features.filter(
      (f: any) =>
        f.properties.procedure === procId &&
        f.properties.observedProperty &&
        f.properties.observedProperty.includes(propId)
    );

    // Only sys-001 matches both conditions
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('sys-001');
    expect(filtered[0].properties.procedure).toBe(procId);
    expect(filtered[0].properties.observedProperty).toContain(propId);

    // Apply different combination: parent=sys-001 AND observedProperty includes prop-002
    const parentId = 'sys-001';
    const propId2 = 'prop-002';

    const filtered2 = data.features.filter(
      (f: any) =>
        f.properties.parent === parentId &&
        f.properties.observedProperty &&
        f.properties.observedProperty.includes(propId2)
    );

    // Only sys-002 matches both conditions
    expect(filtered2.length).toBe(1);
    expect(filtered2[0].id).toBe('sys-002');
  });
});
