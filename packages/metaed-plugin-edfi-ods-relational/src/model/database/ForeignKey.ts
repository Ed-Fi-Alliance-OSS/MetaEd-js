import R from 'ramda';
import winston from 'winston';
import { orderByProp, asCommonProperty, NoNamespace, DomainEntityProperty, AssociationProperty } from 'metaed-core';
import { EntityProperty, PropertyType, Namespace } from 'metaed-core';
import { ReferencePropertyEdfiOds } from '../property/ReferenceProperty';
import { NoTable, getPrimaryKeys, getColumn } from './Table';
import { ColumnPair, newColumnPair } from './ColumnPair';
import { Table } from './Table';
import { Column } from './Column';
import { ForeignKeyStrategy } from './ForeignKeyStrategy';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

export interface ForeignKeySourceReference {
  isPartOfIdentity: boolean;
  isRequired: boolean;
  isOptional: boolean;
  isRequiredCollection: boolean;
  isOptionalCollection: boolean;
  isSubclassRelationship: boolean;
  isExtensionRelationship: boolean;
  isSyntheticRelationship: boolean;
  isPotentiallyLogical: boolean;
  propertyType: PropertyType;
}

export interface ForeignKey {
  name: string;
  columnPairs: ColumnPair[];
  parentTable: Table;
  foreignTableId: string;
  foreignTableSchema: string;
  foreignTableNamespace: Namespace;
  foreignTable: Table;
  withDeleteCascade: boolean;
  withUpdateCascade: boolean;
  withReverseForeignKeyIndex: boolean;
  sourceReference: ForeignKeySourceReference;
  data: any;
}

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
    isPotentiallyLogical: false,
    propertyType: 'unknown',
  };
}

export function newForeignKey(): ForeignKey {
  return {
    name: '',
    columnPairs: [],
    parentTable: NoTable,
    foreignTableId: '',
    foreignTableSchema: '',
    foreignTableNamespace: NoNamespace,
    foreignTable: NoTable,
    withDeleteCascade: false,
    withUpdateCascade: false,
    withReverseForeignKeyIndex: false,
    sourceReference: newForeignKeySourceReference(),
    data: {},
  };
}

const referenceProperty: PropertyType[] = ['choice', 'common', 'descriptor', 'association', 'domainEntity'];
const isReferenceProperty = (property: EntityProperty): boolean => referenceProperty.includes(property.type);

function isSubclassRelationship(property: EntityProperty): boolean {
  if (isReferenceProperty(property)) {
    return !!(property.data.edfiOdsRelational as ReferencePropertyEdfiOds).odsIsReferenceToSuperclass;
  }
  return false;
}

function isExtensionRelationship(property: EntityProperty): boolean {
  if (property.type === 'common' && asCommonProperty(property).isExtensionOverride) return true;
  if (isReferenceProperty(property)) {
    return !!(property.data.edfiOdsRelational as ReferencePropertyEdfiOds).odsIsReferenceToExtensionParent;
  }
  return false;
}

export function foreignKeySourceReferenceFrom(property: EntityProperty): ForeignKeySourceReference {
  return {
    isPartOfIdentity: property.isPartOfIdentity,
    isRequired: property.isPartOfIdentity || property.isRequired,
    isOptional: property.isOptional,
    isRequiredCollection: property.isRequiredCollection,
    isOptionalCollection: property.isOptionalCollection,
    isSubclassRelationship: isSubclassRelationship(property),
    isExtensionRelationship: isExtensionRelationship(property),
    isSyntheticRelationship: false,
    isPotentiallyLogical:
      property.type === 'domainEntity' || property.type === 'association'
        ? (property as DomainEntityProperty | AssociationProperty).potentiallyLogical
        : false,
    propertyType: property.type,
  };
}

export function getOrderedColumnPairs(foreignKey: ForeignKey, foreignTable: Table | null = null): ColumnPair[] {
  if (foreignTable == null) {
    return orderByProp('foreignTableColumnId')(foreignKey.columnPairs);
  }

  const primaryKeyOrder: string[] = (
    foreignTable.primaryKeys.length === 0 ? getPrimaryKeys(foreignTable) : foreignTable.primaryKeys
  ).map((pk: Column) => pk.columnId);
  const foreignKeyColumnPairLookup: { [foreignKeyName: string]: ColumnPair } = R.groupBy(
    R.prop('foreignTableColumnId'),
    foreignKey.columnPairs,
  );
  // eslint-disable-next-line no-underscore-dangle
  const foreignKeyColumnPairFor: (foreignKeyName: string) => ColumnPair = R.prop(R.__, foreignKeyColumnPairLookup);

  return R.chain((pkName: string) => foreignKeyColumnPairFor(pkName))(primaryKeyOrder);
}

