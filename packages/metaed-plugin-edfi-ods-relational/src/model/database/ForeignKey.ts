// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  orderByProp,
  Logger,
  NoNamespace,
  DomainEntityProperty,
  AssociationProperty,
  CommonProperty,
} from '@edfi/metaed-core';
import { EntityProperty, PropertyType, Namespace } from '@edfi/metaed-core';
import { ReferencePropertyEdfiOds } from '../property/ReferenceProperty';
import { NoTable, getPrimaryKeys, getColumn } from './Table';
import { ColumnPair, newColumnPair } from './ColumnPair';
import { Table } from './Table';
import { Column } from './Column';
import { ForeignKeyStrategy } from './ForeignKeyStrategy';

export interface ForeignKeySourceReference {
  isPartOfIdentity: boolean;
  isRequired: boolean;
  isOptional: boolean;
  isRequiredCollection: boolean;
  isOptionalCollection: boolean;
  isSubclassRelationship: boolean;
  isExtensionRelationship: boolean;
  isSyntheticRelationship: boolean;
  /** Is this is a FK back to a parent table */
  isSubtableRelationship: boolean;
  isPotentiallyLogical: boolean;
  propertyType: PropertyType;
  isRoleNamed: boolean;

  // For some reason, this is where all of the source columns in the foreign key are part of the parent PK
  isIdentifying: boolean;
}

export type ForeignKeyInfo = {
  foreignKeyColumns: Column[];
  foreignTableSchema: string;
  foreignTableNamespace: Namespace;
  foreignTableId: string;
  strategy: ForeignKeyStrategy;
};

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
    isSubtableRelationship: false,
    isPotentiallyLogical: false,
    propertyType: 'unknown',
    isRoleNamed: false,
    isIdentifying: false,
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
  if (property.type === 'common' && (property as CommonProperty).isExtensionOverride) return true;
  if (isReferenceProperty(property)) {
    return !!(property.data.edfiOdsRelational as ReferencePropertyEdfiOds).odsIsReferenceToExtensionParent;
  }
  return false;
}

export function foreignKeySourceReferenceFrom(
  property: EntityProperty,
  { isSubtableRelationship }: { isSubtableRelationship: boolean },
): ForeignKeySourceReference {
  return {
    isPartOfIdentity: property.isPartOfIdentity,
    isRequired: property.isPartOfIdentity || property.isRequired,
    isOptional: property.isOptional,
    isRequiredCollection: property.isRequiredCollection,
    isOptionalCollection: property.isOptionalCollection,
    isSubclassRelationship: isSubclassRelationship(property),
    isExtensionRelationship: isExtensionRelationship(property),
    isSyntheticRelationship: false,
    isSubtableRelationship,
    isPotentiallyLogical:
      property.type === 'domainEntity' || property.type === 'association'
        ? (property as DomainEntityProperty | AssociationProperty).potentiallyLogical
        : false,
    propertyType: property.type,
    isRoleNamed: property.roleName !== '',
    isIdentifying: false,
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
    Logger.debug(
      `  Attempt to add duplicate column pair: [${columnPair.parentTableColumnId}, ${columnPair.foreignTableColumnId}] on foreign key referencing ${foreignKey.foreignTableSchema}.${foreignKey.foreignTableId} failed.`,
    );
  }
}

export function addColumnPairs(foreignKey: ForeignKey, columnPairs: ColumnPair[]): void {
  columnPairs.forEach((columnPair: ColumnPair) => addColumnPair(foreignKey, columnPair));
}

export function getParentTableColumnIds(foreignKey: ForeignKey, foreignTable: Table | null = null): string[] {
  return getOrderedColumnPairs(foreignKey, foreignTable).map((x: ColumnPair) => x.parentTableColumnId);
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
  { foreignKeyColumns, foreignTableSchema, foreignTableNamespace, foreignTableId, strategy }: ForeignKeyInfo,
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
  foreignKeyInfo: ForeignKeyInfo,
  { isSubtableRelationship }: { isSubtableRelationship: boolean },
): ForeignKey {
  return createForeignKeyInternal(foreignKeySourceReferenceFrom(sourceProperty, { isSubtableRelationship }), foreignKeyInfo);
}

export function createForeignKeyUsingSourceReference(
  sourceReference: ForeignKeySourceReference,
  foreignKeyInfo: ForeignKeyInfo,
): ForeignKey {
  return createForeignKeyInternal(sourceReference, foreignKeyInfo);
}
