import deepFreeze from 'deep-freeze';
import R from 'ramda';
import winston from 'winston';
import {
  orderByProp,
  NoTopLevelEntity,
  NoNamespace,
  ModelBase,
  TopLevelEntity,
  EntityProperty,
  Namespace,
} from '@edfi/metaed-core';
import { columnConstraintMerge, Column, NoColumn } from './Column';
import { ColumnTransform } from './ColumnTransform';
import { ForeignKey } from './ForeignKey';
import { simpleTableNameGroupConcat } from './TableNameGroupHelper';

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

  namespace: Namespace;
  schema: string;
  type: string;
  description: string;
  sqlEscapedDescription: string;
  typeHumanizedName: string;
  typeHumanizedNameWithIndefiniteArticle: string;
  includeCreateDateColumn: boolean;
  includeLastModifiedDateAndIdColumn: boolean;
  isRequiredCollectionTable: boolean;
  isTypeTable: boolean;
  hasAlternateKeys: boolean;
  columns: Column[];
  primaryKeys: Column[];
  foreignKeys: ForeignKey[];
  alternateKeys: Column[];
  uniqueIndexes: Column[];
  // not all tables have a parentEntity
  parentEntity: TopLevelEntity;
  isEntityMainTable: boolean;
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

    namespace: NoNamespace,
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
    isEntityMainTable: false,
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

export function getColumnWithStrongestConstraint(
  table: Table,
  column: Column,
  constraintStrategy: (existing: Column, received: Column) => Column,
): Column {
  const existingColumn = table.columns.find((x) => x.columnId === column.columnId);
  if (existingColumn == null) return column;

  winston.debug(`  Duplicate column ${column.columnId} on table ${simpleTableNameGroupConcat(table.nameGroup)}.`);
  table.columns = R.reject((c: Column) => c.columnId === column.columnId)(table.columns);
  return constraintStrategy(existingColumn, column);
}

export function addColumn(table: Table, column: Column): void {
  const clone: Column = getColumnWithStrongestConstraint(table, column, columnConstraintMerge);
  table.columns.push(clone);
}

export function addColumns(table: Table, columns: Column[], strategy: ColumnTransform): void {
  strategy.transform(columns).forEach((column) => addColumn(table, column));
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
