import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a SemVer, which is a semantic version string.
 * See https://semver.org/spec/v2.0.0.html
 */

export type SemVer = BrandType<string, 'SemVer'>;
