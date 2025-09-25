// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { ColumnMetadata } from '../../model/flattening/ColumnMetadata';
import { TableMetadata } from '../../model/flattening/TableMetadata';
import { JsonPath } from '../../model/api-schema/JsonPath';

/**
 * Extract max length for string columns from JSON schema
 */
function extractMaxLength(column: ColumnMetadata, apiSchemaData: EntityApiSchemaData): string | undefined {
  // Look for maxLength in JSON schema
  if (apiSchemaData.jsonSchemaForInsert && column.jsonPath) {
    // This would need to traverse the JSON schema to find maxLength
    // For now, return default values based on common patterns
    if (column.columnName.includes('Id') || column.columnName.includes('Code')) {
      return '60';
    }
    if (column.columnName.includes('Name')) {
      return '255';
    }
    if (column.columnName.includes('Description')) {
      return 'max';
    }
    return '255'; // Default max length
  }
  return undefined;
}

/**
 * Refine a single column's type based on available metadata
 */
function refineColumnType(column: ColumnMetadata, table: TableMetadata, apiSchemaData: EntityApiSchemaData): void {
  // Skip columns that already have refined types
  if (column.columnType !== 'string' && column.columnType !== 'unknown') {
    return;
  }

  const fullJsonPath = column.jsonPath ? `${table.jsonPath}${column.jsonPath}` : '';

  // Check if this is a boolean column
  if (apiSchemaData.booleanJsonPaths?.includes(fullJsonPath as JsonPath)) {
    column.columnType = 'boolean';
    return;
  }

  // Check if this is a numeric column
  if (apiSchemaData.numericJsonPaths?.includes(fullJsonPath as JsonPath)) {
    column.columnType = 'integer';
    return;
  }

  // Check if this is a date column
  if (apiSchemaData.dateJsonPaths?.includes(fullJsonPath as JsonPath)) {
    column.columnType = 'date';
    return;
  }

  // Check if this is a datetime column
  if (apiSchemaData.dateTimeJsonPaths?.includes(fullJsonPath as JsonPath)) {
    column.columnType = 'datetime';
    return;
  }

  // Check decimal properties
  const decimalInfo = apiSchemaData.decimalPropertyValidationInfos?.find((info) => info.path === fullJsonPath);
  if (decimalInfo) {
    column.columnType = 'decimal';
    if (decimalInfo.totalDigits !== undefined) {
      column.precision = decimalInfo.totalDigits.toString();
    }
    if (decimalInfo.decimalPlaces !== undefined) {
      column.scale = decimalInfo.decimalPlaces.toString();
    }
    return;
  }

  // Check if this is a descriptor column
  if (column.columnName.endsWith('Descriptor')) {
    column.columnType = 'descriptor';
    return;
  }

  // Set max length for string columns based on JSON schema
  if (column.columnType === 'string') {
    const maxLength = extractMaxLength(column, apiSchemaData);
    if (maxLength) {
      column.maxLength = maxLength;
    }
  }

  // Map special Ed-Fi types
  if (column.columnName.includes('Year')) {
    column.columnType = 'year';
  } else if (column.columnName.includes('Duration')) {
    column.columnType = 'duration';
  } else if (column.columnName.includes('Time') && !column.columnName.includes('DateTime')) {
    column.columnType = 'time';
  } else if (column.columnName.includes('Percent')) {
    column.columnType = 'percent';
  } else if (column.columnName.includes('Amount') || column.columnName.includes('Cost')) {
    column.columnType = 'currency';
  }
}

/**
 * Recursively refine column types in a table and its children
 */
function refineTableColumnTypes(table: TableMetadata, apiSchemaData: EntityApiSchemaData): void {
  // Refine column types based on JSON paths and property metadata
  table.columns.forEach((column) => {
    refineColumnType(column, table, apiSchemaData);
  });

  // Recursively process child tables
  table.childTables.forEach((childTable) => {
    refineTableColumnTypes(childTable, apiSchemaData);
  });
}

/**
 * Maps abstract column types to database-specific SQL types.
 * Refines column types based on property metadata and validation rules.
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

    // Process columns in all tables
    refineTableColumnTypes(apiSchemaData.flatteningMetadata.table, apiSchemaData);
  });

  return {
    enhancerName: 'SqlTypeMapperEnhancer',
    success: true,
  };
}
