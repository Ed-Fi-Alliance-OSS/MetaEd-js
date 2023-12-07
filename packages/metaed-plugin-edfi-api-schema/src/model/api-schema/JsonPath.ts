import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a JsonPath, which is a standard JSONPath expression.
 * See https://goessner.net/articles/JsonPath/index.html
 */

export type JsonPath = BrandType<string, 'JsonPath'>;
