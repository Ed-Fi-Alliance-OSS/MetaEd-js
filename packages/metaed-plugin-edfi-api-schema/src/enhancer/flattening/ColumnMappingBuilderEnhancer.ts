// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import { ColumnMetadata } from '../../model/flattening/ColumnMetadata';
import { ColumnType } from '../../model/flattening/ColumnType';
import { TableMetadata } from '../../model/flattening/TableMetadata';
import { JsonPath } from '../../model/api-schema/JsonPath';

/**
 * Derive column name from JSON path
 */
function deriveColumnName(jsonPath: string): string {
  // Remove leading $ and dots
  const cleanPath = jsonPath.replace(/^\$\.?/, '');
  const parts = cleanPath.split('.');
  const lastPart = parts[parts.length - 1] || cleanPath;

  // Handle special cases like CodeValue, ShortDescription
  if (lastPart === 'codeValue') return 'CodeValue';
  if (lastPart === 'shortDescription') return 'ShortDescription';
  if (lastPart === 'namespace') return 'Namespace';

  // Capitalize first letter
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
}

/**
 * Derive parent table name from child table
 */
function deriveParentTableName(childTable: TableMetadata): string {
  // Extract parent name from child table name
  // This is a simplified implementation
  const { baseName } = childTable;
  const lastCapitalIndex = baseName.lastIndexOf(baseName.match(/[A-Z][^A-Z]*$/)?.[0] || '');
  return lastCapitalIndex > 0 ? baseName.substring(0, lastCapitalIndex) : baseName;
}

/**
 * Map property type to column type
 */
function mapPropertyTypeToColumnType(propertyType: string): ColumnType {
  // Map MetaEd property types to abstract column types
  switch (propertyType) {
    case 'boolean':
      return 'boolean';
    case 'integer':
      return 'integer';
    case 'decimal':
      return 'decimal';
    case 'date':
      return 'date';
    case 'dateTime':
    case 'time':
      return 'datetime';
    case 'year':
      return 'year';
    case 'duration':
      return 'duration';
    case 'percent':
      return 'percent';
    case 'currency':
      return 'currency';
    case 'descriptor':
      return 'descriptor';
    case 'string':
    default:
      return 'string';
  }
}

/**
 * Build column definitions for a table based on its properties
 */
function buildColumnsForTable(table: TableMetadata, apiSchemaData: EntityApiSchemaData, _entity: any): void {
  // Add identity columns based on natural keys
  if (apiSchemaData.identityJsonPaths && apiSchemaData.identityJsonPaths.length > 0) {
    apiSchemaData.identityJsonPaths.forEach((jsonPath: JsonPath) => {
      // Convert JsonPath type to string for processing
      const pathStr = jsonPath as string;
      const column: ColumnMetadata = {
        jsonPath: pathStr.replace('$', ''),
        columnName: deriveColumnName(pathStr),
        columnType: 'string', // Will be refined by SqlTypeMapperEnhancer
        isNaturalKey: true,
        isRequired: true,
      };
      table.columns.push(column);
    });
  }

  // Add columns for scalar properties
  if (apiSchemaData.collectedApiProperties) {
    apiSchemaData.collectedApiProperties.forEach((collectedProperty) => {
      const { property } = collectedProperty;
      const propertyApiSchemaData = property.data.edfiApiSchema as EntityPropertyApiSchemaData | undefined;
      const apiMapping = propertyApiSchemaData?.apiMapping;

      if (!apiMapping) {
        return;
      }

      // Check if property is scalar (not a collection and not a reference)
      const isScalar = !property.isRequiredCollection && !property.isOptionalCollection;
      const isNotReference = !apiMapping.isScalarReference;

      if (isScalar && isNotReference) {
        const column: ColumnMetadata = {
          jsonPath: `.${apiMapping.topLevelName}`,
          columnName: apiMapping.fullName || property.metaEdName,
          columnType: mapPropertyTypeToColumnType(property.type),
          isRequired: property.isRequired || false,
        };
        table.columns.push(column);
      }
    });
  }
}

/**
 * Recursively process child tables to build their columns
 */
function processChildTables(childTables: TableMetadata[], apiSchemaData: EntityApiSchemaData): void {
  childTables.forEach((childTable) => {
    // Add parent reference column
    const parentRefColumn: ColumnMetadata = {
      columnName: `${deriveParentTableName(childTable)}_Id`,
      columnType: 'bigint',
      isParentReference: true,
      isRequired: true,
    };
    childTable.columns.push(parentRefColumn);

    // Process nested child tables recursively
    if (childTable.childTables.length > 0) {
      processChildTables(childTable.childTables, apiSchemaData);
    }
  });
}

/**
 * Maps entity properties to columns in flattened tables.
 * Creates column definitions with appropriate types and constraints.
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
    'descriptor',
  ).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    if (!apiSchemaData.flatteningMetadata) {
      return;
    }

    // Build columns for the root table
    buildColumnsForTable(apiSchemaData.flatteningMetadata.table, apiSchemaData, entity);

    // Recursively build columns for child tables
    processChildTables(apiSchemaData.flatteningMetadata.table.childTables, apiSchemaData);
  });

  return {
    enhancerName: 'ColumnMappingBuilderEnhancer',
    success: true,
  };
}
