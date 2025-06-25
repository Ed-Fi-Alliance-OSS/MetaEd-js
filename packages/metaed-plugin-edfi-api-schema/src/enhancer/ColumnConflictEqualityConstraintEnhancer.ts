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
function shouldCreateEqualityConstraint(firstColumn: Column, secondColumn: Column): boolean {
  // Always allow constraints for reference relationships
  if (firstColumn.propertyPath.includes('Reference.') || secondColumn.propertyPath.includes('Reference.')) {
    return true;
  }

  // For non-reference relationships, continue with the existing logic
  return true; // Let the main logic handle partial vs full match detection
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
      if (!shouldCreateEqualityConstraint(firstColumn, secondColumn)) {
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

              // Find the property definition on the original entity (use the collection column's entity)
              const entity = collectionColumn.originalEntity;
              if (entity && entity.properties) {
                const collectionProperty = entity.properties.find((p) => p.metaEdName === collectionPropertyName);

                if (collectionProperty && collectionProperty.type === 'common' && collectionProperty.isCollection) {
                  // For common properties, the referenced type name is typically in the property's referencedEntity
                  // or we can infer it from the property name (e.g., "degreeSpecializations" -> "DegreeSpecialization")
                  let commonEntityName = collectionPropertyName;
                  // Convert plural to singular if needed (simple heuristic)
                  if (commonEntityName.endsWith('s')) {
                    commonEntityName = commonEntityName.slice(0, -1);
                  }
                  // Capitalize first letter
                  commonEntityName = commonEntityName.charAt(0).toUpperCase() + commonEntityName.slice(1);

                  const { namespace } = entity;

                  if (namespace && namespace.entity && namespace.entity.common) {
                    const commonEntity = namespace.entity.common.get(commonEntityName);

                    if (commonEntity && commonEntity.properties) {
                      // Count the identity properties of the common entity
                      const identityProperties = commonEntity.properties.filter((p) => p.isPartOfIdentity);

                      // Special case: If the common has no identity properties at all,
                      // then any property conflict must create an equality constraint
                      // because the collection elements have no way to be identified independently
                      if (identityProperties.length === 0) {
                        // Continue to create the constraint - don't check if it's an identity
                      } else {
                        // Check if the conflicting property is actually an identity property in the common
                        const conflictingPropertyName = collectionPropertyPath.split('.')[1];
                        const isConflictingPropertyIdentity = identityProperties.some(
                          (p) => p.metaEdName.toLowerCase() === conflictingPropertyName.toLowerCase(),
                        );

                        // If the conflicting property is not an identity in the common, skip the constraint
                        if (!isConflictingPropertyIdentity) {
                          return;
                        }
                      }

                      // To determine if this is a partial or full match, we need to check
                      // how many of the common's identity properties have conflicts
                      if (identityProperties.length > 1) {
                        // Count how many identity properties from the common entity have conflicts
                        let conflictingIdentityCount = 0;

                        // Look through all column conflicts on this table
                        table.columnConflictPairs.forEach((conflict) => {
                          // Check if this conflict involves a property from our common entity
                          const conflictPath1 = conflict.firstColumn.propertyPath;
                          const conflictPath2 = conflict.secondColumn.propertyPath;

                          // Check if either path is from our collection
                          const isPath1FromCollection = conflictPath1.startsWith(`${collectionPropertyName}.`);
                          const isPath2FromCollection = conflictPath2.startsWith(`${collectionPropertyName}.`);

                          if (isPath1FromCollection || isPath2FromCollection) {
                            // Extract the property name after the collection name
                            const collectionSidePath = isPath1FromCollection ? conflictPath1 : conflictPath2;
                            const propertyName = collectionSidePath.split('.')[1];

                            // Check if this property is an identity property of the common
                            if (identityProperties.some((p) => p.metaEdName.toLowerCase() === propertyName.toLowerCase())) {
                              conflictingIdentityCount += 1;
                            }
                          }
                        });

                        // If not all identity properties have conflicts, it's a partial match
                        if (conflictingIdentityCount < identityProperties.length) {
                          // This is a partial identity match - skip creating the constraint
                          return;
                        }
                        // Otherwise, it's a full match - continue to create the constraint
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
