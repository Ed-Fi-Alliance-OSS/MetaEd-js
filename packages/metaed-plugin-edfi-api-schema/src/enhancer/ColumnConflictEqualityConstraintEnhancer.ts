// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import invariant from 'ts-invariant';
import { MetaEdEnvironment, EnhancerResult, Namespace, EntityProperty, TopLevelEntity, Common } from '@edfi/metaed-core';
import {
  Table,
  tableEntities,
  Column,
  ColumnConflictPath as ColumnConflictPair,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { EqualityConstraint } from '../model/EqualityConstraint';
import { JsonPathsInfo } from '../model/JsonPathsMapping';
import { findMergeJsonPathsMapping } from '../Utility';

/**
 * Context needed for processing constraints
 */
interface ConstraintContext {
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
 * Validates that a conflict pair is valid for processing
 */
function isValidConflictPair(conflictPair: ColumnConflictPair): boolean {
  const { firstColumn, secondColumn } = conflictPair;

  // Both columns must have an original entity
  if (!firstColumn.originalEntity || !secondColumn.originalEntity) {
    return false;
  }

  // Must be on same resource to be a resource equality constraint
  if (firstColumn.originalEntity !== secondColumn.originalEntity) {
    return false;
  }

  return true;
}

/**
 * Gets the constraint processing context for a conflict pair
 */
function getConstraintContext(table: Table, conflictPair: ColumnConflictPair): ConstraintContext | null {
  const { firstColumn, secondColumn } = conflictPair;
  const entity = firstColumn.originalEntity!;

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
 * Checks if either path represents a reference relationship
 */
function isReferenceRelationship(firstColumn: Column, secondColumn: Column): boolean {
  return firstColumn.propertyPath.includes('Reference.') || secondColumn.propertyPath.includes('Reference.');
}

/**
 * Gets collection conflict information if one side is a collection and the other isn't
 */
function getCollectionConflictInfo(
  sourceJsonPath: JsonPath,
  targetJsonPath: JsonPath,
  context: ConstraintContext,
): CollectionConflictInfo | null {
  const sourceIsCollection = sourceJsonPath.includes('[*]');
  const targetIsCollection = targetJsonPath.includes('[*]');

  // Only process if exactly one side is a collection
  if (sourceIsCollection === targetIsCollection) {
    return null;
  }

  const isSourceCollection = sourceIsCollection;
  const collectionColumn = isSourceCollection ? context.firstColumn : context.secondColumn;
  const collectionPropertyPath = collectionColumn.propertyPath;

  // Extract the collection property name from the path
  const pathParts = collectionPropertyPath.split('.');
  if (pathParts.length < 2) {
    return null;
  }

  return {
    collectionColumn,
    collectionPropertyPath,
    collectionPropertyName: pathParts[0],
    isSourceCollection,
  };
}

/**
 * Gets the common entity from a collection property
 */
function getCommonEntityFromProperty(entity: TopLevelEntity, collectionPropertyName: string): Common | null {
  const collectionProperty = entity.properties.find((p) => p.metaEdName === collectionPropertyName);

  if (!collectionProperty || collectionProperty.type !== 'common' || !collectionProperty.isCollection) {
    return null;
  }

  // For common properties, we should use the property's actual type information
  // rather than hacky string manipulation
  let commonEntityName = collectionPropertyName;

  // Convert plural to singular if needed (simple heuristic)
  // TODO: This should be replaced with proper type information from the property
  if (commonEntityName.endsWith('s')) {
    commonEntityName = commonEntityName.slice(0, -1);
  }
  // Capitalize first letter
  commonEntityName = commonEntityName.charAt(0).toUpperCase() + commonEntityName.slice(1);

  const { namespace } = entity;
  if (!namespace?.entity?.common) {
    return null;
  }

  return namespace.entity.common.get(commonEntityName) || null;
}

/**
 * Counts how many identity properties from the common entity have conflicts
 */
function countConflictingIdentities(
  table: Table,
  collectionPropertyName: string,
  identityProperties: EntityProperty[],
): number {
  let conflictingIdentityCount = 0;

  table.columnConflictPairs.forEach((conflict) => {
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

  return conflictingIdentityCount;
}

/**
 * Determines if a collection constraint should be created based on identity matches
 */
function shouldCreateCollectionConstraint(collectionInfo: CollectionConflictInfo, table: Table): boolean {
  const { collectionColumn, collectionPropertyPath, collectionPropertyName } = collectionInfo;

  // Always create constraints for reference relationships
  if (collectionColumn.propertyPath.includes('Reference.')) {
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
  const conflictingPropertyName = collectionPropertyPath.split('.')[1];
  const isConflictingPropertyIdentity = identityProperties.some(
    (p) => p.metaEdName.toLowerCase() === conflictingPropertyName.toLowerCase(),
  );

  // If the conflicting property is not an identity in the common, skip the constraint
  if (!isConflictingPropertyIdentity) {
    return false;
  }

  // For collections with multiple identity properties, check if this is a partial match
  if (identityProperties.length > 1) {
    const conflictingIdentityCount = countConflictingIdentities(table, collectionPropertyName, identityProperties);

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
  context: ConstraintContext,
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
  if (!isValidConflictPair(conflictPair)) {
    return;
  }

  // Get the processing context
  const context = getConstraintContext(table, conflictPair);
  if (!context) {
    return;
  }

  // Always allow constraints for reference relationships
  if (!isReferenceRelationship(context.firstColumn, context.secondColumn)) {
    // For non-reference relationships, we'll check each path pair individually
  }

  // Process each path pair
  context.sourceJsonPaths.forEach((sourceJsonPath, index) => {
    const targetJsonPath = context.targetJsonPaths[index];

    if (shouldCreateConstraint(sourceJsonPath, targetJsonPath, context, table)) {
      context.equalityConstraints.push({
        sourceJsonPath,
        targetJsonPath,
      });
    }
  });
}

/**
 * Processes all column conflicts for a single table
 */
function processTableColumnConflicts(table: Table): void {
  table.columnConflictPairs.forEach((conflictPair) => {
    processColumnConflictPair(table, conflictPair);
  });
}

/**
 * Creates EqualityConstraints from relational ColumnConflictPairs using JsonPathsMapping to find the source and
 * target JsonPaths.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const tables = allTables(metaEd);

  tables.forEach((table) => {
    processTableColumnConflicts(table);
  });

  return {
    enhancerName: 'ColumnConflictEqualityConstraintEnhancer',
    success: true,
  };
}
