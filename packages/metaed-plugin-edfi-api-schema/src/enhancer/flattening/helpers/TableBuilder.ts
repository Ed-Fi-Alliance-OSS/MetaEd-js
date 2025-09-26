// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { TopLevelEntity } from '@edfi/metaed-core';
import type { TableMetadata } from '../../../model/flattening/TableMetadata';
import type { JsonPath } from '../../../model/api-schema/JsonPath';

export type TableBaseName = string & { readonly tableBaseNameBrand: unique symbol };
export type TableDiscriminator = string & { readonly tableDiscriminatorBrand: unique symbol };

function isExtensionEntity(entity: TopLevelEntity): boolean {
  return entity.type === 'domainEntityExtension' || entity.type === 'associationExtension';
}

function deriveExtensionBaseName(entity: TopLevelEntity): TableBaseName {
  const baseEntity = entity.baseEntity;
  if (baseEntity) {
    return `${baseEntity.metaEdName}Extension` as TableBaseName;
  }

  return `${entity.metaEdName}Extension` as TableBaseName;
}

function deriveRootBaseName(entity: TopLevelEntity): TableBaseName {
  if (isExtensionEntity(entity)) {
    return deriveExtensionBaseName(entity);
  }

  return entity.metaEdName as TableBaseName;
}

/**
 * Create the root table metadata object for a resource.
 */
export function createRootTable(entity: TopLevelEntity, discriminatorValue?: TableDiscriminator): TableMetadata {
  const baseName = deriveRootBaseName(entity);
  const isExtensionTable = isExtensionEntity(entity);

  return {
    baseName,
    jsonPath: '$',
    columns: [],
    childTables: [],
    ...(isExtensionTable ? { isExtensionTable: true } : {}),
    ...(discriminatorValue ? { discriminatorValue } : {}),
  };
}

/**
 * Create metadata for a child table that represents a collection.
 */
export function createChildTable(
  baseName: TableBaseName,
  jsonPath: JsonPath,
  isExtensionTable = false,
  discriminatorValue?: TableDiscriminator,
): TableMetadata {
  return {
    baseName,
    jsonPath,
    columns: [],
    childTables: [],
    ...(isExtensionTable ? { isExtensionTable: true } : {}),
    ...(discriminatorValue ? { discriminatorValue } : {}),
  };
}

/**
 * Append a child table to the supplied parent while preserving immutability.
 */
export function appendChildTable(parent: TableMetadata, child: TableMetadata): TableMetadata {
  return {
    ...parent,
    childTables: [...parent.childTables, child],
  };
}

/**
 * Deep clone a table structure to protect against accidental mutation.
 */
export function cloneTable(table: TableMetadata): TableMetadata {
  return {
    ...table,
    columns: table.columns.map((column) => ({ ...column })),
    childTables: table.childTables.map(cloneTable),
  };
}
