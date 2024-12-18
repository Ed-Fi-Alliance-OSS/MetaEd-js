import type { QueryFieldPathInfo } from './QueryFieldPathInfo';

/**
 * A mapping from a query field string to a list of QueryFieldPathInfo, providing JsonPaths in the document that
 * should be part of the query.
 */
export type QueryFieldMapping = { [queryField: string]: QueryFieldPathInfo[] };
