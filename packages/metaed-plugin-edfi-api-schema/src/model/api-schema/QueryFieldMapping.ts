import { JsonPath } from './JsonPath';

/**
 * A mapping from a query field string to a list of JsonPaths in the document that
 * should be part of the query.
 */
export type QueryFieldMapping = { [key: string]: JsonPath[] };
