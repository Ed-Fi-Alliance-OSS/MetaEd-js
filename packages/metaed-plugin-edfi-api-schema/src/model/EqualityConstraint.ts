import { JsonPath } from './BrandedTypes';

/**
 * A pair of JsonPaths, the value of which must be equal in an Ed-Fi API JSON document.
 */
export type EqualityConstraint = {
  sourceJsonPath: JsonPath;
  targetJsonPath: JsonPath;
};

export function newEqualityConstraint(): EqualityConstraint {
  return {
    sourceJsonPath: '' as JsonPath,
    targetJsonPath: '' as JsonPath,
  };
}
