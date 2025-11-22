import fs from 'fs';
import path from 'path';

export type CSAPIFixtureProfile = 'minimal' | 'advanced' | 'default';

function profileDir(profile: CSAPIFixtureProfile): string {
  switch (profile) {
    case 'minimal':
      return 'fixtures/ogc-api/csapi/minimal';
    case 'advanced':
      return 'fixtures/ogc-api/csapi/advanced';
    case 'default':
    default:
      return 'fixtures/ogc-api/csapi/sample-data-hub';
  }
}

export function loadFixture(profile: CSAPIFixtureProfile, name: string): any {
  const dir = profileDir(profile);
  const filePath = path.resolve(process.cwd(), `${dir}/${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`[CSAPI fixtures] Fixture not found for profile='${profile}': ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function loadFixtureEnv(name: string): any {
  const raw = (process.env.CSAPI_FIXTURE_PROFILE || 'default').toLowerCase();
  const profile: CSAPIFixtureProfile =
    raw === 'minimal' || raw === 'advanced' ? (raw as CSAPIFixtureProfile) : 'default';
  return loadFixture(profile, name);
}

const cache = new Map<string, any>();
export function cachedFixture(name: string): any {
  const key = `${process.env.CSAPI_FIXTURE_PROFILE || 'default'}:${name}`;
  if (!cache.has(key)) {
    cache.set(key, loadFixtureEnv(name));
  }
  return cache.get(key);
}
