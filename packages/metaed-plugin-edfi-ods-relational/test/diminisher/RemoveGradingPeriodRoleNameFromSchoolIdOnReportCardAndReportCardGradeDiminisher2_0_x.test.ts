import * as R from 'ramda';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { ForeignKey } from '../../src/model/database/ForeignKey';
import { Table } from '../../src/model/database/Table';

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x diminishes StudentCompetencyObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const studentCompetencyObjective = 'StudentCompetencyObjective';
  const schoolId = 'SchoolId';
  const gradingPeriod = 'GradingPeriod';
  const gradingPeriodSchoolId: string = gradingPeriod + schoolId;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentCompetencyObjective,
      columns: [
        { ...newColumn(), columnId: gradingPeriodSchoolId },
        { ...newColumn(), columnId: schoolId, isNullable: true, isPartOfPrimaryKey: false },
      ],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: gradingPeriod,
          columnPairs: [{ ...newColumnPair(), parentTableColumnId: gradingPeriodSchoolId, foreignTableColumnId: schoolId }],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should remove GradingPeriodSchoolId column', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(studentCompetencyObjective) as Table;
    expect(columns).toHaveLength(1);
    expect(columns[0].columnId).not.toBe(gradingPeriodSchoolId);
  });

  it('should rename foreign key columns', (): void => {
    const foreignKey: ForeignKey = R.head(
      (tableEntities(metaEd, namespace).get(studentCompetencyObjective) as Table).foreignKeys,
    );
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(schoolId);
  });

  it('should make SchoolId column a non-nullable primary key', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(studentCompetencyObjective) as Table).columns);
    expect(column.columnId).toBe(schoolId);
    expect(column.isNullable).toBe(false);
    expect(column.isPartOfPrimaryKey).toBe(true);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x diminishes StudentLearningObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const studentLearningObjective = 'StudentLearningObjective';
  const schoolId = 'SchoolId';
  const gradingPeriod = 'GradingPeriod';
  const gradingPeriodSchoolId: string = gradingPeriod + schoolId;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentLearningObjective,
      columns: [
        { ...newColumn(), columnId: gradingPeriodSchoolId },
        { ...newColumn(), columnId: schoolId, isNullable: true, isPartOfPrimaryKey: false },
      ],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: gradingPeriod,
          columnPairs: [{ ...newColumnPair(), parentTableColumnId: gradingPeriodSchoolId, foreignTableColumnId: schoolId }],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should remove GradingPeriodSchoolId column', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(studentLearningObjective) as Table;
    expect(columns).toHaveLength(1);
    expect(columns[0].columnId).not.toBe(gradingPeriodSchoolId);
  });

  it('should rename foreign key columns', (): void => {
    const foreignKey = R.head((tableEntities(metaEd, namespace).get(studentLearningObjective) as Table).foreignKeys);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(schoolId);
  });

  it('should make SchoolId column a non-nullable primary key', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(studentLearningObjective) as Table).columns);
    expect(column.columnId).toBe(schoolId);
    expect(column.isNullable).toBe(false);
    expect(column.isPartOfPrimaryKey).toBe(true);
  });
});
