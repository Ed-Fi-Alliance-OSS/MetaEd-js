import deepFreeze from 'deep-freeze';
import * as R from 'ramda';
import winston from 'winston';
import { EntityProperty, TopLevelEntity } from '@edfi/metaed-core';
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

/** The reason why this column exists */
export interface ColumnExistenceReason {
  /** is the column data directly from a simple property */
  isDirectlyFromSimpleProperty: boolean;
  /** is the column part of a foreign key reference used to implement a collection property */
  isPartOfForeignKeyImplementingCollection: boolean;
  /** is the column part of a foreign key reference used to implement a common property */
  isPartOfForeignKeyImplementingCommon: boolean;
  /** the source property if one exists, whether a simple property or a property requiring a foreign key implementation */
  sourceProperty?: EntityProperty;

  /** is the column part of a foreign key reference of an extension back to a parent entity */
  isPartOfForeignKeyToExtensionTable: boolean;
  /** is the column part of a foreign key reference of a subclass back to a parent entity */
  isPartOfForeignKeyToSubclassTable: boolean;
  /** the parent entity requiring a foreign key implementation, if one exists */
  parentEntity?: TopLevelEntity;

  /** is the column an API create date column */
  isSyntheticCreateDate: boolean;
  /** is the column an API last modified date column */
  isSyntheticLastModifiedDate: boolean;
  /** is the column an API id column */
  isSyntheticIdGuid: boolean;
  /** is the column a subclass discriminator column */
  isSyntheticDiscriminator: boolean;

  /** is the column a participant in a merge due to a merge directive somewhere in the model */
  isInvolvedInMerge: boolean;
  /** the properties that would also have created this column if there were no merge directives, if this column is a participant in a merge */
  mergedAwayProperties?: EntityProperty[];
}

export function newColumnExistenceReason(): ColumnExistenceReason {
  return {
    isDirectlyFromSimpleProperty: false,
    isPartOfForeignKeyImplementingCollection: false,
    isPartOfForeignKeyImplementingCommon: false,
    isPartOfForeignKeyToExtensionTable: false,
    isPartOfForeignKeyToSubclassTable: false,
    isSyntheticCreateDate: false,
    isSyntheticLastModifiedDate: false,
    isSyntheticIdGuid: false,
    isSyntheticDiscriminator: false,
    isInvolvedInMerge: false,
  };
}

export const NoColumnExistenceReason: ColumnExistenceReason = deepFreeze(newColumnExistenceReason());

export interface Column {
  // new stuff here
  nameComponents: ColumnNameComponent[];
  existenceReason: ColumnExistenceReason;
  parentTable: Table;
  /** The string identifier for the column, independent of the column name */
  columnId: string;

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
  data: any;
}

export interface DecimalColumn extends Column {
  precision: string;
  scale: string;
}

export interface StringColumn extends Column {
  length: string;
}

export function newColumn(): Column {
  return {
    nameComponents: [],
    existenceReason: NoColumnExistenceReason,
    parentTable: NoTable,
    columnId: '',
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
    data: {},
  };
}

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
    winston.warn(
      `  Attempt to add duplicate source entity property: ${property.metaEdName} (${property.typeHumanizedName})  to column ${column.columnId} failed.`,
    );
  }
}

export function addMergedReferenceContext(column: Column, referenceContext: string): void {
  const existingProperty: string | undefined = column.mergedReferenceContexts.find((x) => x === referenceContext);
  if (existingProperty == null) {
    column.mergedReferenceContexts.push(referenceContext);
  } else {
    // winston.warn(`Attempt to add duplicate merged reference context: ${referenceContext} to column ${column.columnId} failed.`);
  }
}
