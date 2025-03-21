// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import semver from 'semver';
import type { MetaEdEnvironment, SemVer } from './MetaEdEnvironment';
import type { PluginEnvironment } from './plugin/PluginEnvironment';

export const nextMacroTask = async (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

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

export const orderByProp = (prop: string) => R.sortBy(R.compose(R.toLower, R.prop(prop)));

export const orderByPath = (path: string[]) => R.sortBy(R.compose(R.toLower, R.path(path)));

/**
 *
 */
export const V3OrGreater: SemVer = '>=3.0.0';
/**
 *
 */
export const V5OrGreater: SemVer = '>=5.3.0';

/**
 *
 */
export const V6OrGreater: SemVer = '>=6.1.0';

/**
 *
 */
export const V7OrGreater: SemVer = '>=7.1.0';

/**
 * https://github.com/npm/node-semver
 */
export const versionSatisfies = (version: SemVer, range: SemVer): boolean => {
  // we ignore prerelease suffixes, acting instead as if they were the released version
  const semverWithPrereleaseStripped = semver.coerce(version);
  if (semverWithPrereleaseStripped == null) return false;
  return semver.satisfies(semverWithPrereleaseStripped, range);
};

export function formatVersionWithSuppressPrereleaseVersion(dataStandardVersion: SemVer, suppressPrereleaseVersion: boolean) {
  if (suppressPrereleaseVersion) {
    if (!semver.valid(dataStandardVersion)) return dataStandardVersion;
    const semverified = semver.parse(dataStandardVersion);
    if (semverified == null) return '';
    const major: string = semverified.major < 10 ? `${semverified.major}` : `${semverified.major}`;
    const minor = `${semverified.minor}`;
    const patch = '0';
    return `${major}.${minor}.${patch}`;
  }
  return dataStandardVersion;
}
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

export function targetTechnologyVersionFor(pluginShortName: string, metaEd: MetaEdEnvironment) {
  return (metaEd.plugin.get(pluginShortName) as PluginEnvironment).targetTechnologyVersion;
}

export function decapitalize(str: string): string {
  if (str.length === 0) return str;
  if (str.length === 1) return str.toLowerCase();
  return str[0].toLowerCase() + str.slice(1);
}
