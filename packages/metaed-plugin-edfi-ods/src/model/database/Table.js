// @flow
import R from 'ramda';
import winston from 'winston';
import { orderByProp, NoTopLevelEntity } from 'metaed-core';
import type { TopLevelEntity, EntityProperty } from 'metaed-core';
import { columnConstraintMerge, cloneColumn } from './Column';
import { addColumnNamePair, newForeignKey, foreignKeySourceReferenceFrom } from './ForeignKey';
import { newColumnNamePair } from './ColumnNamePair';
import type { Column } from './Column';
import type { ColumnTransform } from './ColumnTransform';
import type { ForeignKey, ForeignKeySourceReference } from './ForeignKey';
import type { ForeignKeyStrategy } from './ForeignKeyStrategy';

winston.cli();

const maxSqlServerIdentifierLength = R.take(128);

export type Table = {
  name: string,
  schema: string,
  type: string,
  description: string,
  sqlEscapedDescription: string,
  typeHumanizedName: string,
  typeHumanizedNameWithIndefiniteArticle: string,
  includeCreateDateColumn: boolean,
  includeLastModifiedDateAndIdColumn: boolean,
  isRequiredCollectionTable: boolean,
  isTypeTable: boolean,
  hasAlternateKeys: boolean,
  columns: Array<Column>,
  primaryKeys: Array<Column>,
  foreignKeys: Array<ForeignKey>,
  alternateKeys: Array<Column>,
  uniqueIndexes: Array<Column>,
  // only main tables have a parentEntity
  parentEntity: TopLevelEntity,
};

export function newTable(): Table {
  return {
    name: '',
    schema: '',
    type: 'table',
    description: '',
    sqlEscapedDescription: '',
    typeHumanizedName: 'Table',
    typeHumanizedNameWithIndefiniteArticle: 'A Table',
    includeCreateDateColumn: false,
    includeLastModifiedDateAndIdColumn: false,
    isRequiredCollectionTable: false,
    isTypeTable: false,
    hasAlternateKeys: false,
    columns: [],
    primaryKeys: [],
    foreignKeys: [],
    alternateKeys: [],
    uniqueIndexes: [],
    parentEntity: NoTopLevelEntity,
  };
}

export const NoTable: Table = Object.assign(newTable(), {
  name: 'NoTable',
});

export function getColumnWithStrongestConstraint(
  table: Table,
  column: Column,
  constraintStrategy: (existing: Column, received: Column) => Column,
): Column {
  const existingColumn = table.columns.find(x => x.name === column.name);
  if (existingColumn == null) return column;

  winston.warn(`  Duplicate column ${column.name} on table ${table.name}.`);
  table.columns = R.reject(x => x.name === column.name)(table.columns);
  return constraintStrategy(existingColumn, column);
}

export function hasAlternateKeys(table: Table): boolean {
  return table.columns.some(x => x.isPartOfAlternateKey);
}

// AddColumnStrongestConstraint()
export function addColumn(table: Table, column: Column): void {
  const clone: Column = getColumnWithStrongestConstraint(table, column, columnConstraintMerge);
  table.columns.push(clone);
}

export function addColumns(table: Table, columns: Array<Column>, strategy: ColumnTransform): void {
  strategy.transform(columns).forEach(column => addColumn(table, column));
}

export function getAlternateKeys(table: Table): Array<Column> {
  return orderByProp('name')(table.columns.filter(x => x.isPartOfAlternateKey));
}

export function getPrimaryKeys(table: Table): Array<Column> {
  return orderByProp('name')(table.columns.filter(x => x.isPartOfPrimaryKey));
}

export function getNonPrimaryKeys(table: Table): Array<Column> {
  return table.columns.filter(x => !x.isPartOfPrimaryKey);
}

export function getUniqueIndexes(table: Table): Array<Column> {
  return orderByProp('name')(table.columns.filter(x => x.isUniqueIndex));
}

export function getAllColumns(table: Table): Array<Column> {
  return [...getPrimaryKeys(table), ...getNonPrimaryKeys(table)];
}

export function getColumnView(table: Table): Array<Column> {
  return getAllColumns(table).map(x => cloneColumn(x));
}

export function getForeignKeys(table: Table): Array<ForeignKey> {
  return orderByProp('name')(table.foreignKeys);
}

export function isForeignKey(table: Table, column: Column): boolean {
  return table.foreignKeys.some(fk => fk.columnNames.some(x => x.parentTableColumnName === column.name));
}

export function getForeignKeyName(foreignKey: ForeignKey): string {
  return maxSqlServerIdentifierLength(
    `FK_${foreignKey.parentTableName}_${foreignKey.foreignTableName}${foreignKey.foreignKeyNameSuffix}`,
  );
}

function getForeignKeyNameSuffix(table: Table, foreignKey: ForeignKey): string {
  if (table.foreignKeys.some((fk: ForeignKey) => getForeignKeyName(fk) === getForeignKeyName(foreignKey))) {
    return R.compose(
      R.toString,
      R.inc,
      R.when(R.isNil, () => 0),
      R.head,
      R.sort((a, b) => b - a),
      R.map(x => x.foreignKeyNameSuffix),
      R.filter(x => x.foreignTableName === foreignKey.foreignTableName),
    )(table.foreignKeys);
  }
  return '';
}

export function addForeignKey(table: Table, foreignKey: ForeignKey): void {
  foreignKey.parentTable = table;
  foreignKey.parentTableName = table.name;
  foreignKey.parentTableSchema = table.schema;
  foreignKey.foreignKeyNameSuffix = getForeignKeyNameSuffix(table, foreignKey);
  table.foreignKeys.push(foreignKey);
}

function createForeignKeyInternal(
  sourceReference: ForeignKeySourceReference,
  foreignKeyColumns: Array<Column>,
  foreignTableSchema: string,
  foreignTableName: string,
  strategy: ForeignKeyStrategy,
): ForeignKey {
  const foreignKey: ForeignKey = Object.assign(newForeignKey(), {
    foreignTableSchema,
    foreignTableName,
    withDeleteCascade: strategy.hasDeleteCascade(),
    withUpdateCascade: strategy.hasUpdateCascade(),
    sourceReference,
  });
  foreignKeyColumns.forEach(column =>
    addColumnNamePair(
      foreignKey,
      Object.assign(newColumnNamePair(), {
        parentTableColumnName: strategy.parentColumnName(column),
        foreignTableColumnName: strategy.foreignColumnName(column),
      }),
    ),
  );

  return foreignKey;
}

export function createForeignKey(
  sourceProperty: EntityProperty,
  foreignKeyColumns: Array<Column>,
  foreignTableSchema: string,
  foreignTableName: string,
  strategy: ForeignKeyStrategy,
): ForeignKey {
  return createForeignKeyInternal(
    foreignKeySourceReferenceFrom(sourceProperty),
    foreignKeyColumns,
    foreignTableSchema,
    foreignTableName,
    strategy,
  );
}

export function createForeignKeyUsingSourceReference(
  sourceReference: ForeignKeySourceReference,
  foreignKeyColumns: Array<Column>,
  foreignTableSchema: string,
  foreignTableName: string,
  strategy: ForeignKeyStrategy,
): ForeignKey {
  return createForeignKeyInternal(sourceReference, foreignKeyColumns, foreignTableSchema, foreignTableName, strategy);
}
