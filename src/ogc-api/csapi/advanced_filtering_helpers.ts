/**
 * Advanced Filtering Helpers (B7)
 * Profile-aware fixture loading (minimal | advanced | default).
 * Geometry filtering remains a placeholder.
 */
import { loadFixtureEnv } from './fixture_loader';

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

function extractArray<T=any>(raw: any, pluralKey: string): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.features)) return raw.features;
  if (Array.isArray(raw.members)) return raw.members;
  if (raw[pluralKey] && Array.isArray(raw[pluralKey])) return raw[pluralKey];
  for (const v of Object.values(raw)) { if (Array.isArray(v)) return v as T[]; }
  return [];
}

function mapSystems(arr: any[]): System[] {
  return arr.map(f => ({
    id: f.id,
    name: f.properties?.name,
    parentId: f.properties?.parentId,
    procedureIds: f.properties?.procedureIds,
    foiIds: f.properties?.foiIds,
    observedProperties: f.properties?.observedProperties,
    controlledProperties: f.properties?.controlledProperties
  })).filter(s => !!s.id);
}
function mapDeployments(arr: any[]): Deployment[] {
  return arr.map(f => ({
    id: f.id,
    parentId: f.properties?.parentId,
    systemIds: f.properties?.systemIds,
    foiIds: f.properties?.foiIds,
    observedProperties: f.properties?.observedProperties,
    controlledProperties: f.properties?.controlledProperties
  })).filter(d => !!d.id);
}
function mapProcedures(arr: any[]): Procedure[] {
  return arr.map(f => ({
    id: f.id,
    observedProperties: f.properties?.observedProperties,
    controlledProperties: f.properties?.controlledProperties
  })).filter(p => !!p.id);
}
function mapSamplingFeatures(arr: any[]): SamplingFeature[] {
  return arr.map(f => ({
    id: f.id,
    foiIds: f.properties?.foiIds,
    observedProperties: f.properties?.observedProperties,
    controlledProperties: f.properties?.controlledProperties
  })).filter(sf => !!sf.id);
}
function mapPropertyDefs(arr: any[]): PropertyDef[] {
  return arr.map(f => ({
    id: f.id,
    baseProperty: f.baseProperty || f.properties?.baseProperty,
    objectTypes: f.objectTypes || f.properties?.objectTypes
  })).filter(pd => !!pd.id);
}

const systemsRaw = loadFixtureEnv('systems');
const deploymentsRaw = loadFixtureEnv('deployments');
const proceduresRaw = loadFixtureEnv('procedures');
const samplingFeaturesRaw = loadFixtureEnv('samplingFeatures');
const propertiesRaw = loadFixtureEnv('properties');

export const systems = mapSystems(extractArray(systemsRaw, 'systems'));
export const deployments = mapDeployments(extractArray(deploymentsRaw, 'deployments'));
export const procedures = mapProcedures(extractArray(proceduresRaw, 'procedures'));
export const samplingFeatures = mapSamplingFeatures(extractArray(samplingFeaturesRaw, 'samplingFeatures'));
export const propertyDefs = mapPropertyDefs(extractArray(propertiesRaw, 'propertyDefs'));

type IdList = string[] | undefined;
function matchId(id: string, patterns: IdList): boolean {
  if (!patterns || patterns.length === 0) return true;
  return patterns.some(p => p.endsWith('*') ? id.startsWith(p.slice(0, -1)) : id === p);
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
  id?: string[]; parent?: string[]; procedure?: string[]; foi?: string[];
  observedProperty?: string[]; controlledProperty?: string[]; q?: string;
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
  id?: string[]; parent?: string[]; system?: string[]; foi?: string[];
  observedProperty?: string[]; controlledProperty?: string[];
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
  id?: string[]; observedProperty?: string[]; controlledProperty?: string[];
}): Procedure[] {
  return procedures.filter(pr =>
    matchId(pr.id, p.id) &&
    matchList(pr.observedProperties, p.observedProperty) &&
    matchList(pr.controlledProperties, p.controlledProperty)
  );
}

export function filterSamplingFeatures(p: {
  id?: string[]; foi?: string[]; observedProperty?: string[]; controlledProperty?: string[];
}): SamplingFeature[] {
  return samplingFeatures.filter(sf =>
    matchId(sf.id, p.id) &&
    matchList(sf.foiIds, p.foi) &&
    matchList(sf.observedProperties, p.observedProperty) &&
    matchList(sf.controlledProperties, p.controlledProperty)
  );
}

export function filterPropertyDefs(p: {
  id?: string[]; baseProperty?: string[]; objectType?: string[];
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
