import R from 'ramda';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { Table } from '../../src/model/database/Table';

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x diminishes StudentLearningObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const schoolId = 'SchoolId';
  const studentLearningObjective = 'StudentLearningObjective';

  beforeAll(() => {
    const gradingPeriod = 'GradingPeriod';
    const gradingPeriodSchoolId: string = gradingPeriod + schoolId;
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentLearningObjective,
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

    metaEd.dataStandardVersion = '2.1.0';
    enhance(metaEd);
  });

  it('should rename column', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(studentLearningObjective) as Table).columns);
    expect(column.columnId).toBe(schoolId);
  });

  it('should rename foreign key columns', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(studentLearningObjective) as Table;
    expect(R.head(foreignKeys[0].columnPairs).parentTableColumnId).toBe(schoolId);
    expect(R.head(foreignKeys[0].columnPairs).foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x diminishes StudentCompetencyObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const schoolId = 'SchoolId';
  const studentCompetencyObjective = 'StudentCompetencyObjective';

  beforeAll(() => {
    const gradingPeriod = 'GradingPeriod';
    const gradingPeriodSchoolId: string = gradingPeriod + schoolId;
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentCompetencyObjective,
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

    metaEd.dataStandardVersion = '2.1.0';
    enhance(metaEd);
  });

  it('should rename column', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(studentCompetencyObjective) as Table).columns);
    expect(column.columnId).toBe(schoolId);
  });

  it('should rename foreign key columns', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(studentCompetencyObjective) as Table;
    expect(R.head(foreignKeys[0].columnPairs).parentTableColumnId).toBe(schoolId);
    expect(R.head(foreignKeys[0].columnPairs).foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x diminishes StudentCompetencyObjectiveStudentProgramAssociation table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const schoolId = 'SchoolId';
  const gradingPeriodSchoolId = `GradingPeriod${schoolId}`;
  const studentCompetencyObjective = 'StudentCompetencyObjective';
  const studentCompetencyObjectiveStudentProgramAssociation = `${studentCompetencyObjective}StudentProgramAssociation`;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentCompetencyObjectiveStudentProgramAssociation,
      foreignKeys: [
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

    metaEd.dataStandardVersion = '2.1.0';
    enhance(metaEd);
  });

  it('should rename foreign key columns', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(
      studentCompetencyObjectiveStudentProgramAssociation,
    ) as Table;
    expect(R.head(foreignKeys[0].columnPairs).parentTableColumnId).toBe(gradingPeriodSchoolId);
    expect(R.head(foreignKeys[0].columnPairs).foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x diminishes StudentCompetencyObjectiveStudentSectionAssociation table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const schoolId = 'SchoolId';
  const gradingPeriodSchoolId = `GradingPeriod${schoolId}`;
  const studentCompetencyObjective = 'StudentCompetencyObjective';
  const studentCompetencyObjectiveStudentSectionAssociation = `${studentCompetencyObjective}StudentSectionAssociation`;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentCompetencyObjectiveStudentSectionAssociation,
      foreignKeys: [
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

    metaEd.dataStandardVersion = '2.1.0';
    enhance(metaEd);
  });

  it('should rename foreign key columns', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(
      studentCompetencyObjectiveStudentSectionAssociation,
    ) as Table;
    expect(R.head(foreignKeys[0].columnPairs).parentTableColumnId).toBe(gradingPeriodSchoolId);
    expect(R.head(foreignKeys[0].columnPairs).foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x diminishes StudentLearningObjectiveStudentProgramAssociation table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const schoolId = 'SchoolId';
  const gradingPeriodSchoolId = `GradingPeriod${schoolId}`;
  const studentLearningObjective = 'StudentLearningObjective';
  const studentLearningObjectiveStudentStudentProgramAssociation = `${studentLearningObjective}StudentProgramAssociation`;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentLearningObjectiveStudentStudentProgramAssociation,
      foreignKeys: [
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

    metaEd.dataStandardVersion = '2.1.0';
    enhance(metaEd);
  });

  it('should rename foreign key columns', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(
      studentLearningObjectiveStudentStudentProgramAssociation,
    ) as Table;
    expect(R.head(foreignKeys[0].columnPairs).parentTableColumnId).toBe(gradingPeriodSchoolId);
    expect(R.head(foreignKeys[0].columnPairs).foreignTableColumnId).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x diminishes StudentLearningObjectiveStudentSectionAssociation table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const schoolId = 'SchoolId';
  const gradingPeriodSchoolId = `GradingPeriod${schoolId}`;
  const studentLearningObjective = 'StudentLearningObjective';
  const studentLearningObjectiveStudentStudentSectionAssociation = `${studentLearningObjective}StudentSectionAssociation`;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentLearningObjectiveStudentStudentSectionAssociation,
      foreignKeys: [
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

    metaEd.dataStandardVersion = '2.1.0';
    enhance(metaEd);
  });

  it('should rename foreign key columns', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(
      studentLearningObjectiveStudentStudentSectionAssociation,
    ) as Table;
    expect(R.head(foreignKeys[0].columnPairs).parentTableColumnId).toBe(gradingPeriodSchoolId);
    expect(R.head(foreignKeys[0].columnPairs).foreignTableColumnId).toBe(schoolId);
  });
});
