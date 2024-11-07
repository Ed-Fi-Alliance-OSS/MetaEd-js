import deepFreeze from 'deep-freeze';
import * as R from 'ramda';
import { invariant } from 'ts-invariant';
import {
  Logger,
  NoTopLevelEntity,
  NoNamespace,
  ModelBase,
  TopLevelEntity,
  EntityProperty,
  Namespace,
  orderByProp,
  SemVer,
  versionSatisfies,
} from '@edfi/metaed-core';
import { columnConstraintMerge, Column, NoColumn } from './Column';
import { ColumnTransform } from './ColumnTransform';
import { ForeignKey } from './ForeignKey';
import { simpleTableNameGroupConcat } from './TableNameGroupHelper';
import { ColumnConflictPath } from './ColumnConflictPath';

// eslint-disable-next-line no-use-before-define
export type TableNameElement = TableNameComponent | TableNameGroup;

/** A grouping of TableNameComponents derived from a property or entity */
export interface TableNameGroup {
  /** the name components in the correct naming order  */
  nameElements: TableNameElement[];
  /** the source property for the name group, if applicable */
  sourceProperty?: EntityProperty;
  /** the source entity for the name group, if applicable */
  sourceEntity?: TopLevelEntity;
  /** is the source of the name group hardcoded and/or made up from somewhere */
  isSynthetic: boolean;
  /** flag indicating this is a TableNameGroup object */
  isGroup: boolean;
}

export function newTableNameGroup(): TableNameGroup {
  return {
    nameElements: [],
    isSynthetic: false,
    isGroup: true,
  };
}

export const NoTableNameGroup: TableNameGroup = deepFreeze(newTableNameGroup());

/** The reason why this table exists */
export interface TableExistenceReason {
  /** is this a subtable implementing a collection */
  isImplementingCollection: boolean;
  /** is this a subtable implementing a common property */
  isImplementingCommon: boolean;
  /** the source collection or common property, if one exists */
  sourceProperty?: EntityProperty;

  /** is this a table implementing the root of a top level entity */
  isEntityMainTable: boolean;
  /** is this a table implementing an extension back to a parent entity */
  isExtensionTable: boolean;
  /** is this a table implementing a subclass back to a parent entity */
  isSubclassTable: boolean;
  /** the parent entity, if one exists */
  parentEntity?: ModelBase;

  /** is this table hardcoded and/or made up from somewhere */
  isSynthetic: boolean;

  /** is this the hardcoded base descriptor table known as Descriptor */
  isBaseDescriptor: boolean;
}

export function newTableExistenceReason(): TableExistenceReason {
  return {
    isImplementingCollection: false,
    isImplementingCommon: false,
    isEntityMainTable: false,
    isExtensionTable: false,
    isSubclassTable: false,
    isSynthetic: false,
    isBaseDescriptor: false,
  };
}

export const NoTableExistenceReason: TableExistenceReason = deepFreeze(newTableExistenceReason());

export interface Table {
  // new stuff here
  nameGroup: TableNameGroup;
  existenceReason: TableExistenceReason;
  tableId: string;

  /** A list of all the column conflict paths that lead to the creation of this table */
  columnConflictPaths: ColumnConflictPath[];

  namespace: Namespace;
  schema: string;
  type: string;
  description: string;
  sqlEscapedDescription: string;
  typeHumanizedName: string;
  typeHumanizedNameWithIndefiniteArticle: string;
  includeCreateDateColumn: boolean;
  includeLastModifiedDateAndIdColumn: boolean;
  includeComputedDescriptorUriColumn: boolean;
  isRequiredCollectionTable: boolean;
  isTypeTable: boolean;
  hasAlternateKeys: boolean;
  columns: Column[];
  primaryKeys: Column[];
  foreignKeys: ForeignKey[];
  alternateKeys: Column[];
  uniqueIndexes: Column[];

  // The educationOrganizationId columns that are part of this table, if there are any.
  educationOrganizationIdColumns: Column[];
  hasEducationOrganizationIdColumns: boolean;

