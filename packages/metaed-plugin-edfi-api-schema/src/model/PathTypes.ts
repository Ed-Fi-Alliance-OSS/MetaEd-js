// This is a generic "brand" type used to create branded types
type Brand<K, T> = K & { __brand: T };

/**
 *  A string type branded as a PropertyPath, which is a dot-separated MetaEd property name list
 *  denoting a path from a starting entity through other entities. Role names on a property
 *  are expressed by prefix on the property name. Most commonly used as a merge directive path.
 */
export type PropertyPath = Brand<string, 'PropertyPath'>;

/**
 * A string type branded as a JsonPath, which is a standard JSONPath expression.
 * See https://goessner.net/articles/JsonPath/index.html
 */
export type JsonPath = Brand<string, 'JsonPath'>;
