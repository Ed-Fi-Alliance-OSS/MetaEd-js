import invariant from 'ts-invariant';
import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { ColumnConflictPath, Table, tableEntities } from '@edfi/metaed-plugin-edfi-ods-relational';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { EqualityConstraint } from '../model/EqualityConstraint';

/**
 * Returns all the relational Table objects
 */
function allTables(metaEd: MetaEdEnvironment): Table[] {
  const tables: Table[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    tables.push(...tableEntities(metaEd, namespace).values());
  });
  return tables;
}

/**
 * Returns true if the path is in the given equalityConstraint, either source or target
 */
function isJsonPathInConstraint(equalityConstraint: EqualityConstraint, jsonPath: JsonPath) {
  return equalityConstraint.sourceJsonPath === jsonPath || equalityConstraint.targetJsonPath === jsonPath;
}

/**
 * Returns true if the source and target path pair is already present in the given equalityConstraints array,
 * regardless of path order.
 */
function areDuplicateConstraintPaths(
  equalityConstraints: EqualityConstraint[],
  sourceJsonPath: JsonPath,
  targetJsonPath: JsonPath,
) {
  return equalityConstraints.some(
    (equalityConstraint) =>
      isJsonPathInConstraint(equalityConstraint, sourceJsonPath) &&
      isJsonPathInConstraint(equalityConstraint, targetJsonPath),
  );
}

/**
 * Creates EqualityConstraints from relational ColumnConflictPaths using JsonPathsMapping to find the source and
 * target JsonPaths.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const tables: Table[] = allTables(metaEd);

  tables.forEach((table: Table) => {
    table.columnConflictPaths.forEach((columnConflictPath: ColumnConflictPath) => {
      // Must be on same resource to be a resource equality constraint
      if (columnConflictPath.firstOriginalEntity !== columnConflictPath.secondOriginalEntity) return;

      const { equalityConstraints, allJsonPathsMapping } = columnConflictPath.firstOriginalEntity.data
        .edfiApiSchema as EntityApiSchemaData;

      const sourceJsonPaths: JsonPath[] | undefined = allJsonPathsMapping[columnConflictPath.firstPath].jsonPaths;
      const targetJsonPaths: JsonPath[] | undefined = allJsonPathsMapping[columnConflictPath.secondPath].jsonPaths;

      invariant(
        sourceJsonPaths != null && targetJsonPaths != null,
        'Invariant failed in ColumnConflictEqualityConstraintEnhancer: source or target JsonPaths are undefined',
      );
      invariant(
        sourceJsonPaths.length === targetJsonPaths.length,
        'Invariant failed in ColumnConflictEqualityConstraintEnhancer: source and target JsonPath lengths not equal',
      );

      sourceJsonPaths.forEach((sourceJsonPath: JsonPath, matchingTargetJsonPathIndex: number) => {
        const targetJsonPath: JsonPath = targetJsonPaths[matchingTargetJsonPathIndex];
        // Can ignore conflicts that result in the same path
        if (sourceJsonPath === targetJsonPath) return;

        if (areDuplicateConstraintPaths(equalityConstraints, sourceJsonPath, targetJsonPath)) return;

        equalityConstraints.push({
          sourceJsonPath,
          targetJsonPath: targetJsonPaths[matchingTargetJsonPathIndex],
        });
      });
    });
  });

  return {
    enhancerName: 'ColumnConflictEqualityConstraintEnhancer',
    success: true,
  };
}
