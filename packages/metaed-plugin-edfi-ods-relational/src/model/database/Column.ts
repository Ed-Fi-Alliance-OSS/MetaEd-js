// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import * as R from 'ramda';
import { EntityProperty, Logger, MetaEdPropertyPath, TopLevelEntity, isReferentialProperty } from '@edfi/metaed-core';
import { ColumnType } from './ColumnType';
import { NoTable, Table } from './Table';

/** A single component of the name of the column used by dependent plugins to construct the actual name */
export interface ColumnNameComponent {
  /** the string name component itself */
  name: string;
  /** is the source of the name component a property 'shorten to' directive */
  isShortenToRename: boolean;
  /** is the source of the name component a property 'role name' directive */
  isPropertyRoleName: boolean;
  /** is the source of the name component a MetaEdName */
  isMetaEdName: boolean;
  /** is the source of the name component derived from a MetaEdName (e.g. MetaEdName plus 'Descriptor' suffix for a Descriptor entity) */
  isDerivedFromMetaEdName: boolean;
  /** is the source of the name component a property 'role name' or 'shorten to' directive from further up the chain */
  isParentPropertyContext: boolean;
  /** is the source of the name component hardcoded and/or made up from somewhere */
  isSynthetic: boolean;
  /** the source property for the name component, if applicable */
  sourceProperty?: EntityProperty;
  /** the source entity for the name component, if applicable */
  sourceEntity?: TopLevelEntity;
}

export function newColumnNameComponent(): ColumnNameComponent {
  return {
    name: '',
    isShortenToRename: false,
    isPropertyRoleName: false,
    isMetaEdName: false,
    isDerivedFromMetaEdName: false,
    isParentPropertyContext: false,
    isSynthetic: false,
  };
}

export interface ColumnNaming {
  columnId: string;
  nameComponents: ColumnNameComponent[];
}

export interface Column {
  // new stuff here
  nameComponents: ColumnNameComponent[];
  parentTable: Table;
  /** The string identifier for the column, independent of the column name */
  columnId: string;

  /**
   * The dot-separated MetaEd property path that leads to the creation of this column.
   * Empty string if this is a synthetic column.
   */
  propertyPath: MetaEdPropertyPath;

  /**
   * The TopLevelEntity this column comes from, or null if this is a synthetic column.
   */
  originalEntity: TopLevelEntity | null;

  type: ColumnType;
  referenceContext: string;
  description: string;
  sqlEscapedDescription: string;
  originalContextPrefix: string;
  isNullable: boolean;
  isPartOfPrimaryKey: boolean;
  isPartOfAlternateKey: boolean;
  isUniqueIndex: boolean;
  isIdentityDatabaseType: boolean;
  sourceEntityProperties: EntityProperty[];
  mergedReferenceContexts: string[];
  isDeprecated: boolean;
  deprecationReasons: string[];
  /** is the column derived from a uniqueid property */
  isFromUniqueIdProperty: boolean;
  /** is the column derived from an usi column */
  isFromUsiProperty: boolean;
  /** Indicates if this column represents a reference relationship */
  isFromReferenceProperty: boolean;
  data: any;
}

export interface DecimalColumn extends Column {
  precision: string;
  scale: string;
}

export interface StringColumn extends Column {
  minLength: string;
  maxLength: string;
}

export function newColumn(): Column {
  return {
    nameComponents: [],
    parentTable: NoTable,
    columnId: '',
    propertyPath: '' as MetaEdPropertyPath,
    originalEntity: null,
    type: 'unknown',
    referenceContext: '',
    description: '',
    sqlEscapedDescription: '',
    originalContextPrefix: '',
    isNullable: false,
    isPartOfPrimaryKey: false,
    isPartOfAlternateKey: false,
    isUniqueIndex: false,
    isIdentityDatabaseType: false,
    sourceEntityProperties: [],
    mergedReferenceContexts: [],
    isDeprecated: false,
    deprecationReasons: [],
    isFromUniqueIdProperty: false,
    isFromUsiProperty: false,
    isFromReferenceProperty: false,
    data: {},
  };
}

/**
 * Returns a shallow clone of the given column.
 */
export function cloneColumn(column: Column): Column {
  return {
    ...column,
    nameComponents: [...column.nameComponents],
    deprecationReasons: [...column.deprecationReasons],
    sourceEntityProperties: [...column.sourceEntityProperties],
    mergedReferenceContexts: [...column.mergedReferenceContexts],
    data: { ...column.data },
  };
}

export const NoColumn: Column = deepFreeze({
  ...newColumn(),
  columnId: 'NoColumn',
});

