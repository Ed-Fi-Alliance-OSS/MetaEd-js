// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { TableMetadata } from '../../model/flattening/TableMetadata';

/**
 * Derive column name from JSON path
 */
function deriveColumnNameFromPath(jsonPath: string): string {
  const segments = jsonPath.split('.');
  const lastSegment = segments[segments.length - 1].replace(/\[.*?\]/g, '');
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

/**
 * Add columns for collection item properties
 */
function addCollectionColumns(table: TableMetadata, apiSchemaData: EntityApiSchemaData): void {
  // This will analyze the collection's item type and add appropriate columns
  // For now, this is a placeholder implementation

  // Extract collection path to determine what properties to add
  const collectionPath = table.jsonPath;

  // Find properties that belong to this collection level
  if (apiSchemaData.allJsonPathsMapping) {
    Object.entries(apiSchemaData.allJsonPathsMapping).forEach(([_propertyPath, jsonPathsInfo]) => {
      // Check if this property belongs to the current collection level
      // JsonPathsInfo can be either TopLevelJsonPathsInfo or ReferenceLevelJsonPathsInfo
      // For simplicity, we'll handle the case where it has a jsonPaths array
      const jsonPaths = (jsonPathsInfo as any).jsonPaths || [];

      if (Array.isArray(jsonPaths)) {
        jsonPaths.forEach((jsonPath: string) => {
          if (jsonPath.startsWith(collectionPath) && !jsonPath.includes('[*]', collectionPath.length)) {
            // This property belongs to this collection level
            // Add column for it (unless already added)
            const existingColumn = table.columns.find((col) => col.jsonPath === jsonPath.replace(collectionPath, ''));
            if (!existingColumn) {
              table.columns.push({
                jsonPath: jsonPath.replace(collectionPath, ''),
                columnName: deriveColumnNameFromPath(jsonPath),
                columnType: 'string', // Will be refined by SqlTypeMapperEnhancer
              });
            }
          }
        });
      }
    });
  }
}

/**
 * Recursively process collections in a table
 */
function processTableCollections(table: TableMetadata, apiSchemaData: EntityApiSchemaData): void {
  // Process each child table recursively
  table.childTables.forEach((childTable) => {
    // Add columns for collection items
    addCollectionColumns(childTable, apiSchemaData);

    // Recursively process nested collections
    processTableCollections(childTable, apiSchemaData);
  });
}

/**
 * Processes collection properties to build recursive table structures.
 * Handles deeply nested collections by creating appropriate child table hierarchies.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'domainEntityExtension',
    'associationExtension',
  ).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    if (!apiSchemaData.flatteningMetadata) {
      return;
    }

    // Process collections recursively
    processTableCollections(apiSchemaData.flatteningMetadata.table, apiSchemaData);
  });

  return {
    enhancerName: 'CollectionTableBuilderEnhancer',
    success: true,
  };
}
