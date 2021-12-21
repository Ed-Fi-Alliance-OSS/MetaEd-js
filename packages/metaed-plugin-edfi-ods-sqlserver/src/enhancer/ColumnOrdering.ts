import { orderByPath } from 'metaed-core';
import { Table, getNonPrimaryKeys, Column } from 'metaed-plugin-edfi-ods-relational';

export function hasAlternateKeys(table: Table): boolean {
  return table.columns.some((x) => x.isPartOfAlternateKey);
}

export function getAlternateKeys(table: Table): Column[] {
  return orderByPath(['data', 'edfiOdsSqlServer', 'columnName'])(table.columns.filter((x) => x.isPartOfAlternateKey));
}

export function getUniqueIndexes(table: Table): Column[] {
  return orderByPath(['data', 'edfiOdsSqlServer', 'columnName'])(table.columns.filter((x) => x.isUniqueIndex));
}

export function getPrimaryKeys(table: Table): Column[] {
  return orderByPath(['data', 'edfiOdsSqlServer', 'columnName'])(table.columns.filter((x) => x.isPartOfPrimaryKey));
}

export function getAllColumns(table: Table): Column[] {
  return [...getPrimaryKeys(table), ...getNonPrimaryKeys(table)];
}
