/**
 * Advanced Filtering Helpers (B7)
 * Provides pure in-memory filtering over existing fixture data.
 * Geometry filtering remains a placeholder until spatial logic is added.
 */
import systemsData from '../../../fixtures/ogc-api/csapi/sample-data-hub/systems.json';
import deploymentsData from '../../../fixtures/ogc-api/csapi/sample-data-hub/deployments.json';
import proceduresData from '../../../fixtures/ogc-api/csapi/sample-data-hub/procedures.json';
import samplingFeaturesData from '../../../fixtures/ogc-api/csapi/sample-data-hub/samplingFeatures.json';
import propertiesData from '../../../fixtures/ogc-api/csapi/sample-data-hub/properties.json';

export interface System {
  id: string;
  name?: string;
  parentId?: string;
  procedureIds?: string[];
  foiIds?: string[];
  observedProperties?: string[];
  controlledProperties?: string[];
}

export interface Deployment {
  id: string;
  parentId?: string;
  systemIds?: string[];
  foiIds?: string[];
  observedProperties?: string[];
  controlledProperties?: string[];
}

export interface Procedure {
  id: string;
  observedProperties?: string[];
  controlledProperties?: string[];
}

export interface SamplingFeature {
  id: string;
  foiIds?: string[];
  observedProperties?: string[];
  controlledProperties?: string[];
}

export interface PropertyDef {
  id: string;
  baseProperty?: string;
  objectTypes?: string[];
}

/**
 * normalize: Accepts JSON that may be:
 * - A bare array
 * - An object with a known plural key (e.g. systems, deployments)
 * - An object with a default property containing the array (ESM interop)
 * - An object with any first array-valued property
 */
function normalize<T = any>(raw: any, pluralKey: string): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw?.default && Array.isArray(raw.default)) return raw.default as T[];
  if (raw && Array.isArray(raw[pluralKey])) return raw[pluralKey] as T[];
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw)) {
      if (Array.isArray(v)) return v as T[];
    }
  }
  // eslint-disable-next-line no-console
  console.warn(
    `[advanced-filtering] Normalization produced empty array for key '${pluralKey}'. Raw keys: ${
      raw && typeof raw === 'object' ? Object.keys(raw).join(',') : typeof raw
    }`
  );
  return [] as T[];
}

export const systems: System[] = normalize<System>(systemsData, 'systems');
export const deployments: Deployment[] = normalize<Deployment>(deploymentsData, 'deployments');
export const procedures: Procedure[] = normalize<Procedure>(proceduresData, 'procedures');
export const samplingFeatures: SamplingFeature[] = normalize<SamplingFeature>(samplingFeaturesData, 'samplingFeatures');
export const propertyDefs: PropertyDef[] = normalize<PropertyDef>(propertiesData, 'properties');

type IdList = string[] | undefined;

function matchId(id: string, patterns: IdList): boolean {
  if (!patterns || patterns.length === 0) return true;
  return patterns.some(p => (p.endsWith('*') ? id.startsWith(p.slice(0, -1)) : id === p));
}

function matchList(values: string[] | undefined, required: string[] | undefined): boolean {
  if (!required || required.length === 0) return true;
  if (!values) return false;
  return required.every(r => values.includes(r));
}

function matchSingle(value: string | undefined, required: string[] | undefined): boolean {
  if (!required || required.length === 0) return true;
  if (!value) return false;
  return required.includes(value);
}

function matchKeyword(name: string | undefined, q: string | undefined): boolean {
  if (!q) return true;
  if (!name) return false;
  return name.toLowerCase().includes(q.toLowerCase());
}

export function filterSystems(p: {
  id?: string[];
  parent?: string[];
  procedure?: string[];
  foi?: string[];
  observedProperty?: string[];
  controlledProperty?: string[];
  q?: string;
}): System[] {
  return systems.filter(s =>
    matchId(s.id, p.id) &&
    matchSingle(s.parentId, p.parent) &&
    matchList(s.procedureIds, p.procedure) &&
    matchList(s.foiIds, p.foi) &&
    matchList(s.observedProperties, p.observedProperty) &&
    matchList(s.controlledProperties, p.controlledProperty) &&
    matchKeyword(s.name, p.q)
  );
}

export function filterDeployments(p: {
  id?: string[];
  parent?: string[];
  system?: string[];
  foi?: string[];
  observedProperty?: string[];
  controlledProperty?: string[];
}): Deployment[] {
  return deployments.filter(d =>
    matchId(d.id, p.id) &&
    matchSingle(d.parentId, p.parent) &&
    matchList(d.systemIds, p.system) &&
    matchList(d.foiIds, p.foi) &&
    matchList(d.observedProperties, p.observedProperty) &&
    matchList(d.controlledProperties, p.controlledProperty)
  );
}

export function filterProcedures(p: {
  id?: string[];
  observedProperty?: string[];
  controlledProperty?: string[];
}): Procedure[] {
  return procedures.filter(pr =>
    matchId(pr.id, p.id) &&
    matchList(pr.observedProperties, p.observedProperty) &&
    matchList(pr.controlledProperties, p.controlledProperty)
  );
}

export function filterSamplingFeatures(p: {
  id?: string[];
  foi?: string[];
  observedProperty?: string[];
  controlledProperty?: string[];
}): SamplingFeature[] {
  return samplingFeatures.filter(sf =>
    matchId(sf.id, p.id) &&
    matchList(sf.foiIds, p.foi) &&
    matchList(sf.observedProperties, p.observedProperty) &&
    matchList(sf.controlledProperties, p.controlledProperty)
  );
}

export function filterPropertyDefs(p: {
  id?: string[];
  baseProperty?: string[];
  objectType?: string[];
}): PropertyDef[] {
  return propertyDefs.filter(pd =>
    matchId(pd.id, p.id) &&
    matchSingle(pd.baseProperty, p.baseProperty) &&
    matchList(pd.objectTypes, p.objectType)
  );
}

export function intersection<T extends { id: string }>(a: T[], b: T[]): T[] {
  const ids = new Set(b.map(x => x.id));
  return a.filter(x => ids.has(x.id));
}

export function geometryFilterPlaceholder<T>(items: T[], _geom?: string): T[] {
  return items;
}