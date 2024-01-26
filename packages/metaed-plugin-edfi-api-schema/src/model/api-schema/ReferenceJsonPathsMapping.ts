import { MetaEdPropertyPath } from '@edfi/metaed-core';
import { ReferenceJsonPaths } from './ReferenceJsonPaths';

/**
 * For each reference in a document, maps from the JsonPaths of the reference to the identity JsonPaths
 * in the document being referred to.
 */
export type ReferenceJsonPathsMapping = { [key: MetaEdPropertyPath]: ReferenceJsonPaths[] };
