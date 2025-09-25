// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BrandType, MetaEdPropertyFullName } from '@edfi/metaed-core';
import type { ColumnMetadata } from '../../../model/flattening/ColumnMetadata';
import type { ColumnType } from '../../../model/flattening/ColumnType';
import type { TableBaseName } from './TableBuilder';

export type ColumnName = BrandType<string, 'ColumnName'>;
export type ColumnJsonPath = BrandType<string, 'ColumnJsonPath'>;
export type ColumnMaxLength = BrandType<string, 'ColumnMaxLength'>;
export type DecimalPrecision = BrandType<string, 'DecimalPrecision'>;
export type DecimalScale = BrandType<string, 'DecimalScale'>;
export type ColumnPolymorphicType = BrandType<string, 'ColumnPolymorphicType'>;

/**
 * Cast a value to a branded column name.
 */
export function toColumnName(value: string): ColumnName {
  return value as ColumnName;
}

/**
 * Cast a value to a branded column JSON path.
 */
export function toColumnJsonPath(value: string): ColumnJsonPath {
  return value as ColumnJsonPath;
}

/**
 * Cast a value to a branded column max length.
 */
export function toColumnMaxLength(value: string): ColumnMaxLength {
  return value as ColumnMaxLength;
}

/**
 * Cast a value to a branded decimal precision.
 */
export function toDecimalPrecision(value: string): DecimalPrecision {
  return value as DecimalPrecision;
}

/**
 * Cast a value to a branded decimal scale.
 */
export function toDecimalScale(value: string): DecimalScale {
  return value as DecimalScale;
}

/**
 * Cast a value to a branded polymorphic type identifier.
 */
export function toColumnPolymorphicType(value: string): ColumnPolymorphicType {
  return value as ColumnPolymorphicType;
}

function createColumn(
  columnName: ColumnName,
  columnType: ColumnType = 'unknown',
  columnJsonPath?: ColumnJsonPath,
  isRequired?: boolean,
  isNaturalKey?: boolean,
  isParentReference?: boolean,
  fromReferencePath?: MetaEdPropertyFullName,
  isPolymorphicReference?: boolean,
  polymorphicType?: ColumnPolymorphicType,
  isDiscriminator?: boolean,
  maxLength?: ColumnMaxLength,
  precision?: DecimalPrecision,
  scale?: DecimalScale,
  isSuperclassIdentity?: boolean,
): ColumnMetadata {
  const metadata: ColumnMetadata = {
    columnName: columnName as string,
    columnType,
    ...(columnJsonPath ? { jsonPath: columnJsonPath as string } : {}),
    ...(isRequired != null ? { isRequired } : {}),
    ...(isNaturalKey ? { isNaturalKey: true } : {}),
    ...(isParentReference ? { isParentReference: true } : {}),
    ...(fromReferencePath ? { fromReferencePath: fromReferencePath as string } : {}),
    ...(isPolymorphicReference ? { isPolymorphicReference: true } : {}),
    ...(polymorphicType ? { polymorphicType: polymorphicType as string } : {}),
    ...(isDiscriminator ? { isDiscriminator: true } : {}),
    ...(maxLength ? { maxLength: maxLength as string } : {}),
    ...(precision ? { precision: precision as string } : {}),
    ...(scale ? { scale: scale as string } : {}),
    ...(isSuperclassIdentity ? { isSuperclassIdentity: true } : {}),
  };

  return metadata;
}

/**
 * Create a column representing a natural identity element of a table.
 */
export function createIdentityColumn(jsonPath: ColumnJsonPath, columnName: ColumnName): ColumnMetadata {
  return createColumn(columnName, 'unknown', jsonPath, true, true);
}

/**
 * Create a column for a scalar property mapped from the API schema.
 */
export function createScalarColumn(jsonPath: ColumnJsonPath, columnName: ColumnName, isRequired: boolean): ColumnMetadata {
  return createColumn(columnName, 'unknown', jsonPath, isRequired);
}

/**
 * Create a surrogate key column that references the parent table.
 */
export function createParentReferenceColumn(parentTableName: TableBaseName): ColumnMetadata {
  const columnName = toColumnName(`${parentTableName as string}_Id`);
  return createColumn(columnName, 'bigint', undefined, true, false, true);
}

/**
 * Create metadata for a column that references another resource.
 */
export function createReferenceColumn(
  columnName: ColumnName,
  fromReferencePath: MetaEdPropertyFullName,
  isRequired: boolean,
  isPolymorphicReference?: boolean,
  polymorphicType?: ColumnPolymorphicType,
): ColumnMetadata {
  return createColumn(
    columnName,
    'bigint',
    undefined,
    isRequired,
    false,
    false,
    fromReferencePath,
    isPolymorphicReference,
    polymorphicType,
  );
}

/**
 * Create metadata for a descriptor column stored inline on the table.
 */
export function createDescriptorColumn(
  jsonPath: ColumnJsonPath,
  columnName: ColumnName,
  isRequired: boolean,
  maxLength?: ColumnMaxLength,
): ColumnMetadata {
  return createColumn(columnName, 'descriptor', jsonPath, isRequired, false, false, undefined, false, undefined, false, maxLength);
}

/**
 * Create a generic column, primarily useful for tests.
 */
export function createColumnMetadata(
  columnName: ColumnName,
  columnType: ColumnType,
  columnJsonPath?: ColumnJsonPath,
): ColumnMetadata {
  return createColumn(columnName, columnType, columnJsonPath);
}
