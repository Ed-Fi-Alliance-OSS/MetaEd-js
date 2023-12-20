import { MetaEdPropertyPath, TopLevelEntity } from '@edfi/metaed-core';

/**
 * A pair of MetaEdPropertyPaths for two properties that resolve to a single column conflict in a table.
 */
export type ColumnConflictPath = {
  firstPath: MetaEdPropertyPath;
  secondPath: MetaEdPropertyPath;
  firstOriginalEntity: TopLevelEntity;
  secondOriginalEntity: TopLevelEntity;
};
