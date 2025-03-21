// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { orderByPath } from '@edfi/metaed-core';
import { Table, getNonPrimaryKeys, Column } from '@edfi/metaed-plugin-edfi-ods-relational';

export function hasAlternateKeys(table: Table): boolean {
  return table.columns.some((x) => x.isPartOfAlternateKey);
}

export function getAlternateKeys(table: Table): Column[] {
  if (
    table.includeComputedDescriptorUriColumn &&
    table.tableId.toLowerCase() === 'descriptor' &&
    table.columns.some((x) => x.isPartOfAlternateKey && x.columnId.toLowerCase() === 'namespace')
  ) {
    const namespaceColumn = table.columns.filter((x) => x.isPartOfAlternateKey && x.columnId.toLowerCase() === 'namespace');
    const alternativeKeyColumns = orderByPath(['data', 'edfiOdsPostgresql', 'columnName'])(
      table.columns.filter((x) => x.isPartOfAlternateKey && x.columnId.toLowerCase() !== 'namespace'),
    );
    return namespaceColumn.concat(alternativeKeyColumns);
  }
  return orderByPath(['data', 'edfiOdsPostgresql', 'columnName'])(table.columns.filter((x) => x.isPartOfAlternateKey));
}

export function getUniqueIndexes(table: Table): Column[] {
  return orderByPath(['data', 'edfiOdsPostgresql', 'columnName'])(table.columns.filter((x) => x.isUniqueIndex));
}

export function getPrimaryKeysV6dot1(table: Table): Column[] {
  return orderByPath(['data', 'edfiOdsPostgresql', 'columnName'])(table.columns.filter((x) => x.isPartOfPrimaryKey));
}

export function getPrimaryKeys(table: Table): Column[] {
  return table.columns.filter((x) => x.isPartOfPrimaryKey);
}

export function getAllColumnsV6dot1(table: Table): Column[] {
  return [...getPrimaryKeysV6dot1(table), ...getNonPrimaryKeys(table)];
}

export function getAllColumns(table: Table): Column[] {
  return [...getPrimaryKeys(table), ...getNonPrimaryKeys(table)];
}
