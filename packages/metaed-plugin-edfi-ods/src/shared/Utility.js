// @flow
import R from 'ramda';

const descriptor: string = 'Descriptor';
const type: string = 'Type';

export function appendOverlapping(base: string, suffix: string): string {
  return R.compose(
    R.concat(base),
    R.drop(R.__, suffix),
    R.length,
    R.until(R.endsWith(R.__, base), R.init),
    R.take(R.min(base.length, suffix.length)),
  )(suffix);
}

export function normalizeSuffix(base: string, suffix: string) {
  return base.endsWith(suffix) ? base : base + suffix;
}

export function normalizeDescriptorSuffix(base: string) {
  return normalizeSuffix(base, descriptor);
}

export function normalizeEnumerationSuffix(base: string) {
  return normalizeSuffix(base, type);
}

export function prependWithContextToMetaEdName(metaEdName: string, withContext: string) {
  return withContext + metaEdName;
}

export function escapeSqlSingleQuote(string: string): string {
  return string.replace(/'/g, '\'\'');
}