export function addColumnPair(foreignKey: ForeignKey, columnPair: ColumnPair): void {
  const existingPair = foreignKey.columnPairs.find(
    (x: ColumnPair) =>
      x.parentTableColumnId === columnPair.parentTableColumnId && x.foreignTableColumnId === columnPair.foreignTableColumnId,
  );

  if (existingPair == null) {
    foreignKey.columnPairs.push(columnPair);
  } else {
    winston.debug(
      `  Attempt to add duplicate column pair: [${columnPair.parentTableColumnId}, ${columnPair.foreignTableColumnId}] on foreign key referencing ${foreignKey.foreignTableSchema}.${foreignKey.foreignTableId} failed.`,
    );
  }
}

export function addColumnPairs(foreignKey: ForeignKey, columnPairs: ColumnPair[]): void {
  columnPairs.forEach((columnPair: ColumnPair) => addColumnPair(foreignKey, columnPair));
}

export function getParentTableColumnIds(foreignKey: ForeignKey, foreignTable: Table | null = null): string[] {
  const pairs = getOrderedColumnPairs(foreignKey, foreignTable);
  const result = pairs.map((x: ColumnPair) => x.parentTableColumnId);
  return result;
  // return getOrderedColumnPairs(foreignKey, foreignTable).map((x: ColumnPair) => x.parentTableColumnId);
}

export function getParentTableColumns(foreignKey: ForeignKey, foreignTable: Table | null = null): Column[] {
  return getParentTableColumnIds(foreignKey, foreignTable).map((columnId: string) =>
    getColumn(foreignKey.parentTable, columnId),
  );
}

export function getForeignTableColumnIds(foreignKey: ForeignKey, foreignTable: Table | null = null): string[] {
  return getOrderedColumnPairs(foreignKey, foreignTable).map((x: ColumnPair) => x.foreignTableColumnId);
}

export function getForeignTableColumns(foreignKey: ForeignKey, foreignTable: Table | null = null): Column[] {
  return getForeignTableColumnIds(foreignKey, foreignTable).map((columnId: string) =>
    getColumn(foreignKey.foreignTable, columnId),
  );
}

function createForeignKeyInternal(
  sourceReference: ForeignKeySourceReference,
  foreignKeyColumns: Column[],
  foreignTableSchema: string,
  foreignTableNamespace: Namespace,
  foreignTableId: string,
  strategy: ForeignKeyStrategy,
): ForeignKey {
  const foreignKey: ForeignKey = {
    ...newForeignKey(),
    foreignTableSchema,
    foreignTableId,
    foreignTableNamespace,
    withDeleteCascade: strategy.hasDeleteCascade(),
    withUpdateCascade: strategy.hasUpdateCascade(),
    sourceReference,
  };

  foreignKeyColumns.forEach((column) =>
    addColumnPair(foreignKey, {
      ...newColumnPair(),
      parentTableColumnId: strategy.parentColumnId(column),
      foreignTableColumnId: strategy.foreignColumnId(column),
    }),
  );

  return foreignKey;
}

export function createForeignKey(
  sourceProperty: EntityProperty,
  foreignKeyColumns: Column[],
  foreignTableSchema: string,
  foreignTableNamespace: Namespace,
  foreignTableId: string,
  strategy: ForeignKeyStrategy,
): ForeignKey {
  return createForeignKeyInternal(
    foreignKeySourceReferenceFrom(sourceProperty),
    foreignKeyColumns,
    foreignTableSchema,
    foreignTableNamespace,
    foreignTableId,
    strategy,
  );
}

export function createForeignKeyUsingSourceReference(
  sourceReference: ForeignKeySourceReference,
  foreignKeyColumns: Column[],
  foreignTableSchema: string,
  foreignTableNamespace: Namespace,
  foreignTableId: string,
  strategy: ForeignKeyStrategy,
): ForeignKey {
  return createForeignKeyInternal(
    sourceReference,
    foreignKeyColumns,
    foreignTableSchema,
    foreignTableNamespace,
    foreignTableId,
    strategy,
  );
}
