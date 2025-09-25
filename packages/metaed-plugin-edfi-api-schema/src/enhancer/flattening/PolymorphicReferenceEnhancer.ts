// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { ColumnMetadata } from '../../model/flattening/ColumnMetadata';
import { TableMetadata } from '../../model/flattening/TableMetadata';

/**
 * Check if a column corresponds to superclass identity
 */
function isSuperclassIdentityField(column: ColumnMetadata, _entity: any): boolean {
  // This is a simplified check
  // In a full implementation, we would need to:
  // 1. Get the superclass entity
  // 2. Check its identity fields
  // 3. Compare with this column's JSON path or name

  const commonSuperclassIdentityPatterns = ['UniqueId', 'Id', 'Identifier', 'Code'];

  return commonSuperclassIdentityPatterns.some((pattern) => column.columnName.includes(pattern));
}

/**
 * Mark columns that correspond to superclass identity
 */
function markSuperclassIdentityColumns(table: TableMetadata, _apiSchemaData: EntityApiSchemaData, entity: any): void {
  // For subclasses, mark natural key columns that map to superclass identity
  if ((entity as any).baseEntity) {
    table.columns.forEach((column) => {
      if (column.isNaturalKey) {
        // Check if this natural key corresponds to a superclass identity field
        // This would need to compare with the superclass entity's identity
        if (isSuperclassIdentityField(column, entity)) {
          column.isSuperclassIdentity = true;
        }
      }
    });
  }
}

/**
 * Process polymorphic references in a table
 */
function processPolymorphicReferences(table: TableMetadata, apiSchemaData: EntityApiSchemaData): void {
  // Look for polymorphic reference columns
  table.columns.forEach((column) => {
    if (column.isPolymorphicReference) {
      // Ensure there's a corresponding discriminator column
      const discriminatorColumnName = column.columnName.replace('Id', 'Type');
      const hasDiscriminator = table.columns.some((col) => col.columnName === discriminatorColumnName);

      if (!hasDiscriminator) {
        // Add discriminator column if missing
        const discriminatorColumn: ColumnMetadata = {
          columnName: discriminatorColumnName,
          columnType: 'string',
          maxLength: '255',
          isDiscriminator: true,
          isRequired: column.isRequired,
        };
        table.columns.push(discriminatorColumn);
      }
    }
  });

  // Process child tables recursively
  table.childTables.forEach((childTable) => {
    processPolymorphicReferences(childTable, apiSchemaData);
  });
}

/**
 * Handles polymorphic references such as EducationOrganization and similar hierarchies.
 * Adds discriminator columns and marks superclass identity columns.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Process subclass entities
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass', 'associationSubclass').forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    if (!apiSchemaData.flatteningMetadata) {
      return;
    }

    // Mark superclass identity columns
    markSuperclassIdentityColumns(apiSchemaData.flatteningMetadata.table, apiSchemaData, entity);
  });

  // Process entities with polymorphic references
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

      if (!apiSchemaData.flatteningMetadata) {
        return;
      }

      // Process polymorphic references
      processPolymorphicReferences(apiSchemaData.flatteningMetadata.table, apiSchemaData);
    },
  );

  return {
    enhancerName: 'PolymorphicReferenceEnhancer',
    success: true,
  };
}
