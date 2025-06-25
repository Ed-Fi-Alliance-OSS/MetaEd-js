// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import invariant from 'ts-invariant';
import {
  MetaEdEnvironment,
  EnhancerResult,
  Namespace,
  TopLevelEntity,
  Common,
  ReferentialProperty,
} from '@edfi/metaed-core';
import { Table, tableEntities, Column, ColumnConflictPair } from '@edfi/metaed-plugin-edfi-ods-relational';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { EqualityConstraint } from '../model/EqualityConstraint';
import { JsonPathsInfo } from '../model/JsonPathsMapping';
import { findMergeJsonPathsMapping } from '../Utility';

/**
 * Constraint information for conflicting columns
 */
interface ConstraintInfo {
  entity: TopLevelEntity;
  equalityConstraints: EqualityConstraint[];
  firstColumn: Column;
  secondColumn: Column;
  firstPathMapping: JsonPathsInfo;
  secondPathMapping: JsonPathsInfo;
  sourceJsonPaths: JsonPath[];
  targetJsonPaths: JsonPath[];
}

/**
 * Information about a collection conflict
 */
interface CollectionConflictInfo {
  collectionColumn: Column;
  collectionPropertyPath: string;
  collectionPropertyName: string;
  isSourceCollection: boolean;
}

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
 * Validates that a conflict pair is relevant to EqualityConstraints
 */
function isRelevantConflictPair(conflictPair: ColumnConflictPair): boolean {
  const { firstColumn, secondColumn } = conflictPair;

  // Both columns must have an original entity
  if (!firstColumn.originalEntity || !secondColumn.originalEntity) {
    return false;
  }

  // Must be on same resource to be an equality constraint
  return firstColumn.originalEntity === secondColumn.originalEntity;
}

/**
 * Gets the constraint information from a conflict pair
 */
function extractConstraintInfo(table: Table, conflictPair: ColumnConflictPair): ConstraintInfo | null {
  const { firstColumn, secondColumn } = conflictPair;

  invariant(firstColumn.originalEntity != null, 'isValidConflictPair() should have filtered this out');

  const entity = firstColumn.originalEntity;

  const { equalityConstraints } = entity.data.edfiApiSchema as EntityApiSchemaData;

  const firstPathMapping = findMergeJsonPathsMapping(entity, firstColumn.propertyPath);
  const secondPathMapping = findMergeJsonPathsMapping(entity, secondColumn.propertyPath);

  invariant(
    firstPathMapping != null,
    `Table '${table.tableId}' firstColumn.propertyPath '${firstColumn.propertyPath}' not found in '${entity.metaEdName}' mergeJsonPathsMapping`,
  );
  invariant(
    secondPathMapping != null,
    `Table '${table.tableId}' secondColumn.propertyPath '${secondColumn.propertyPath}' not found in '${entity.metaEdName}' mergeJsonPathsMapping`,
  );

  return {
    entity,
    equalityConstraints,
    firstColumn,
    secondColumn,
    firstPathMapping,
    secondPathMapping,
    sourceJsonPaths: firstPathMapping.jsonPathPropertyPairs.map((pair) => pair.jsonPath),
    targetJsonPaths: secondPathMapping.jsonPathPropertyPairs.map((pair) => pair.jsonPath),
  };
}

/**
 * Gets collection conflict information, but only if one side is a collection and the other isn't
 */
function getCollectionConflictInfo(
  sourceJsonPath: JsonPath,
  targetJsonPath: JsonPath,
  constraintInfo: ConstraintInfo,
): CollectionConflictInfo | null {
  const isSourceCollectionPath = sourceJsonPath.includes('[*]');
  const isTargetCollectionPath = targetJsonPath.includes('[*]');

  if (isSourceCollectionPath === isTargetCollectionPath) {
    return null;
  }

  const collectionColumn = isSourceCollectionPath ? constraintInfo.firstColumn : constraintInfo.secondColumn;
  const collectionPropertyPath = collectionColumn.propertyPath;

  // Extract the collection property name from the path
  const pathParts = collectionPropertyPath.split('.');

  // Collection conflicts involve nested properties
  // If we have a single-segment path, it's not a nested collection conflict
  if (pathParts.length < 2) {
    return null;
  }

  return {
    collectionColumn,
    collectionPropertyPath,
    collectionPropertyName: pathParts[0],
    isSourceCollection: isSourceCollectionPath,
  };
}

/**
 * Gets the common entity from a collection property
 */
function getCommonEntityFromProperty(entity: TopLevelEntity, collectionPropertyName: string): Common | null {
  const collectionProperty = entity.properties.find((p) => p.fullPropertyName === collectionPropertyName);

  if (!collectionProperty || collectionProperty.type !== 'common' || !collectionProperty.isCollection) {
    return null;
  }

  // CommonProperty extends ReferentialProperty, so it has referencedEntity
  const commonProperty = collectionProperty as ReferentialProperty;

  // The referencedEntity should be the Common entity we're looking for
  if (commonProperty.referencedEntity && commonProperty.referencedEntity.type === 'common') {
    return commonProperty.referencedEntity as Common;
  }

  return null;
}

