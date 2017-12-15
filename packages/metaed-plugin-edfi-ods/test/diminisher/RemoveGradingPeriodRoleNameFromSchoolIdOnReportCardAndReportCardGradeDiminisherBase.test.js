// @flow
import R from 'ramda';
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnNamePair } from '../../src/model/database/ColumnNamePair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { Column } from '../../src/model/database/Column';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes ReportCard table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const reportCard: string = 'ReportCard';
  const schoolId: string = 'SchoolId';

  beforeAll(() => {
    const gradingPeriod: string = 'GradingPeriod';
    const gradingPeriodSchoolId: string = gradingPeriod + schoolId;
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: reportCard,
      columns: [
        Object.assign(newColumn(), {
          name: gradingPeriodSchoolId,
        }),
      ],
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: gradingPeriod,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: schoolId,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.x';
    enhance(metaEd);
  });

  it('should rename column', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(reportCard).columns);
    expect(column.name).toBe(schoolId);
  });

  it('should rename foreign key columns', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(reportCard).foreignKeys);
    expect(R.head(foreignKey.columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(foreignKey.columnNames).foreignTableColumnName).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes ReportCardGrade table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const grade: string = 'Grade';
  const reportCard: string = 'ReportCard';
  const schoolId: string = 'SchoolId';
  const reportCardGrade: string = reportCard + grade;

  beforeAll(() => {
    const gradingPeriodSchoolId: string = `GradingPeriod${schoolId}`;
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: reportCardGrade,
      columns: [
        Object.assign(newColumn(), {
          name: gradingPeriodSchoolId,
        }),
      ],
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: reportCard,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: gradingPeriodSchoolId,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.x';
    enhance(metaEd);
  });

  it('should remove column', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(reportCardGrade).columns);
    expect(column).toBeUndefined();
  });

  it('should rename foreign key columns', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(reportCardGrade).foreignKeys);
    expect(R.head(foreignKey.columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(foreignKey.columnNames).foreignTableColumnName).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes ReportCardStudentCompetencyObjective table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const reportCard: string = 'ReportCard';
  const schoolId: string = 'SchoolId';
  const studentCompetencyObjective: string = 'StudentCompetencyObjective';
  const reportCardStudentCompetencyObjective: string = reportCard + studentCompetencyObjective;

  beforeAll(() => {
    const gradingPeriodSchoolId: string = `GradingPeriod${schoolId}`;
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: reportCardStudentCompetencyObjective,
      columns: [
        Object.assign(newColumn(), {
          name: gradingPeriodSchoolId,
        }),
      ],
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: reportCard,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: gradingPeriodSchoolId,
            }),
          ],
        }),
        Object.assign(newForeignKey(), {
          foreignTableName: studentCompetencyObjective,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: gradingPeriodSchoolId,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.x';
    enhance(metaEd);
  });

  it('should rename column', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(reportCardStudentCompetencyObjective).columns);
    expect(column.name).toBe(schoolId);
  });

  it('should rename foreign key columns', () => {
    const foreignKeys: Array<ForeignKey> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(reportCardStudentCompetencyObjective).foreignKeys;
    expect(R.head(R.head(foreignKeys).columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(R.head(foreignKeys).columnNames).foreignTableColumnName).toBe(schoolId);
    expect(R.head(R.last(foreignKeys).columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(R.last(foreignKeys).columnNames).foreignTableColumnName).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes ReportCardStudentLearningObjective table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const reportCard: string = 'ReportCard';
  const schoolId: string = 'SchoolId';
  const studentLearningObjective: string = 'StudentLearningObjective';
  const reportCardStudentLearningObjective: string = reportCard + studentLearningObjective;

  beforeAll(() => {
    const gradingPeriodSchoolId: string = `GradingPeriod${schoolId}`;
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: reportCardStudentLearningObjective,
      columns: [
        Object.assign(newColumn(), {
          name: gradingPeriodSchoolId,
        }),
      ],
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: reportCard,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: gradingPeriodSchoolId,
            }),
          ],
        }),
        Object.assign(newForeignKey(), {
          foreignTableName: studentLearningObjective,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: gradingPeriodSchoolId,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.x';
    enhance(metaEd);
  });

  it('should rename column', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(reportCardStudentLearningObjective).columns);
    expect(column.name).toBe(schoolId);
  });

  it('should rename foreign key columns', () => {
    const foreignKeys: Array<ForeignKey> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(reportCardStudentLearningObjective).foreignKeys;
    expect(R.head(R.head(foreignKeys).columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(R.head(foreignKeys).columnNames).foreignTableColumnName).toBe(schoolId);
    expect(R.head(R.last(foreignKeys).columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(R.last(foreignKeys).columnNames).foreignTableColumnName).toBe(schoolId);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase diminishes StudentAcademicRecordReportCard table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const reportCard: string = 'ReportCard';
  const schoolId: string = 'SchoolId';
  const studentAcademicRecord: string = 'StudentAcademicRecord';
  const studentAcademicRecordReportCard: string = studentAcademicRecord + reportCard;

  beforeAll(() => {
    const gradingPeriodSchoolId: string = `GradingPeriod${schoolId}`;
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: studentAcademicRecordReportCard,
      columns: [
        Object.assign(newColumn(), {
          name: gradingPeriodSchoolId,
        }),
      ],
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: reportCard,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: gradingPeriodSchoolId,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.x';
    enhance(metaEd);
  });

  it('should rename column', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(studentAcademicRecordReportCard).columns);
    expect(column.name).toBe(schoolId);
  });

  it('should rename foreign key columns', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(studentAcademicRecordReportCard).foreignKeys);
    expect(R.head(foreignKey.columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(foreignKey.columnNames).foreignTableColumnName).toBe(schoolId);
  });
});
