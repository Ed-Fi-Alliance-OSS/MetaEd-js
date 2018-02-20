// @flow
import R from 'ramda';
import winston from 'winston';
import { orderByProp, isReferenceProperty } from 'metaed-core';
import type { EntityProperty, PropertyType } from 'metaed-core';
import type { ReferencePropertyEdfiOds } from '../property/ReferenceProperty';
import { NoTable, getPrimaryKeys } from './Table';
import type { ColumnNamePair } from './ColumnNamePair';
import type { Table } from './Table';
import type { Column } from './Column';

winston.cli();

export type ForeignKeySourceReference = {
  isPartOfIdentity: boolean,
  isRequired: boolean,
  isOptional: boolean,
  isRequiredCollection: boolean,
  isOptionalCollection: boolean,
  isSubclassRelationship: boolean,
  isExtensionRelationship: boolean,
  isSyntheticRelationship: boolean,
  propertyType: PropertyType,
};

export type ForeignKey = {
  name: string,
  columnNames: Array<ColumnNamePair>,
  parentTable: Table,
  parentTableName: string,
  parentTableSchema: string,
  foreignTableName: string,
  foreignTableSchema: string,
  foreignKeyNameSuffix: string,
  parentTableColumnNames: Array<string>,
  foreignTableColumnNames: Array<string>,
  withDeleteCascade: boolean,
  withUpdateCascade: boolean,
  withReverseForeignKeyIndex: boolean,
  sourceReference: ForeignKeySourceReference,
};

export function newForeignKeySourceReference(): ForeignKeySourceReference {
  return {
    isPartOfIdentity: false,
    isRequired: false,
    isOptional: false,
    isRequiredCollection: false,
    isOptionalCollection: false,
    isSubclassRelationship: false,
    isExtensionRelationship: false,
    isSyntheticRelationship: false,
    propertyType: 'unknown',
  };
}

export function foreignKeySourceReferenceFrom(property: EntityProperty): ForeignKeySourceReference {
  return {
    isPartOfIdentity: property.isPartOfIdentity,
    isRequired: property.isPartOfIdentity || property.isRequired,
    isOptional: property.isOptional,
    isRequiredCollection: property.isRequiredCollection,
    isOptionalCollection: property.isOptionalCollection,
    isSubclassRelationship: isReferenceProperty(property)
      ? ((property.data.edfiOds: any): ReferencePropertyEdfiOds).ods_IsReferenceToSuperclass
      : false,
    isExtensionRelationship: isReferenceProperty(property)
      ? ((property.data.edfiOds: any): ReferencePropertyEdfiOds).ods_IsReferenceToExtensionParent
      : false,
    isSyntheticRelationship: false,
    propertyType: property.type,
  };
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
    sourceReference: newForeignKeySourceReference(),
  };
}

export function getOrderedColumnNamePairs(foreignKey: ForeignKey, foreignTable: ?Table = null): Array<ColumnNamePair> {
  if (foreignTable == null) {
    return orderByProp('foreignTableColumnName')(foreignKey.columnNames);
  }

  const primaryKeyOrder: Array<string> = (foreignTable.primaryKeys.length === 0
    ? getPrimaryKeys(foreignTable)
    : foreignTable.primaryKeys
  ).map((pk: Column) => pk.name);
  const foreignKeyColumnPairLookup: { [foreignKeyName: string]: ColumnNamePair } = R.groupBy(
    R.prop('foreignTableColumnName'),
    foreignKey.columnNames,
  );
  const foreignKeyColumnPairFor: (foreignKeyName: string) => ColumnNamePair = R.prop(R.__, foreignKeyColumnPairLookup);

  return R.chain((pkName: string) => foreignKeyColumnPairFor(pkName))(primaryKeyOrder);
}

export function getParentTableColumnNames(foreignKey: ForeignKey, foreignTable: ?Table = null): Array<string> {
  return getOrderedColumnNamePairs(foreignKey, foreignTable).map((x: ColumnNamePair) => x.parentTableColumnName);
}

export function getForeignTableColumnNames(foreignKey: ForeignKey, foreignTable: ?Table = null): Array<string> {
  return getOrderedColumnNamePairs(foreignKey, foreignTable).map((x: ColumnNamePair) => x.foreignTableColumnName);
}

export function addColumnNamePair(foreignKey: ForeignKey, columnNamePair: ColumnNamePair): void {
  const existingPair = foreignKey.columnNames.find(
    (x: ColumnNamePair) =>
      x.parentTableColumnName === columnNamePair.parentTableColumnName &&
      x.foreignTableColumnName === columnNamePair.foreignTableColumnName,
  );

  if (existingPair == null) {
    foreignKey.columnNames.push(columnNamePair);
  } else {
    winston.warn(
      `  Attempt to add duplicate column name pair: [${columnNamePair.parentTableColumnName}, ${
        columnNamePair.foreignTableColumnName
      }] on foreign key referencing ${foreignKey.foreignTableSchema}.${foreignKey.foreignTableName} failed.`,
    );
  }
}

export function addColumnNamePairs(foreignKey: ForeignKey, columnNamePairs: Array<ColumnNamePair>): void {
  columnNamePairs.forEach((columnNamePair: ColumnNamePair) => addColumnNamePair(foreignKey, columnNamePair));
}
