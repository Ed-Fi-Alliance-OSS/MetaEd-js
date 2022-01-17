import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/ForeignKeyOrderDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { Table } from '../../src/model/database/Table';

describe('when ForeignKeyOrderDiminisher diminishes matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const parentTableName = 'ParentTableName';
  const gradebookEntryLearningObjective = 'GradebookEntryLearningObjective';
  const primaryKeyOrder: string[] = [
    'SchoolId',
    'ClassPeriodName',
    'ClassroomIdentificationCode',
    'GradebookEntryTitle',
    'DateAssigned',
    'Objective',
    'AcademicSubjectDescriptorId',
    'ObjectiveGradeLevelDescriptorId',
    'SchoolYear',
    'LocalCourseCode',
    'TermDescriptorId',
    'UniqueSectionCode',
    'SequenceOfCourse',
  ];
  const primaryKeyNames: string[] = [
    'SequenceOfCourse',
    'SchoolId',
    'UniqueSectionCode',
    'ClassPeriodName',
    'TermDescriptorId',
    'ClassroomIdentificationCode',
    'LocalCourseCode',
    'GradebookEntryTitle',
    'SchoolYear',
    'DateAssigned',
    'ObjectiveGradeLevelDescriptorId',
    'Objective',
    'AcademicSubjectDescriptorId',
  ];

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const foreignTable: Table = {
      ...newTable(),
      tableId: gradebookEntryLearningObjective,
      primaryKeys: primaryKeyOrder.map((columnId: string) => ({
        ...newColumn(),
        columnId,
        isPartOfPrimaryKey: true,
      })),
    };
    tableEntities(metaEd, namespace).set(foreignTable.tableId, foreignTable);

    const parentTable: Table = {
      ...newTable(),
      tableId: parentTableName,
      columns: primaryKeyNames.map((columnId: string) => ({
        ...newColumn(),
        columnId,
      })),
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableSchema: schemaName,
          foreignTableId: foreignTable.tableId,
          columnPairs: primaryKeyNames.map((name: string) => ({
            ...newColumnPair(),
            parentTableColumnId: name,
            foreignTableColumnId: name,
          })),
        },
      ],
    };
    tableEntities(metaEd, namespace).set(parentTable.tableId, parentTable);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have correct foreign key order', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(parentTableName) as Table;
    expect(foreignKeys).toHaveLength(1);
    expect(foreignKeys[0].columnPairs.map((cp) => cp.parentTableColumnId)).toEqual(primaryKeyOrder);
  });

  it('should have order parity with foreign table primary keys', (): void => {
    const primaryKeyNamesOnForeignTable: string[] = (
      tableEntities(metaEd, namespace).get(gradebookEntryLearningObjective) as Table
    ).primaryKeys.map((pk: Column) => pk.columnId);

    const { foreignKeys } = tableEntities(metaEd, namespace).get(parentTableName) as Table;
    const foreignKeyNames = foreignKeys[0].columnPairs.map((cp) => cp.foreignTableColumnId);
    expect(primaryKeyNamesOnForeignTable).toEqual(foreignKeyNames);
  });
});

describe('when ForeignKeyOrderDiminisher diminishes non matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const parentTableName = 'ParentTableName';
  const foreignTableId = 'ForeignTableName';
  const primaryKeyNames: string[] = [
    'PrimaryKeyNameF',
    'PrimaryKeyNameA',
    'PrimaryKeyNameC',
    'PrimaryKeyNameE',
    'PrimaryKeyNameD',
    'PrimaryKeyNameB',
    'PrimaryKeyNameJ',
    'PrimaryKeyNameH',
    'PrimaryKeyNameG',
    'PrimaryKeyNameI',
  ];

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const foreignTable: Table = {
      ...newTable(),
      tableId: foreignTableId,
      primaryKeys: primaryKeyNames.map((columnId: string) => ({ ...newColumn(), columnId, isPartOfPrimaryKey: true })),
    };
    tableEntities(metaEd, namespace).set(foreignTable.tableId, foreignTable);

    const parentTable: Table = {
      ...newTable(),
      tableId: parentTableName,
      columns: primaryKeyNames.map((columnId: string) => ({ ...newColumn(), columnId })),
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableSchema: schemaName,
          foreignTableId: foreignTable.tableId,
          columnPairs: primaryKeyNames.map((name: string) => ({
            ...newColumnPair(),
            parentTableColumnId: name,
            foreignTableColumnId: name,
          })),
        },
      ],
    };
    tableEntities(metaEd, namespace).set(parentTable.tableId, parentTable);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have correct foreign key order', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(parentTableName) as Table;
    expect(foreignKeys).toHaveLength(1);
    expect(foreignKeys[0].columnPairs.map((cp) => cp.parentTableColumnId)).toEqual(primaryKeyNames);
  });

  it('should have order parity with foreign table primary keys', (): void => {
    const primaryKeyNamesOnForeignTable = (tableEntities(metaEd, namespace).get(foreignTableId) as Table).primaryKeys.map(
      (pk: Column) => pk.columnId,
    );

    const { foreignKeys } = tableEntities(metaEd, namespace).get(parentTableName) as Table;
    const foreignKeyNames = foreignKeys[0].columnPairs.map((cp) => cp.foreignTableColumnId);
    expect(primaryKeyNamesOnForeignTable).toEqual(foreignKeyNames);
  });
});
