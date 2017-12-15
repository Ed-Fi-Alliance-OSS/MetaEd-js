// @flow
import winston from 'winston';
import { orderByProp } from 'metaed-core';
import { NoTable } from './Table';
import type { ColumnNamePair } from './ColumnNamePair';
import type { Table } from './Table';

winston.cli();

export type ForeignKey = {
  columnNames: Array<ColumnNamePair>;
  parentTable: Table;
  parentTableName: string;
  parentTableSchema: string;
  foreignTableName: string;
  foreignTableSchema: string;
  foreignKeyNameSuffix: string;
  parentTableColumnNames: Array<string>;
  foreignTableColumnNames: Array<string>;
  withDeleteCascade: boolean;
  withUpdateCascade: boolean;
  withReverseForeignKeyIndex: boolean;
  name: string;
}

export function newForeignKey(): ForeignKey {
  return {
    name: '',
    columnNames: [],
    parentTable: NoTable,
    parentTableName: '',
    parentTableSchema: '',
    foreignTableName: '',
    foreignTableSchema: '',
    foreignKeyNameSuffix: '',
    parentTableColumnNames: [],
    foreignTableColumnNames: [],
    withDeleteCascade: false,
    withUpdateCascade: false,
    withReverseForeignKeyIndex: false,
  };
}

export function getParentTableColumnNames(foreignKey: ForeignKey): Array<string> {
  return orderByProp('parentTableColumnName')(foreignKey.columnNames).map((x: ColumnNamePair) => x.parentTableColumnName);
}

export function getForeignTableColumnNames(foreignKey: ForeignKey): Array<string> {
  return orderByProp('foreignTableColumnName')(foreignKey.columnNames).map((x: ColumnNamePair) => x.foreignTableColumnName);
}

export function addColumnNamePair(foreignKey: ForeignKey, columnNamePair: ColumnNamePair): void {
  const existingPair = foreignKey.columnNames.find((x: ColumnNamePair) =>
    x.parentTableColumnName === columnNamePair.parentTableColumnName
    && x.foreignTableColumnName === columnNamePair.foreignTableColumnName);

  if (existingPair == null) {
    foreignKey.columnNames.push(columnNamePair);
  } else {
    winston.warn(
      `Attempt to add duplicate column name pair: [${columnNamePair.parentTableColumnName}, ${
      columnNamePair.foreignTableColumnName}] on foreign key referencing ${
      foreignKey.foreignTableSchema}.${foreignKey.foreignTableName} failed.`,
    );
  }
}

export function addColumnNamePairs(foreignKey: ForeignKey, columnNamePairs: Array<ColumnNamePair>): void {
  columnNamePairs.forEach((columnNamePair: ColumnNamePair) => addColumnNamePair(foreignKey, columnNamePair));
}
