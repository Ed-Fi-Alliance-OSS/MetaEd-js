// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { MetaEdEnvironment, Namespace, newPluginEnvironment } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/ForeignKeyReverseIndexEnhancerV6x';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { ForeignKey } from '../../src/model/database/ForeignKey';
import { Table } from '../../src/model/database/Table';

describe('when ForeignKeyReverseIndexEnhancer enhances table with foreign key matching primary key columns', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    const table: Table = { ...newTable(), tableId: tableName, schema: 'edfi' };
    const primaryKey: Column = { ...newColumn(), columnId: 'PrimaryKeyName', isPartOfPrimaryKey: true };
    table.columns.push(primaryKey);
    const foreignKey: ForeignKey = {
      ...newForeignKey(),
      withReverseForeignKeyIndex: false,
      columnPairs: [
        { ...newColumnPair(), parentTableColumnId: primaryKey.columnId, foreignTableColumnId: primaryKey.columnId },
      ],
    };
    table.foreignKeys.push(foreignKey);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    tableEntities(metaEd, namespace).set(table.tableId, table);
    enhance(metaEd);
  });

  it('should have foreign key with reverse foreign key index set to false', (): void => {
    const foreignKey = R.head((tableEntities(metaEd, namespace).get(tableName) as Table).foreignKeys);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(false);
  });
});

describe('when ForeignKeyReverseIndexEnhancer enhances table with foreign key not matching primary key columns', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    const table: Table = { ...newTable(), tableId: tableName };
    const primaryKey: Column = { ...newColumn(), isPartOfPrimaryKey: true };
    table.columns.push(primaryKey);
    const column: Column = { ...newColumn(), columnId: 'columnName' };
    table.columns.push(column);
    const foreignKey: ForeignKey = {
      ...newForeignKey(),
      withReverseForeignKeyIndex: false,
      columnPairs: [{ ...newColumnPair(), parentTableColumnId: column.columnId, foreignTableColumnId: column.columnId }],
    };
    table.foreignKeys.push(foreignKey);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    tableEntities(metaEd, namespace).set(table.tableId, table);
    enhance(metaEd);
  });

  it('should have foreign key with reverse foreign key index set to true', (): void => {
    const foreignKey = R.head((tableEntities(metaEd, namespace).get(tableName) as Table).foreignKeys);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(true);
  });
});

describe('when ForeignKeyReverseIndexEnhancer enhances table with foreign key not matching primary key columns for ODS/API 7', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  metaEd.plugin.set('edfiOdsRelational', {
    ...newPluginEnvironment(),
    shortName: 'edfiOdsRelational',
    targetTechnologyVersion: '7.1.0',
  });

  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    const table: Table = { ...newTable(), tableId: tableName };
    const primaryKey: Column = { ...newColumn(), isPartOfPrimaryKey: true };
    table.columns.push(primaryKey);
    const column: Column = { ...newColumn(), columnId: 'columnName' };
    table.columns.push(column);
    const foreignKey: ForeignKey = {
      ...newForeignKey(),
      withReverseForeignKeyIndex: false,
      columnPairs: [{ ...newColumnPair(), parentTableColumnId: column.columnId, foreignTableColumnId: column.columnId }],
    };
    table.foreignKeys.push(foreignKey);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    tableEntities(metaEd, namespace).set(table.tableId, table);
    enhance(metaEd);
  });

  it('should have foreign key with reverse foreign key index set to false', (): void => {
    const foreignKey = R.head((tableEntities(metaEd, namespace).get(tableName) as Table).foreignKeys);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(false);
  });
});

describe('when ForeignKeyReverseIndexEnhancer enhances table with multi column foreign key matching primary key columns', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    const table: Table = { ...newTable(), tableId: tableName };
    const primaryKey1: Column = { ...newColumn(), columnId: 'primaryKeyName1', isPartOfPrimaryKey: true };
    table.columns.push(primaryKey1);
    const primaryKey2: Column = { ...newColumn(), columnId: 'primaryKeyName2', isPartOfPrimaryKey: true };
    table.columns.push(primaryKey2);
    const foreignKey: ForeignKey = {
      ...newForeignKey(),
      withReverseForeignKeyIndex: false,
      columnPairs: [
        { ...newColumnPair(), parentTableColumnId: primaryKey1.columnId, foreignTableColumnId: primaryKey1.columnId },
        { ...newColumnPair(), parentTableColumnId: primaryKey2.columnId, foreignTableColumnId: primaryKey2.columnId },
      ],
    };
    table.foreignKeys.push(foreignKey);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    tableEntities(metaEd, namespace).set(table.tableId, table);
    enhance(metaEd);
  });

  it('should have foreign key with reverse foreign key index set to false', (): void => {
    const foreignKey = R.head((tableEntities(metaEd, namespace).get(tableName) as Table).foreignKeys);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(false);
  });
});

describe('when ForeignKeyReverseIndexEnhancer enhances table with foreign key subset of primary key columns', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    const table: Table = { ...newTable(), tableId: tableName };
    const primaryKey1: Column = { ...newColumn(), columnId: 'primaryKeyName1', isPartOfPrimaryKey: true };
    table.columns.push(primaryKey1);
    const primaryKey2: Column = { ...newColumn(), columnId: 'primaryKeyName2', isPartOfPrimaryKey: true };
    table.columns.push(primaryKey2);
    const foreignKey: ForeignKey = {
      ...newForeignKey(),
      withReverseForeignKeyIndex: false,
      columnPairs: [
        { ...newColumnPair(), parentTableColumnId: primaryKey1.columnId, foreignTableColumnId: primaryKey1.columnId },
      ],
    };
    table.foreignKeys.push(foreignKey);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    tableEntities(metaEd, namespace).set(table.tableId, table);
    enhance(metaEd);
  });

  it('should have foreign key with reverse foreign key index set to true', (): void => {
    const foreignKey = R.head((tableEntities(metaEd, namespace).get(tableName) as Table).foreignKeys);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(true);
  });
});

describe('when ForeignKeyReverseIndexEnhancer enhances table with foreign key superset of primary key columns', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    const table: Table = { ...newTable(), tableId: tableName };
    const primaryKey: Column = { ...newColumn(), columnId: 'primaryKeyName', isPartOfPrimaryKey: true };
    table.columns.push(primaryKey);
    const column: Column = { ...newColumn(), columnId: 'columnName' };
    table.columns.push(column);
    const foreignKey: ForeignKey = {
      ...newForeignKey(),
      withReverseForeignKeyIndex: false,
      columnPairs: [
        { ...newColumnPair(), parentTableColumnId: primaryKey.columnId, foreignTableColumnId: primaryKey.columnId },
        { ...newColumnPair(), parentTableColumnId: column.columnId, foreignTableColumnId: column.columnId },
      ],
    };
    table.foreignKeys.push(foreignKey);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    tableEntities(metaEd, namespace).set(table.tableId, table);
    enhance(metaEd);
  });

  it('should have foreign key with reverse foreign key index set to true', (): void => {
    const foreignKey = R.head((tableEntities(metaEd, namespace).get(tableName) as Table).foreignKeys);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(true);
  });
});
