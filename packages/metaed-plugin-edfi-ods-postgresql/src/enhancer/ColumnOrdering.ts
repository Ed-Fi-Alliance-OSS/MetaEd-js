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

export function getPrimaryKeys(table: Table): Column[] {
  return orderByPath(['data', 'edfiOdsPostgresql', 'columnName'])(table.columns.filter((x) => x.isPartOfPrimaryKey));
}

export function getAllColumns(table: Table): Column[] {
  return [...getPrimaryKeys(table), ...getNonPrimaryKeys(table)];
}
