import { JsonPath } from './api-schema/JsonPath';
import { MetaEdPropertyPath } from './api-schema/MetaEdPropertyPath';

/**
 * A mapping of dot-separated MetaEd property paths to corresponding JsonPaths to data elements
 * in the API document.
 *
 * Includes both paths ending in references and paths ending in scalars. PropertyPaths ending in
 * scalars have a single JsonPath, while PropertyPaths ending in references may have multiple
 * JsonPaths, as document references are often composed of multiple elements.
 *
 * The JsonPaths array is always is sorted order.
 */
export type JsonPathsMapping = { [key: MetaEdPropertyPath]: JsonPath[] };