export function initializeColumn(
  column: Column,
  property: EntityProperty,
  columnNamer: () => ColumnNaming,
  suppressPrimaryKey: boolean,
): Column {
  const columnNaming: ColumnNaming = columnNamer();
  Object.assign(column, {
    columnId: columnNaming.columnId,
    nameComponents: columnNaming.nameComponents,
    description: property.documentation,
    isIdentityDatabaseType: property.data.edfiOdsRelational.odsIsIdentityDatabaseType,
    isNullable: property.isOptional,
    isPartOfPrimaryKey: suppressPrimaryKey ? false : property.isPartOfIdentity,
    isUniqueIndex: property.data.edfiOdsRelational.odsIsUniqueIndex,
    originalContextPrefix: property.data.edfiOdsRelational.odsContextPrefix,
    isFromUniqueIdProperty: property.data.edfiOdsRelational.isUniqueIdProperty,
    isFromUsiProperty: property.data.edfiOdsRelational.isUsiProperty,
    isFromReferenceProperty: isReferentialProperty(property),
  });
  column.sourceEntityProperties.push(property);
  return column;
}

export function columnConstraintMerge(existing: Column, received: Column): Column {
  const clone = cloneColumn(existing);
  clone.mergedReferenceContexts = R.union(clone.mergedReferenceContexts, received.mergedReferenceContexts);
  clone.sourceEntityProperties = R.union(clone.sourceEntityProperties, received.sourceEntityProperties);

  // ensure alternate key if set by either
  if (received.isPartOfAlternateKey) clone.isPartOfAlternateKey = true;

  // ensure unique index key if set by either
  if (received.isUniqueIndex) clone.isUniqueIndex = true;

  // ensure isFromReferenceProperty if set by either
  if (received.isFromReferenceProperty) clone.isFromReferenceProperty = true;

  // ensure primary key if set by either
  if (clone.isPartOfPrimaryKey) return clone;
  if (received.isPartOfPrimaryKey) {
    clone.isPartOfPrimaryKey = true;
    clone.isNullable = false;
    return clone;
  }

  // ensure not nullable if set by either
  if (!clone.isNullable) return clone;
  if (!received.isNullable) {
    clone.isNullable = false;
    return clone;
  }

  return clone;
}

export function addSourceEntityProperty(column: Column, property: EntityProperty): void {
  const existingProperty = column.sourceEntityProperties.find(
    (x) => x.metaEdName === property.metaEdName && x.type === property.type,
  );
  if (existingProperty == null) {
    column.sourceEntityProperties.push(property);
  } else {
    Logger.warn(
      `  Attempt to add duplicate source entity property: ${property.metaEdName} (${property.typeHumanizedName})  to column ${column.columnId} failed.`,
    );
  }
}

export function addMergedReferenceContext(column: Column, referenceContext: string): void {
  const existingProperty: string | undefined = column.mergedReferenceContexts.find((x) => x === referenceContext);
  if (existingProperty == null) {
    column.mergedReferenceContexts.push(referenceContext);
  } else {
    Logger.warn(
      `Attempt to add duplicate merged reference context: ${referenceContext} to column ${column.columnId} failed.`,
    );
  }
}

function isParentPrimaryKeyColumn(columnToTest: Column, parentPrimaryKeys: Column[]): boolean {
  return parentPrimaryKeys.some((c) => c.columnId === columnToTest.columnId);
}

/**
 * Makes explicit the V7+ implicitly built sort order which is:
 * 1) Parent PKs alphabetically
 * 2) Non-parent PKs (think sub tables) alphabetically
 * 3) Non PKs alphabetically
 */
export function columnSortV7(table: Table, parentPrimaryKeys: Column[]) {
  table.columns.sort((a: Column, b: Column) => {
    // if both are parent pk columns, maintain the ordering (may be parents of parents)
    if (isParentPrimaryKeyColumn(a, parentPrimaryKeys) && isParentPrimaryKeyColumn(b, parentPrimaryKeys)) return 0;

    // if first is parent pk column and second is not, parent pk comes first
    if (isParentPrimaryKeyColumn(a, parentPrimaryKeys) && !isParentPrimaryKeyColumn(b, parentPrimaryKeys)) return -1;

    // if second is parent pk column and first is not, something is probably wrong programming-wise elsewhere. Still, correct it
    if (!isParentPrimaryKeyColumn(a, parentPrimaryKeys) && isParentPrimaryKeyColumn(b, parentPrimaryKeys)) return 1;

    // At this point, neither columns are parent pks

    // If neither are PKs, sort
    if (!a.isPartOfPrimaryKey && !b.isPartOfPrimaryKey) return a.columnId.localeCompare(b.columnId);
    // If first is a PK and second is not, it stays first
    if (a.isPartOfPrimaryKey && !b.isPartOfPrimaryKey) return -1;
    // If second is a PK and first is not, it needs to move up
    if (!a.isPartOfPrimaryKey && b.isPartOfPrimaryKey) return 1;
    // If they are both primary keys, order alphabetically
    return a.columnId.localeCompare(b.columnId);
  });
}
