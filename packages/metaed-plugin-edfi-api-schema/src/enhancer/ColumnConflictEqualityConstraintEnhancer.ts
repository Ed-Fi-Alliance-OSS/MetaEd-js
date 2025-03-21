// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import invariant from 'ts-invariant';
import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { ColumnConflictPath, Table, tableEntities } from '@edfi/metaed-plugin-edfi-ods-relational';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { EqualityConstraint } from '../model/EqualityConstraint';
import { JsonPathsInfo } from '../model/JsonPathsMapping';
import { findMergeJsonPathsMapping } from '../Utility';

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
      if (columnConflictPath.firstOriginalEntity !== columnConflictPath.secondOriginalEntity)
        // Must be on same resource to be a resource equality constraint
        return;

      const { equalityConstraints } = columnConflictPath.firstOriginalEntity.data.edfiApiSchema as EntityApiSchemaData;

      const firstPathInMapping: JsonPathsInfo | null = findMergeJsonPathsMapping(
        columnConflictPath.firstOriginalEntity,
        columnConflictPath.firstPath,
      );
      const secondPathInMapping: JsonPathsInfo | null = findMergeJsonPathsMapping(
        columnConflictPath.firstOriginalEntity,
        columnConflictPath.secondPath,
      );

      invariant(
        firstPathInMapping != null,
        `Invariant failed in ColumnConflictEqualityConstraintEnhancer: Table '${table.tableId}' has columnConflictPath.firstPath '${columnConflictPath.firstPath}' not found in mergeJsonPathsMapping for entity '${columnConflictPath.firstOriginalEntity.metaEdName}'`,
      );
      invariant(
        secondPathInMapping != null,
        `Invariant failed in ColumnConflictEqualityConstraintEnhancer: Table '${table.tableId}' has columnConflictPath.secondPath '${columnConflictPath.secondPath}' not found in mergeJsonPathsMapping for entity '${columnConflictPath.firstOriginalEntity.metaEdName}'`,
      );

      const sourceJsonPaths: JsonPath[] = firstPathInMapping.jsonPathPropertyPairs.map((jppp) => jppp.jsonPath);
      const targetJsonPaths: JsonPath[] = secondPathInMapping.jsonPathPropertyPairs.map((jppp) => jppp.jsonPath);

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
