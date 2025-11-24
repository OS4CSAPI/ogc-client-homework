import fs from 'fs';
import path from 'path';

/**
 * Legacy type maintained for backward compatibility.
 * All profiles now resolve to the unified 'examples' directory.
 * @deprecated Profile-based loading is no longer used. All fixtures load from examples/.
 */
export type CSAPIFixtureProfile = 'minimal' | 'advanced' | 'default' | 'examples';

/**
 * Returns the unified examples directory path.
 * Profile parameter is ignored - all fixtures now load from the examples suite.
 * @param _profile - Ignored, maintained for backward compatibility
 * @returns Path to unified examples directory
 */
function profileDir(_profile: CSAPIFixtureProfile): string {
  // All profiles now resolve to the unified examples directory
  return 'fixtures/ogc-api/csapi/examples';
}

/**
 * Loads a fixture from the unified examples directory.
 * @param profile - Ignored, maintained for backward compatibility
 * @param name - Fixture name (without .json extension)
 * @returns Parsed fixture data
 */
export function loadFixture(profile: CSAPIFixtureProfile, name: string): any {
  const dir = profileDir(profile);
  const filePath = path.resolve(process.cwd(), `${dir}/${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[CSAPI fixtures] Fixture not found: ${filePath}`
    );
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Loads a fixture using environment variable (legacy compatibility).
 * Environment variable CSAPI_FIXTURE_PROFILE is now ignored.
 * All fixtures load from the unified examples directory.
 * @param name - Fixture name (without .json extension)
 * @returns Parsed fixture data
 */
export function loadFixtureEnv(name: string): any {
  // Ignore environment variable - always use examples
  return loadFixture('default', name);
}

const cache = new Map<string, any>();
/**
 * Loads and caches a fixture from the unified examples directory.
 * @param name - Fixture name (without .json extension)
 * @returns Cached fixture data
 */
export function cachedFixture(name: string): any {
  const key = `examples:${name}`;
  if (!cache.has(key)) {
    cache.set(key, loadFixtureEnv(name));
  }
  return cache.get(key);
}