/**
 * Counts how many identity properties from the common entity have conflicts
 */
function countConflictingIdentities(table: Table, collectionPropertyName: string): number {
  let conflictingIdentityCount = 0;

  table.columnConflictPairs.forEach((conflict) => {
    // Check if either column is from our collection by looking at source properties
    const isFirstFromCollection = conflict.firstColumn.sourceEntityProperties.some(
      (prop) =>
        prop.parentEntityName === collectionPropertyName ||
        conflict.firstColumn.propertyPath.startsWith(`${collectionPropertyName}.`),
    );
    const isSecondFromCollection = conflict.secondColumn.sourceEntityProperties.some(
      (prop) =>
        prop.parentEntityName === collectionPropertyName ||
        conflict.secondColumn.propertyPath.startsWith(`${collectionPropertyName}.`),
    );

    if (isFirstFromCollection || isSecondFromCollection) {
      // Get the column from the collection side
      const collectionSideColumn = isFirstFromCollection ? conflict.firstColumn : conflict.secondColumn;

      // Check if any of the source properties are identity properties
      const hasIdentityProperty = collectionSideColumn.sourceEntityProperties.some((prop) => prop.isPartOfIdentity);

      if (hasIdentityProperty) {
        conflictingIdentityCount += 1;
      }
    }
  });

  return conflictingIdentityCount;
}

/**
 * Determines if a collection constraint should be created based on identity matches
 */
function shouldCreateCollectionConstraint(collectionInfo: CollectionConflictInfo, table: Table): boolean {
  const { collectionColumn, collectionPropertyName } = collectionInfo;

  // Always create constraints for reference relationships
  if (collectionColumn.isFromReferenceProperty) {
    return true;
  }

  const entity = collectionColumn.originalEntity;
  if (!entity) {
    return true;
  }

  const commonEntity = getCommonEntityFromProperty(entity, collectionPropertyName);
  if (!commonEntity) {
    return true;
  }

  const identityProperties = commonEntity.properties.filter((p) => p.isPartOfIdentity);

  // Special case: If the common has no identity properties at all,
  // then any property conflict must create an equality constraint
  if (identityProperties.length === 0) {
    return true;
  }

  // Check if the conflicting property is actually an identity property in the common
  const isConflictingPropertyIdentity = collectionColumn.sourceEntityProperties.some((prop) => prop.isPartOfIdentity);

  // If the conflicting property is not an identity in the common, skip the constraint
  if (!isConflictingPropertyIdentity) {
    return false;
  }

  // For collections with multiple identity properties, check if this is a partial match
  if (identityProperties.length > 1) {
    const conflictingIdentityCount = countConflictingIdentities(table, collectionPropertyName);

    // If not all identity properties have conflicts, it's a partial match
    if (conflictingIdentityCount < identityProperties.length) {
      return false;
    }
  }

  return true;
}

/**
 * Determines if a constraint should be created for a specific path pair
 */
function shouldCreateConstraint(
  sourceJsonPath: JsonPath,
  targetJsonPath: JsonPath,
  context: ConstraintInfo,
  table: Table,
): boolean {
  // Can ignore conflicts that result in the same path
  if (sourceJsonPath === targetJsonPath) {
    return false;
  }

  // Skip if duplicate
  if (areDuplicateConstraintPaths(context.equalityConstraints, sourceJsonPath, targetJsonPath)) {
    return false;
  }

  // Check for collection conflicts that need special handling
  const collectionInfo = getCollectionConflictInfo(sourceJsonPath, targetJsonPath, context);
  if (collectionInfo) {
    return shouldCreateCollectionConstraint(collectionInfo, table);
  }

  return true;
}

/**
 * Processes a single column conflict pair
 */
function processColumnConflictPair(table: Table, conflictPair: ColumnConflictPair): void {
  // Validate the conflict pair
  if (!isRelevantConflictPair(conflictPair)) {
    return;
  }

  // Get the processing context
  const constraintInfo: ConstraintInfo | null = extractConstraintInfo(table, conflictPair);
  if (!constraintInfo) {
    return;
  }

  // Process each path pair
  constraintInfo.sourceJsonPaths.forEach((sourceJsonPath, index) => {
    const targetJsonPath: JsonPath = constraintInfo.targetJsonPaths[index];

    if (shouldCreateConstraint(sourceJsonPath, targetJsonPath, constraintInfo, table)) {
      constraintInfo.equalityConstraints.push({
        sourceJsonPath,
        targetJsonPath,
      });
    }
  });
}

/**
 * Creates EqualityConstraints from relational ColumnConflictPairs using JsonPathsMapping to find the source and
 * target JsonPaths. Not all ColumnConflictPairs lead to the creation of an EqualityConstraint
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  allTables(metaEd).forEach((table) => {
    table.columnConflictPairs.forEach((conflictPair) => {
      processColumnConflictPair(table, conflictPair);
    });
  });

  return {
    enhancerName: 'ColumnConflictEqualityConstraintEnhancer',
    success: true,
  };
}
