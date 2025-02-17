import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a ProjectEndpointName, which is the URL path component referring to a ProjectSchema
 * e.g. "ed-fi" for an Ed-Fi data standard version, "tpdm" for a TPDM extension
 */

export type ProjectEndpointName = BrandType<string, 'ProjectEndpointName'>;
