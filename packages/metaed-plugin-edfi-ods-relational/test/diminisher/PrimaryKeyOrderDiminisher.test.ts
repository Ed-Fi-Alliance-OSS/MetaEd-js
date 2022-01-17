import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/PrimaryKeyOrderDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { Table } from '../../src/model/database/Table';

describe('when PrimaryKeyOrderDiminisher diminishes matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const gradebookEntryLearningObjective = 'GradebookEntryLearningObjective';
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
  const expectedPrimaryKeyOrder: string[] = [
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

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: gradebookEntryLearningObjective,
      columns: primaryKeyNames.map((columnId: string) => ({ ...newColumn(), columnId, isPartOfPrimaryKey: true })),
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have correct primary key order', (): void => {
    const { primaryKeys } = tableEntities(metaEd, namespace).get(gradebookEntryLearningObjective) as Table;
    expect(primaryKeys.map((pk: Column) => pk.columnId)).toEqual(expectedPrimaryKeyOrder);
  });
});

describe('when PrimaryKeyOrderDiminisher diminishes matching table with extraneous primary keys', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const gradebookEntryLearningObjective = 'GradebookEntryLearningObjective';
  const primaryKeyNames: string[] = [
    'PrimaryKeyNameC',
    'ClassroomIdentificationCode',
    'TermDescriptorId',
    'GradebookEntryTitle',
    'PrimaryKeyNameF',
    'PrimaryKeyNameA',
    'PrimaryKeyNameG',
    'Objective',
    'PrimaryKeyNameH',
    'AcademicSubjectDescriptorId',
    'PrimaryKeyNameD',
    'LocalCourseCode',
    'ClassPeriodName',
    'SchoolId',
    'SequenceOfCourse',
    'SchoolYear',
    'PrimaryKeyNameB',
    'PrimaryKeyNameJ',
    'ObjectiveGradeLevelDescriptorId',
    'PrimaryKeyNameE',
    'DateAssigned',
    'UniqueSectionCode',
    'PrimaryKeyNameI',
  ];
  const expectedPrimaryKeyOrder: string[] = [];

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: gradebookEntryLearningObjective,
      columns: primaryKeyNames.map((columnId: string) => ({ ...newColumn(), columnId, isPartOfPrimaryKey: true })),
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have ignored primary key ordering for this table', (): void => {
    const { primaryKeys } = tableEntities(metaEd, namespace).get(gradebookEntryLearningObjective) as Table;
    expect(primaryKeys.map((pk: Column) => pk.columnId)).toEqual(expectedPrimaryKeyOrder);
  });
});

describe('when PrimaryKeyOrderDiminisher diminishes non matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const TableName = 'TableName';
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

    const table: Table = {
      ...newTable(),
      tableId: TableName,
      columns: primaryKeyNames.map((columnId: string) => ({ ...newColumn(), columnId, isPartOfPrimaryKey: true })),
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have correct primary key order', (): void => {
    const { primaryKeys } = tableEntities(metaEd, namespace).get(TableName) as Table;
    expect(primaryKeys).toEqual([]);
  });
});
