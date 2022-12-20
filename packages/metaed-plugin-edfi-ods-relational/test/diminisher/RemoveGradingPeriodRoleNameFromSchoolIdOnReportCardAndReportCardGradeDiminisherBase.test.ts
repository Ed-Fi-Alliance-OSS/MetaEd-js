import * as R from 'ramda';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { ForeignKey } from '../../src/model/database/ForeignKey';
import { Table } from '../../src/model/database/Table';

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes ReportCard table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const reportCard = 'ReportCard';
  const schoolId = 'SchoolId';

  beforeAll(() => {
    const gradingPeriod = 'GradingPeriod';
    const gradingPeriodSchoolId: string = gradingPeriod + schoolId;
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: reportCard,
      columns: [{ ...newColumn(), columnId: gradingPeriodSchoolId }],
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

  it('should rename column', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(reportCard) as Table).columns);
    expect(column.columnId).toBe(schoolId);
  });

  it('should rename foreign key columns', (): void => {
    const foreignKey: ForeignKey = R.head((tableEntities(metaEd, namespace).get(reportCard) as Table).foreignKeys);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes ReportCardGrade table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const grade = 'Grade';
  const reportCard = 'ReportCard';
  const schoolId = 'SchoolId';
  const reportCardGrade: string = reportCard + grade;

  beforeAll(() => {
    const gradingPeriodSchoolId = `GradingPeriod${schoolId}`;
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: reportCardGrade,
      columns: [{ ...newColumn(), columnId: gradingPeriodSchoolId }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: reportCard,
          columnPairs: [
            { ...newColumnPair(), parentTableColumnId: gradingPeriodSchoolId, foreignTableColumnId: gradingPeriodSchoolId },
          ],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should remove column', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(reportCardGrade) as Table).columns);
    expect(column).toBeUndefined();
  });

  it('should rename foreign key columns', (): void => {
    const foreignKey: ForeignKey = R.head((tableEntities(metaEd, namespace).get(reportCardGrade) as Table).foreignKeys);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes ReportCardStudentCompetencyObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const reportCard = 'ReportCard';
  const schoolId = 'SchoolId';
  const studentCompetencyObjective = 'StudentCompetencyObjective';
  const reportCardStudentCompetencyObjective: string = reportCard + studentCompetencyObjective;

  beforeAll(() => {
    const gradingPeriodSchoolId = `GradingPeriod${schoolId}`;
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: reportCardStudentCompetencyObjective,
      columns: [{ ...newColumn(), columnId: gradingPeriodSchoolId }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: reportCard,
          columnPairs: [
            { ...newColumnPair(), parentTableColumnId: gradingPeriodSchoolId, foreignTableColumnId: gradingPeriodSchoolId },
          ],
        },
        {
          ...newForeignKey(),
          foreignTableId: studentCompetencyObjective,
          columnPairs: [
            { ...newColumnPair(), parentTableColumnId: gradingPeriodSchoolId, foreignTableColumnId: gradingPeriodSchoolId },
          ],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename column', (): void => {
    const column: Column = R.head(
      (tableEntities(metaEd, namespace).get(reportCardStudentCompetencyObjective) as Table).columns,
    );
    expect(column.columnId).toBe(schoolId);
  });

  it('should rename foreign key columns', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(reportCardStudentCompetencyObjective) as Table;
    expect(R.head(foreignKeys[0].columnPairs).parentTableColumnId).toBe(schoolId);
    expect(R.head(foreignKeys[0].columnPairs).foreignTableColumnId).toBe(schoolId);
    expect(R.head(foreignKeys[foreignKeys.length - 1].columnPairs).parentTableColumnId).toBe(schoolId);
    expect(R.head(foreignKeys[foreignKeys.length - 1].columnPairs).foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes ReportCardStudentLearningObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const reportCard = 'ReportCard';
  const schoolId = 'SchoolId';
  const studentLearningObjective = 'StudentLearningObjective';
  const reportCardStudentLearningObjective: string = reportCard + studentLearningObjective;

  beforeAll(() => {
    const gradingPeriodSchoolId = `GradingPeriod${schoolId}`;
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: reportCardStudentLearningObjective,
      columns: [{ ...newColumn(), columnId: gradingPeriodSchoolId }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: reportCard,
          columnPairs: [
            { ...newColumnPair(), parentTableColumnId: gradingPeriodSchoolId, foreignTableColumnId: gradingPeriodSchoolId },
          ],
        },
        {
          ...newForeignKey(),
          foreignTableId: studentLearningObjective,
          columnPairs: [
            { ...newColumnPair(), parentTableColumnId: gradingPeriodSchoolId, foreignTableColumnId: gradingPeriodSchoolId },
          ],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename column', (): void => {
    const column: Column = R.head(
      (tableEntities(metaEd, namespace).get(reportCardStudentLearningObjective) as Table).columns,
    );
    expect(column.columnId).toBe(schoolId);
  });

  it('should rename foreign key columns', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(reportCardStudentLearningObjective) as Table;
    expect(R.head(foreignKeys[0].columnPairs).parentTableColumnId).toBe(schoolId);
    expect(R.head(foreignKeys[0].columnPairs).foreignTableColumnId).toBe(schoolId);
    expect(R.head(foreignKeys[foreignKeys.length - 1].columnPairs).parentTableColumnId).toBe(schoolId);
    expect(R.head(foreignKeys[foreignKeys.length - 1].columnPairs).foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes StudentAcademicRecordReportCard table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const reportCard = 'ReportCard';
  const schoolId = 'SchoolId';
  const studentAcademicRecord = 'StudentAcademicRecord';
  const studentAcademicRecordReportCard: string = studentAcademicRecord + reportCard;

  beforeAll(() => {
    const gradingPeriodSchoolId = `GradingPeriod${schoolId}`;
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentAcademicRecordReportCard,
      columns: [{ ...newColumn(), columnId: gradingPeriodSchoolId }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: reportCard,
          columnPairs: [
            { ...newColumnPair(), parentTableColumnId: gradingPeriodSchoolId, foreignTableColumnId: gradingPeriodSchoolId },
          ],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename column', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(studentAcademicRecordReportCard) as Table).columns);
    expect(column.columnId).toBe(schoolId);
  });

  it('should rename foreign key columns', (): void => {
    const foreignKey: ForeignKey = R.head(
      (tableEntities(metaEd, namespace).get(studentAcademicRecordReportCard) as Table).foreignKeys,
    );
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(schoolId);
  });
});
