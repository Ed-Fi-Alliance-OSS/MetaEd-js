import R from 'ramda';
import semver from 'semver';
import { PluginEnvironment } from './plugin/PluginEnvironment';
import { SemVer, MetaEdEnvironment } from './MetaEdEnvironment';

export const nextMacroTask = (): Promise<void> => new Promise(resolve => setImmediate(resolve));

export function uppercaseThenAlphanumericOnly(aString: string): string | null {
  const alphanumericMatches: string[] | null = aString.match(/[a-zA-Z0-9]+/g);
  if (alphanumericMatches == null) return null;
  const alphanumericOnly = alphanumericMatches.join('');
  const leadingAlphaCharacter = /^[A-Z]/;
  if (!alphanumericOnly || !alphanumericOnly.match(leadingAlphaCharacter)) return null;
  return alphanumericOnly;
}

export function prependIndefiniteArticle(phrase: string): string {
  if (phrase == null || phrase === '') return '';
  const firstChar = phrase.charAt(0).toLowerCase();
  if ('aeiou'.includes(firstChar)) {
    return `an ${phrase}`;
  }
  return `a ${phrase}`;
}

export const orderByProp = (prop: string) =>
  R.sortBy(
    R.compose(
      R.toLower,
      R.prop(prop),
    ),
  );

export const orderByPath = (path: string[]) =>
  R.sortBy(
    R.compose(
      R.toLower,
      R.path(path),
    ),
  );

/**
 *
 */
export const V2Only: SemVer = '^2.x';
/**
 *
 */
export const V3OrGreater: SemVer = '>=3.0.0';
/**
 *
 */
export const V5OrGreater: SemVer = '>=5.0.0';

/**
 * https://github.com/npm/node-semver
 */
export const versionSatisfies = (version: SemVer, range: SemVer): boolean => {
  // we ignore prerelease suffixes, acting instead as if they were the released version
  const semverWithPrereleaseStripped = semver.coerce(version);
  if (semverWithPrereleaseStripped == null) return false;
  return semver.satisfies(semverWithPrereleaseStripped, range);
};

/**
 *
 */
export function normalizeSuffix(base: string, suffix: string) {
  return base.endsWith(suffix) ? base : base + suffix;
}

const descriptor = 'Descriptor';
const type = 'Type';

/**
 *
 */
export function normalizeDescriptorSuffix(base: string) {
  return normalizeSuffix(base, descriptor);
}

/**
 *
 */
export function normalizeEnumerationSuffix(base: string) {
  return normalizeSuffix(base, type);
}

/**
 * Determines if the Apache-2.0 license header should be applied in a template.
 */
export function shouldApplyLicenseHeader(metaEd: MetaEdEnvironment): Boolean {
  const { targetTechnologyVersion } = (metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment) ||
    (metaEd.plugin.get('edfiOdsSqlServer') as PluginEnvironment) ||
    (metaEd.plugin.get('edfiOdsPostgresql') as PluginEnvironment) || {
      targetTechnologyVersion: '2.0.0',
    };
  return metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');
}
