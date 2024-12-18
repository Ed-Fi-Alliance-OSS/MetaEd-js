import type { EntityProperty } from '@edfi/metaed-core';
import type { JsonPath } from './JsonPath';
import type { PathType } from './PathType';

/**
 * The path information for a query field. sourceProperty must be stripped out before QueryFieldPathInfo
 * can be stringified.
 */
export type QueryFieldPathInfo = { path: JsonPath; type: PathType; sourceProperty?: EntityProperty };
