import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a DocumentObjectKey, which is standard JSON document object key
 */
export type DocumentObjectKey = BrandType<string, 'DocumentObjectKey'>;
