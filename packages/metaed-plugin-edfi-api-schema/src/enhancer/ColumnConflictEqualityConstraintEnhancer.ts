// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import invariant from 'ts-invariant';
import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { Table, tableEntities, Column } from '@edfi/metaed-plugin-edfi-ods-relational';
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
 * Returns true if we should create equality constraints between these paths.
 * This prevents creating equality constraints for partial identity matches in common collections.
 */
function shouldCreateEqualityConstraint(
  firstColumn: Column,
  secondColumn: Column,
  firstPathInfo: JsonPathsInfo,
  secondPathInfo: JsonPathsInfo,
): boolean {
  // Check if paths involve common collections (contain [*] but not part of a reference)
  const firstInCommonCollection = firstPathInfo.jsonPathPropertyPairs.some((pair) => {
    const path = pair.jsonPath;
    return path.includes('[*]') && !path.includes('Reference.');
  });
  const secondInCommonCollection = secondPathInfo.jsonPathPropertyPairs.some((pair) => {
    const path = pair.jsonPath;
    return path.includes('[*]') && !path.includes('Reference.');
  });

  // If one path is in a common collection, check if they represent the same identity structure
  if (firstInCommonCollection || secondInCommonCollection) {
    // Check the property paths to see if this is a reference equality or just same-named scalars
    const firstPath = firstColumn.propertyPath;
    const secondPath = secondColumn.propertyPath;

    // Split paths into segments
    const firstSegments = firstPath.split('.');
    const secondSegments = secondPath.split('.');

    // Get the property names (last segment)
    const firstPropertyName = firstSegments[firstSegments.length - 1];
    const secondPropertyName = secondSegments[secondSegments.length - 1];

    // If property names don't match, they can't be the same reference
    if (firstPropertyName !== secondPropertyName) {
      return true; // Different properties, allow constraint
    }

    // If both paths have only one segment (top-level properties), they're independent
    if (firstSegments.length === 1 && secondSegments.length === 1) {
      return false; // Same-named top-level properties in different contexts
    }

    // Check if one is a simple scalar in a collection and the other is a top-level scalar
    // Example: "DegreeSpecialization.BeginDate" vs "BeginDate"
    if (
      (firstSegments.length === 1 && secondSegments.length === 2) ||
      (firstSegments.length === 2 && secondSegments.length === 1)
    ) {
      // This is the case of a scalar in a common collection with the same name as a top-level scalar
      // These are independent and should not have equality constraints
      return false;
    }

    // For more complex paths, check if they share a reference structure
    // Example: "Assessment" vs "StudentAssessmentItem.AssessmentItem.Assessment"
    const longerPath = firstSegments.length > secondSegments.length ? firstPath : secondPath;
    const shorterPath = firstSegments.length > secondSegments.length ? secondPath : firstPath;

    // Check if the longer path contains the shorter path as a suffix (indicating a reference)
    return longerPath.endsWith(shorterPath);
  }

  return true;
}

/**
 * Creates EqualityConstraints from relational ColumnConflictPaths using JsonPathsMapping to find the source and
 * target JsonPaths.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const tables: Table[] = allTables(metaEd);

  tables.forEach((table: Table) => {
    table.columnConflictPairs.forEach((columnConflictPair) => {
      const { firstColumn, secondColumn } = columnConflictPair;

      if (firstColumn.originalEntity == null || secondColumn.originalEntity == null) return;

      if (firstColumn.originalEntity !== secondColumn.originalEntity)
        // Must be on same resource to be a resource equality constraint
        return;

      const { equalityConstraints } = firstColumn.originalEntity.data.edfiApiSchema as EntityApiSchemaData;

      const firstPathInMapping: JsonPathsInfo | null = findMergeJsonPathsMapping(
        firstColumn.originalEntity,
        firstColumn.propertyPath,
      );
      const secondPathInMapping: JsonPathsInfo | null = findMergeJsonPathsMapping(
        firstColumn.originalEntity,
        secondColumn.propertyPath,
      );

      invariant(
        firstPathInMapping != null,
        `Invariant failed in ColumnConflictEqualityConstraintEnhancer: Table '${table.tableId}' has firstColumn.propertyPath '${firstColumn.propertyPath}' not found in mergeJsonPathsMapping for entity '${firstColumn.originalEntity.metaEdName}'`,
      );
      invariant(
        secondPathInMapping != null,
        `Invariant failed in ColumnConflictEqualityConstraintEnhancer: Table '${table.tableId}' has secondColumn.propertyPath '${secondColumn.propertyPath}' not found in mergeJsonPathsMapping for entity '${firstColumn.originalEntity.metaEdName}'`,
      );

      // Skip if we shouldn't create equality constraints for these paths
      if (!shouldCreateEqualityConstraint(firstColumn, secondColumn, firstPathInMapping, secondPathInMapping)) {
        return;
      }

      const sourceJsonPaths: JsonPath[] = firstPathInMapping.jsonPathPropertyPairs.map((pair) => pair.jsonPath);
      const targetJsonPaths: JsonPath[] = secondPathInMapping.jsonPathPropertyPairs.map((pair) => pair.jsonPath);

      sourceJsonPaths.forEach((sourceJsonPath: JsonPath, matchingTargetJsonPathIndex: number) => {
        const targetJsonPath: JsonPath = targetJsonPaths[matchingTargetJsonPathIndex];
        // Can ignore conflicts that result in the same path
        if (sourceJsonPath === targetJsonPath) return;

        if (areDuplicateConstraintPaths(equalityConstraints, sourceJsonPath, targetJsonPath)) return;

        // Check if this is a partial identity match that shouldn't create a constraint
        const sourceIsCollection = sourceJsonPath.includes('[*]');
        const targetIsCollection = targetJsonPath.includes('[*]');

        // If one side is a collection and the other isn't, we need to check for partial identity matches
        if (sourceIsCollection !== targetIsCollection) {
          // Determine which column represents the collection side
          const collectionColumn = sourceIsCollection ? firstColumn : secondColumn;

          // Get the property paths to understand the structure
          const collectionPropertyPath = collectionColumn.propertyPath;

          // For common collections, check if this is a partial identity match
          // This happens when the collection's entity has more identity properties than just the conflicting one
          if (collectionPropertyPath && collectionColumn.originalEntity) {
            // Extract the collection property name from the path (e.g., "degreeSpecializations" from "degreeSpecializations.beginDate")
            const pathParts = collectionPropertyPath.split('.');
            if (pathParts.length >= 2) {
              const collectionPropertyName = pathParts[0];

              // Find the property definition on the original entity
              const entity = firstColumn.originalEntity;
              if (entity && entity.properties) {
                const collectionProperty = entity.properties.find((p) => p.metaEdName === collectionPropertyName);

                if (collectionProperty && collectionProperty.type === 'common' && collectionProperty.isCollection) {
                  // Get the common entity that this collection references
                  const commonEntityName = collectionProperty.metaEdName;
                  const { namespace } = entity;

                  if (namespace && namespace.entity && namespace.entity.common) {
                    const commonEntity = namespace.entity.common.get(commonEntityName);

                    if (commonEntity && commonEntity.properties) {
                      // Count the identity properties of the common entity
                      const identityProperties = commonEntity.properties.filter((p) => p.isPartOfIdentity);

                      // If the common entity has more than one identity property, and we're only
                      // conflicting on one of them, this is a partial identity match
                      if (identityProperties.length > 1) {
                        // This is a partial identity match - skip creating the constraint
                        return;
                      }
                    }
                  }
                }
              }
            }
          }
        }

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
