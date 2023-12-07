import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a ProjectNamespace, which is the URI path component referring to a ProjectSchema
 * e.g. "ed-fi" for an Ed-Fi data standard version.
 */

export type ProjectNamespace = BrandType<string, 'ProjectNamespace'>;
