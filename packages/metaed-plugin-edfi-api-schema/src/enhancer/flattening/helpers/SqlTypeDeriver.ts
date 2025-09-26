// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { SchemaProperty, SchemaRoot } from '../../../model/JsonSchema';
import type { ColumnMetadata } from '../../../model/flattening/ColumnMetadata';
import type { ColumnType } from '../../../model/flattening/ColumnType';
import type { EntityApiSchemaData } from '../../../model/EntityApiSchemaData';
import type { DecimalPropertyValidationInfo } from '../../../model/api-schema/DecimalPropertyValidationInfo';

/**
 * Resolve the absolute JSON path for a column given the containing table path.
 */
export function resolveAbsoluteJsonPath(tableJsonPath: string, columnJsonPath?: string): string {
  if (!columnJsonPath) {
    return tableJsonPath;
  }

  if (columnJsonPath.startsWith('$')) {
    return columnJsonPath;
  }

  if (columnJsonPath.startsWith('.')) {
    return `${tableJsonPath}${columnJsonPath}`;
  }

  return `${tableJsonPath}.${columnJsonPath}`;
}

/**
 * Locate decimal validation information for the supplied JSON path.
 */
function findDecimalInfo(
  infos: DecimalPropertyValidationInfo[] | undefined,
  path: string,
): DecimalPropertyValidationInfo | undefined {
  return infos?.find((info) => String(info.path) === path);
}

/**
 * Traverse the JSON schema to find the property definition for a path.
 */
function findSchemaProperty(
  schema: SchemaRoot | SchemaProperty | undefined,
  absolutePath: string,
): SchemaProperty | undefined {
  if (!schema) {
    return undefined;
  }

  const trimmedPath = absolutePath.replace(/^\$\.?/, '');
  if (trimmedPath.length === 0) {
    return schema;
  }

  const segments = trimmedPath.split('.');
  let current: SchemaProperty | undefined = schema;

  for (const segment of segments) {
    if (!current) {
      return undefined;
    }

    if (current.type !== 'object' && current.type !== 'array') {
      return undefined;
    }

    const isArray = segment.endsWith('[*]');
    const propertyName = isArray ? segment.slice(0, -3) : segment;

    if (current.type === 'object') {
      const next = current.properties?.[propertyName];
      if (!next) {
        return undefined;
      }

      if (isArray) {
        if (next.type !== 'array') {
          return undefined;
        }
        current = next.items;
        continue;
      }

      current = next;
      continue;
    }

    if (!isArray) {
      return undefined;
    }

    current = current.items;
  }

  return current;
}

/**
 * Map a JSON schema property definition to a column type representation.
 */
function mapSchemaPropertyToColumnType(schemaProperty: SchemaProperty | undefined):
  | {
      columnType: ColumnType;
      maxLength?: string;
    }
  | undefined {
  if (!schemaProperty) {
    return undefined;
  }

  if (schemaProperty.type === 'string') {
    if (schemaProperty.format === 'date') {
      return { columnType: 'date' };
    }
    if (schemaProperty.format === 'date-time') {
      return { columnType: 'datetime' };
    }
    if (schemaProperty.format === 'time') {
      return { columnType: 'time' };
    }

    const result: { columnType: ColumnType; maxLength?: string } = { columnType: 'string' };

    if (schemaProperty.maxLength != null) {
      result.maxLength = schemaProperty.maxLength.toString();
    }

    return result;
  }

  if (schemaProperty.type === 'integer') {
    return { columnType: 'integer' };
  }

  if (schemaProperty.type === 'number') {
    return { columnType: 'decimal' };
  }

  if (schemaProperty.type === 'boolean') {
    return { columnType: 'boolean' };
  }

  return undefined;
}

/**
 * Type information derived for a column including precision metadata.
 */
export type DerivedTypeInfo = {
  columnType: ColumnType;
  maxLength?: string;
  precision?: string;
  scale?: string;
};

/**
 * Derive column type information based on the supplied ApiSchema data and column metadata.
 */
export function deriveTypeInfo(
  apiSchemaData: EntityApiSchemaData,
  tableJsonPath: string,
  column: ColumnMetadata,
): DerivedTypeInfo | undefined {
  const absolutePath = resolveAbsoluteJsonPath(tableJsonPath, column.jsonPath);

  const decimalInfo = findDecimalInfo(apiSchemaData.decimalPropertyValidationInfos, absolutePath);
  if (decimalInfo) {
    const result: DerivedTypeInfo = { columnType: 'decimal' };

    if (decimalInfo.totalDigits != null) {
      result.precision = decimalInfo.totalDigits.toString();
    }

    if (decimalInfo.decimalPlaces != null) {
      result.scale = decimalInfo.decimalPlaces.toString();
    }

    return result;
  }

  const booleanPaths = new Set((apiSchemaData.booleanJsonPaths ?? []).map((value) => String(value)));
  if (booleanPaths.has(absolutePath)) {
    return { columnType: 'boolean' };
  }

  const datePaths = new Set((apiSchemaData.dateJsonPaths ?? []).map((value) => String(value)));
  if (datePaths.has(absolutePath)) {
    return { columnType: 'date' };
  }

  const dateTimePaths = new Set((apiSchemaData.dateTimeJsonPaths ?? []).map((value) => String(value)));
  if (dateTimePaths.has(absolutePath)) {
    return { columnType: 'datetime' };
  }

  const numericPaths = new Set((apiSchemaData.numericJsonPaths ?? []).map((value) => String(value)));
  if (numericPaths.has(absolutePath)) {
    return { columnType: 'integer' };
  }

  const schemaProperty = findSchemaProperty(apiSchemaData.jsonSchemaForInsert, absolutePath);
  const schemaResult = mapSchemaPropertyToColumnType(schemaProperty);
  if (schemaResult) {
    return schemaResult;
  }

  return undefined;
}