  // The USI columns that are part of this table, if there are any.
  usiColumns: Column[];
  hasUsiColumns: boolean;

  // not all tables have a parentEntity
  parentEntity: TopLevelEntity;
  isAggregateRootTable: boolean;
  hideFromApiMetadata: boolean;
  hasDiscriminatorColumn: boolean;
  isDeprecated: boolean;
  deprecationReasons: string[];
  data: any;
}

export function newTable(): Table {
  return {
    nameGroup: NoTableNameGroup,
    existenceReason: NoTableExistenceReason,
    tableId: '',

    columnConflictPaths: [],

    namespace: NoNamespace,
    schema: '',
    type: 'table',
    description: '',
    sqlEscapedDescription: '',
    typeHumanizedName: 'Table',
    typeHumanizedNameWithIndefiniteArticle: 'A Table',
    includeCreateDateColumn: false,
    includeLastModifiedDateAndIdColumn: false,
    includeComputedDescriptorUriColumn: false,
    isRequiredCollectionTable: false,
    isTypeTable: false,
    hasAlternateKeys: false,
    columns: [],
    primaryKeys: [],
    foreignKeys: [],
    alternateKeys: [],
    uniqueIndexes: [],

    educationOrganizationIdColumns: [],
    hasEducationOrganizationIdColumns: false,

    usiColumns: [],
    hasUsiColumns: false,

    parentEntity: NoTopLevelEntity,
    isAggregateRootTable: false,
    hideFromApiMetadata: false,
    hasDiscriminatorColumn: false,
    isDeprecated: false,
    deprecationReasons: [],
    data: {},
  };
}

export const NoTable: Table = deepFreeze({ ...newTable(), tableId: 'NoTable' });

/** A single component of the name of the table used by dependent plugins to construct the actual name */
export interface TableNameComponent {
  /** the string name component string itself */
  name: string;
  /** is the source of the name component an entity MetaEdName */
  isEntityMetaEdName: boolean;
  /** is the source of the name component derived from an entity MetaEdName (e.g. MetaEdName plus 'Descriptor' suffix for a Descriptor entity) */
  isDerivedFromEntityMetaEdName: boolean;
  /** is the source of the name component a property 'shorten to' directive */
  isShortenToRename: boolean;
  /** is the source of the name component a property 'role name' directive */
  isPropertyRoleName: boolean;
  /** is the source of the name component a property ods name */
  isPropertyOdsName: boolean;
  /** is the source of the name component a property MetaEdName */
  isPropertyMetaEdName: boolean;
  /** is the source of the name component a property 'role name' or 'shorten to' directive from further up the chain */
  isParentPropertyContext: boolean;
  /** is the source of the name component the parent table name */
  isParentTableName: boolean;
  /** is the source of the name component an extension suffix */
  isExtensionSuffix: boolean;
  /** is the source of the name component hardcoded and/or made up from somewhere */
  isSynthetic: boolean;
  /** the source property for the name component, if applicable */
  sourceProperty?: EntityProperty;
  /** the source entity for the name component, if applicable */
  sourceEntity?: TopLevelEntity;
  /** the source table for the name component, if applicable */
  sourceTable?: Table;
  /** flag indicating this is a TableNameComponent object */
  isComponent: boolean;
}

export function newTableNameComponent(): TableNameComponent {
  return {
    name: '',
    isEntityMetaEdName: false,
    isDerivedFromEntityMetaEdName: false,
    isShortenToRename: false,
    isPropertyRoleName: false,
    isPropertyOdsName: false,
    isPropertyMetaEdName: false,
    isParentPropertyContext: false,
    isParentTableName: false,
    isExtensionSuffix: false,
    isSynthetic: false,
    isComponent: true,
  };
}

export function isTableNameGroup(nameElement: TableNameElement): nameElement is TableNameGroup {
  return (nameElement as TableNameGroup).isGroup;
}

export function isTableNameComponent(nameElement: TableNameElement): nameElement is TableNameComponent {
  return (nameElement as TableNameComponent).isComponent;
}

/**
 * Add columnConflictPaths to the table
 */
function addColumnConflictPaths(table: Table, firstColumn: Column, secondColumn: Column) {
  // Ignore synthetic USI columns
  if (
    firstColumn.sourceEntityProperties.some(
      (sourceEntityProperty) => sourceEntityProperty.data.edfiOdsRelational.isUsiProperty,
    )
  ) {
    return;
  }

  invariant(
    firstColumn.originalEntity != null,
    `Column ${firstColumn.columnId} for Table ${table.tableId} is duplicate column with no originalEntity`,
  );
  invariant(
    secondColumn.originalEntity != null,
    `Column ${secondColumn.columnId} for Table ${table.tableId} is duplicate column with no originalEntity`,
  );

  table.columnConflictPaths.push({
    firstPath: firstColumn.propertyPath,
    secondPath: secondColumn.propertyPath,
    firstOriginalEntity: firstColumn.originalEntity,
    secondOriginalEntity: secondColumn.originalEntity,
  });
}

/**
 * Adds a column while doing delete and append for duplicate columns rather than replacement
 */
function addColumnV5(table: Table, column: Column) {
  const existingColumn = table.columns.find((x) => x.columnId === column.columnId);
  if (existingColumn == null) {
    table.columns.push(column);
  } else {
    Logger.debug(`  Duplicate column ${column.columnId} on table ${simpleTableNameGroupConcat(table.nameGroup)}.`);

    addColumnConflictPaths(table, existingColumn, column);

    table.columns = R.reject((c: Column) => c.columnId === column.columnId)(table.columns);
    table.columns.push(columnConstraintMerge(existingColumn, column));
  }
}

/**
 * Adds a column while doing replacement for duplicate columns rather than delete and append
 */
function addColumnV7(table: Table, column: Column) {
  const existingColumnIndex = table.columns.findIndex((x) => x.columnId === column.columnId);
  if (existingColumnIndex === -1) {
    table.columns.push(column);
  } else {
    Logger.debug(`  Duplicate column ${column.columnId} on table ${simpleTableNameGroupConcat(table.nameGroup)}.`);

    addColumnConflictPaths(table, table.columns[existingColumnIndex], column);

    table.columns[existingColumnIndex] = columnConstraintMerge(table.columns[existingColumnIndex], column);
  }
}

export function addColumn(table: Table, column: Column, targetTechnologyVersion: SemVer): void {
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    addColumnV7(table, column);
  } else {
    addColumnV5(table, column);
  }
}

export function addColumnsWithoutSort(
  table: Table,
  columns: Column[],
  strategy: ColumnTransform,
  targetTechnologyVersion: SemVer,
): void {
  strategy.transform(columns).forEach((column) => addColumn(table, column, targetTechnologyVersion));
}

/**
 * Adds columns to table. Does so in sorted order if appropriate for the ODS/API targetTechnologyVersion
 */
export function addColumnsWithSort(
  table: Table,
  columns: Column[],
  strategy: ColumnTransform,
  targetTechnologyVersion: SemVer,
): void {
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    const sortedColumns: Column[] = orderByProp('columnId')(strategy.transform(columns));
    sortedColumns.forEach((column) => addColumn(table, column, targetTechnologyVersion));
  } else {
    strategy.transform(columns).forEach((column) => addColumn(table, column, targetTechnologyVersion));
  }
}

export function getPrimaryKeys(table: Table): Column[] {
  return orderByProp('columnId')(table.columns.filter((x) => x.isPartOfPrimaryKey));
}

export function getNonPrimaryKeys(table: Table): Column[] {
  return table.columns.filter((x) => !x.isPartOfPrimaryKey);
}

export function getAllColumns(table: Table): Column[] {
  return [...getPrimaryKeys(table), ...getNonPrimaryKeys(table)];
}

export function addForeignKey(table: Table, foreignKey: ForeignKey): void {
  foreignKey.parentTable = table;
  table.foreignKeys.push(foreignKey);
}

export function getColumn(table: Table, columnId: string): Column {
  return table.columns.find((c: Column) => c.columnId === columnId) || NoColumn;
}
